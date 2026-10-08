<template>
  <SystemPage feature="tenant" compact class="tenant-page">
    <template #actions>
      <el-button type="primary" v-auth="'system:tenant:insert'" @click="tenantDialog?.open()">
        新增租户
      </el-button>
      <el-button v-auth="'system:tenantPackage:list'" @click="packageDialog?.open()">
        套餐管理
      </el-button>
      <el-button v-auth="'system:tenant:mode'" :loading="switching" @click="switchMode">
        {{ runtime.enabled ? '切换单应用' : '开启多租户' }}
      </el-button>
      <el-button @click="showConfiguration = !showConfiguration">
        {{ showConfiguration ? '收起配置' : '隔离配置' }}
      </el-button>
    </template>
    <div class="views-tool tenant-query">
      <div class="tool-left">
        <div class="tool-left-title">筛选查询</div>
        <el-form class="tenant-toolbar form-tool" size="default" inline @submit.prevent="search">
          <el-form-item label="租户">
            <el-input
              v-model="query.keyword"
              placeholder="租户编号或名称"
              clearable
              maxlength="100"
              @keyup.enter="search"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" clearable placeholder="全部状态" style="width: 120px">
              <el-option label="启用" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="tenant-summary">
      <el-tag :type="runtime.enabled ? 'success' : 'info'">
        {{ runtime.enabled ? '多租户模式' : '单应用模式' }}
      </el-tag>
      <span>共享数据库 · {{ runtime.column || '—' }} 行级隔离</span>
      <span class="tenant-shared-count">{{ runtime.exclusionTables.length }} 张共享表</span>
    </div>
    <el-card v-if="showConfiguration" shadow="never" class="tenant-card">
      <el-descriptions title="租户隔离配置" :column="1" :label-width="120" border>
        <el-descriptions-item label="隔离字段">{{ runtime.column || '—' }}</el-descriptions-item>
        <el-descriptions-item label="共享表">
          {{ runtime.exclusionTables.join('、') || '无' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card shadow="never" class="tenant-card">
      <el-table :data="rows" v-loading="loading" row-key="tenantId">
        <el-table-column prop="tenantId" label="租户编号" min-width="140" />
        <el-table-column prop="name" label="租户名称" min-width="160" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="域名" min-width="150">
          <template #default="{ row }">{{ row.domain || '未绑定' }}</template>
        </el-table-column>
        <el-table-column label="有效期" min-width="170">
          <template #default="{ row }">{{ row.expireTime || '未设置' }}</template>
        </el-table-column>
        <el-table-column label="套餐编号" min-width="140">
          <template #default="{ row }">{{ row.packageId || '未绑定' }}</template>
        </el-table-column>
        <el-table-column label="账号额度" min-width="100">
          <template #default="{ row }">{{ row.accountCount ?? '未设置' }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="{ row }">
            <el-button
              v-if="row.tenantId !== '000000'"
              link
              type="primary"
              v-auth="'system:tenant:edit'"
              @click="tenantDialog?.open(row.tenantId)"
            >
              编辑
            </el-button>
            <span v-else>平台</span>
          </template>
        </el-table-column>
      </el-table>
      <p class="tenant-note">
        套餐配置功能权限；账号额度包含初始管理员。到期或停用后租户无法登录和继续访问。
      </p>
      <el-pagination
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @current-change="load"
        @size-change="search"
      />
    </el-card>
    <TenantDialog ref="tenantDialog" @saved="load" />
    <TenantPackages ref="packageDialog" @saved="load" />
  </SystemPage>
</template>
<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import TenantDialog from './components/TenantDialog.vue';
  import TenantPackages from './components/TenantPackages.vue';
  import SystemPage from '../shared/SystemPage.vue';
  import { tenantApi } from './index';
  import type { TenantRow, TenantRuntime } from './type';
  const query = reactive<{ keyword: string; status?: number; pageNum: number; pageSize: number }>({
    keyword: '',
    status: undefined,
    pageNum: 1,
    pageSize: 10,
  });
  const runtime = reactive<TenantRuntime>({ enabled: false, column: '', exclusionTables: [] });
  const rows = ref<TenantRow[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const showConfiguration = ref(false);
  const tenantDialog = ref<InstanceType<typeof TenantDialog>>(),
    packageDialog = ref<InstanceType<typeof TenantPackages>>();
  const switching = ref(false);
  async function switchMode() {
    try {
      await ElMessageBox.confirm(
        runtime.enabled
          ? '切换为单应用后，仅默认应用账号可访问；其它租户数据保留。确定切换？'
          : '开启多租户后，已启用且未到期的租户可登录。确定开启？',
        '应用模式',
        { type: 'warning' }
      );
    } catch {
      return;
    }
    switching.value = true;
    try {
      await tenantApi.mode(!runtime.enabled);
      Object.assign(runtime, (await tenantApi.runtime()).data);
      ElMessage.success('应用模式已更新');
    } finally {
      switching.value = false;
    }
  }
  async function load() {
    loading.value = true;
    try {
      const result = await tenantApi.list(query);
      const page = result.data?.rows ? result.data : result;
      rows.value = page.rows || [];
      total.value = Number(page.total || 0);
    } finally {
      loading.value = false;
    }
  }
  function search() {
    query.pageNum = 1;
    void load();
  }
  function reset() {
    query.keyword = '';
    query.status = undefined;
    search();
  }
  onMounted(async () => {
    await Promise.all([
      load(),
      tenantApi.runtime().then((result) => Object.assign(runtime, result.data)),
    ]);
  });
</script>
<style scoped>
  .tenant-page :deep(.system-admin-heading.is-compact) {
    gap: 24px;
    margin-bottom: 16px;
  }
  .tenant-page :deep(.system-admin-heading h1) {
    margin: 0;
    white-space: nowrap;
    font-size: 22px;
  }
  .tenant-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin: 0;
  }
  .tenant-toolbar :deep(.el-form-item) {
    margin: 0 !important;
  }
  .tenant-toolbar :deep(.el-form-item__label) {
    white-space: nowrap;
  }
  .tenant-toolbar :deep(.el-input) {
    width: 200px;
  }
  .tenant-query {
    margin-bottom: 18px;
  }
  .tenant-summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  .tenant-shared-count {
    margin-left: auto;
  }
  .tenant-card {
    margin-bottom: 16px;
  }
  .tenant-note {
    margin: 16px 0 0;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  .el-pagination {
    margin-top: 16px;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  @media (max-width: 1100px) {
    .tenant-page :deep(.system-admin-heading.is-compact) {
      flex-wrap: wrap;
    }
  }
  @media (max-width: 600px) {
    .tenant-toolbar {
      width: 100%;
    }
    .tenant-toolbar :deep(.el-form-item) {
      display: flex;
      width: 100%;
    }
    .tenant-toolbar :deep(.el-input) {
      width: 100%;
    }
    .tenant-shared-count {
      margin-left: 0;
    }
  }
</style>
