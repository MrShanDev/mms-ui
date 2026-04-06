<template>
  <div class="layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <template #header>
        <span>Redis 预览（插件）</span>
        <el-button type="primary" size="small" class="ml-2" :loading="metaLoading" @click="loadMeta">刷新连接信息</el-button>
      </template>
      <el-alert
        v-if="meta && !meta.configured"
        type="warning"
        show-icon
        :closable="false"
        title="尚未配置 redis.inspect"
        :description="'请在 sys_config 增加键后缀「' + (meta.configKeySuffix || 'redis.inspect') + '」的 JSON（见 mms-plugin-redis-inspect/script/redis.inspect.example.json）'"
      />
      <p v-else-if="meta" class="text-gray-600 text-sm mb-3">
        目标：<code>{{ meta.host }}:{{ meta.port }}</code> db=<code>{{ meta.database }}</code> ssl=<code>{{ meta.ssl }}</code>
      </p>
      <el-form :inline="true" class="mb-3">
        <el-form-item label="键前缀">
          <el-input v-model="prefix" placeholder="留空=全部" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="COUNT">
          <el-input-number v-model="count" :min="1" :max="500" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="scanLoading" @click="runScan(true)">SCAN</el-button>
          <el-button :disabled="!scanCursor || scanDone" :loading="scanLoading" @click="runScan(false)">下一页</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="keys" border size="small" max-height="380" @row-click="onRowClick">
        <el-table-column prop="k" label="键" min-width="280" />
      </el-table>
    </el-card>

    <el-drawer v-model="drawerVisible" title="键详情" size="50%">
      <el-skeleton v-if="detailLoading" :rows="6" animated />
      <template v-else-if="detail">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="键">{{ detail.key }}</el-descriptions-item>
          <el-descriptions-item label="存在">{{ detail.exists }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.exists" label="类型">{{ detail.type }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.exists" label="TTL(秒)">{{ detail.ttlSeconds }}</el-descriptions-item>
        </el-descriptions>
        <pre v-if="detailJson" class="mt-3 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-96">{{ detailJson }}</pre>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import request from '/@/utils/request';
import { pluginHostMvcPrefix } from '/@/utils/mms';

const PLUGIN_ID = 'mms.plugin.redis-inspect';
const API = `${pluginHostMvcPrefix()}/${PLUGIN_ID}/ri`;

const metaLoading = ref(false);
const meta = ref<any>(null);
const prefix = ref('');
const count = ref(100);
const scanLoading = ref(false);
const keys = ref<{ k: string }[]>([]);
const scanCursor = ref('');
const scanDone = ref(true);

const drawerVisible = ref(false);
const detailLoading = ref(false);
const detail = ref<any>(null);

const detailJson = computed(() => {
  if (!detail.value) return '';
  try {
    return JSON.stringify(detail.value, null, 2);
  } catch {
    return String(detail.value);
  }
});

async function loadMeta() {
  metaLoading.value = true;
  try {
    const res: any = await request({ url: `${API}/meta`, method: 'get' });
    const data = res?.data != null && res?.configured === undefined ? res.data : res;
    meta.value = data;
  } catch {
    meta.value = null;
  } finally {
    metaLoading.value = false;
  }
}

async function runScan(reset: boolean) {
  if (reset) {
    scanCursor.value = '';
    scanDone.value = false;
    keys.value = [];
  }
  scanLoading.value = true;
  try {
    const res: any = await request({
      url: `${API}/scan`,
      method: 'get',
      params: {
        prefix: prefix.value || undefined,
        cursor: reset ? undefined : scanCursor.value || undefined,
        count: count.value,
      },
    });
    const data = res?.data != null && res?.keys === undefined ? res.data : res;
    const ks: string[] = Array.isArray(data?.keys) ? data.keys : [];
    for (const k of ks) {
      keys.value.push({ k });
    }
    scanCursor.value = data?.cursor ?? '0';
    scanDone.value = !!data?.done;
    if (ks.length === 0 && !data?.done) {
      ElMessage.info('本轮无键，可继续下一页');
    }
  } catch {
    /* 拦截器 */
  } finally {
    scanLoading.value = false;
  }
}

async function loadKey(k: string) {
  detail.value = null;
  detailLoading.value = true;
  drawerVisible.value = true;
  try {
    const res: any = await request({
      url: `${API}/key`,
      method: 'get',
      params: { k },
    });
    const data = res?.data != null && res?.key === undefined ? res.data : res;
    detail.value = data;
  } catch {
    drawerVisible.value = false;
  } finally {
    detailLoading.value = false;
  }
}

function onRowClick(row: { k: string }) {
  if (row?.k) {
    loadKey(row.k);
  }
}

onMounted(() => {
  loadMeta();
});
</script>
