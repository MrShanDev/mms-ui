<template>
  <div class="system-plugin-market layout-padding layout-padding-auto">
    <el-card shadow="hover">
      <template #header>
        <span>插件宿主（仅超级管理员）</span>
        <el-button type="primary" class="ml-3" :loading="loading" @click="loadAll">刷新</el-button>
        <el-button type="warning" :loading="reloading" @click="onReload">重新加载插件</el-button>
      </template>
      <div v-if="statusBody">
        <p class="text-sm mb-3">
          enabled: <b>{{ statusBody.enabled }}</b> · hostMmsRevision:
          <b>{{ statusBody.hostMmsRevision }}</b> · rootDir: {{ statusBody.rootDir || '(默认 user.dir/mms-plugins)' }}
        </p>
        <el-table :data="statusBody.plugins || []" border size="small">
          <el-table-column prop="pluginId" label="插件 ID" min-width="200" />
          <el-table-column prop="version" label="版本" width="100" />
          <el-table-column prop="name" label="名称" min-width="120" />
          <el-table-column prop="state" label="状态" width="100" />
        </el-table>
        <el-divider />
        <div class="text-sm mb-2">Manifest（plugin.json，含 frontend）</div>
        <el-table :data="manifests" border size="small" empty-text="暂无已加载插件">
          <el-table-column prop="id" label="插件 ID" min-width="200" />
          <el-table-column prop="version" label="版本" width="100" />
          <el-table-column prop="kind" label="kind" width="100" />
          <el-table-column label="frontend" min-width="220" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.frontend ? JSON.stringify(row.frontend) : '—' }}
            </template>
          </el-table-column>
        </el-table>
        <el-divider />
        <div class="text-sm mb-2">健康检查（PluginHealthContributor）</div>
        <el-table :data="healthRows" border size="small" empty-text="请先刷新或启用 mms.plugin.enabled">
          <el-table-column prop="pluginId" label="插件 ID" min-width="180" />
          <el-table-column prop="version" label="版本" width="90" />
          <el-table-column prop="state" label="state" width="120" />
          <el-table-column prop="body" label="body" min-width="220" show-overflow-tooltip />
        </el-table>
        <el-divider />
        <el-upload :show-file-list="false" accept=".jar" :http-request="onUpload">
          <el-button type="success">上传安装 .jar（将触发全量 reload）</el-button>
        </el-upload>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="systemPluginMarket">
import { ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import {
  fetchPluginHostHealth,
  fetchPluginHostStatus,
  fetchPluginManifests,
  installPluginJar,
  reloadPlugins,
} from './api';

const loading = ref(false);
const reloading = ref(false);
const statusBody = reactive<any>({});
const healthRows = ref<any[]>([]);
const manifests = ref<any[]>([]);

async function loadAll() {
  loading.value = true;
  try {
    const res: any = await fetchPluginHostStatus();
    const data = res?.data ?? {};
    Object.assign(statusBody, data);
    const hres: any = await fetchPluginHostHealth();
    healthRows.value = hres?.data ?? [];
    const mres: any = await fetchPluginManifests();
    manifests.value = mres?.data ?? [];
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false;
  }
}

async function onReload() {
  reloading.value = true;
  try {
    await reloadPlugins();
    ElMessage.success('已重新加载');
    await loadAll();
  } finally {
    reloading.value = false;
  }
}

async function onUpload(opt: UploadRequestOptions) {
  try {
    await installPluginJar(opt.file as File);
    ElMessage.success('已安装并重载');
    await loadAll();
  } catch {
    /* */
  }
}

onMounted(() => loadAll());
</script>
