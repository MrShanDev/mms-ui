<template>
  <el-alert title="应用模式可在租户管理中切换，即时生效。单应用模式保留默认租户数据隔离；共享表及字段配置仍由部署配置管理。" type="info" :closable="false" show-icon class="mb20" />
  <el-descriptions v-loading="loading" :column="1" border>
    <el-descriptions-item label="应用模式">{{ runtime.enabled ? '多租户' : '单应用' }}</el-descriptions-item>
    <el-descriptions-item label="数据隔离">已启用</el-descriptions-item>
    <el-descriptions-item label="租户字段">{{ runtime.column }}</el-descriptions-item>
    <el-descriptions-item label="全局共享表">{{ runtime.exclusionTables.join(', ') || '无' }}</el-descriptions-item>
  </el-descriptions>
  <el-button class="mt20" @click="initData" :loading="loading">刷新运行配置</el-button>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
const loading = ref(false);
const runtime = reactive({ enabled: false, column: '', exclusionTables: [] as string[] });
const initData = async () => {
  loading.value = true;
  try { const res = await request({url: getEnv() + '/system/config/tenantRuntime', method: 'get'}); Object.assign(runtime, res.data); }
  finally { loading.value = false; }
};
onMounted(initData);
defineExpose({initData});
</script>
