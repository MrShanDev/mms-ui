<template>
  <SystemPage feature="config">
    <div class="system-sysConfig-container layout-padding">
      <el-tabs v-model="selectedName" type="border-card">
        <el-tab-pane label="系统配置" name="system">
          <el-tabs v-model="selectedItemName" tab-position="top" class="system-tabs">
            <el-tab-pane label="基础设置" name="base" lazy>
              <ConfigBase></ConfigBase>
            </el-tab-pane>
            <el-tab-pane label="存储配置" name="oss" lazy>
              <ConfigOss></ConfigOss>
            </el-tab-pane>
            <el-tab-pane label="多租户配置" name="tenant" lazy>
              <ConfigTenant></ConfigTenant>
            </el-tab-pane>
            <el-tab-pane label="短信设置" name="sms" lazy>
              <ConfigSms></ConfigSms>
            </el-tab-pane>
            <el-tab-pane label="邮件设置" name="email" lazy>
              <ConfigEmail />
            </el-tab-pane>
            <el-tab-pane label="微信设置" name="wechat" lazy>
              <ConfigWx />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="自定义参数" name="user" lazy>
          <ConfigUse></ConfigUse>
        </el-tab-pane>
      </el-tabs>
    </div>
  </SystemPage>
</template>

<script setup lang="ts" name="systemConfig">
  import SystemPage from '/@/views/system/shared/SystemPage.vue';
  import { defineAsyncComponent, ref } from 'vue';
  const selectedName = ref('system');
  const selectedItemName = ref('base');
  const ConfigBase = defineAsyncComponent(() => import('./components/BaseSettings.vue'));
  const ConfigOss = defineAsyncComponent(() => import('./components/StorageSettings.vue'));
  const ConfigTenant = defineAsyncComponent(() => import('./components/TenantSettings.vue'));
  const ConfigSms = defineAsyncComponent(() => import('./components/SmsSettings.vue'));
  const ConfigEmail = defineAsyncComponent(() => import('./components/EmailSettings.vue'));
  const ConfigWx = defineAsyncComponent(() => import('./components/WechatSettings.vue'));
  const ConfigUse = defineAsyncComponent(() => import('./components/CustomParameters.vue'));
</script>

<style scoped lang="scss">
  .system-sysConfig-container > :deep(.el-tabs > .el-tabs__content) {
    padding-top: 5px;
  }
  .system-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }

  .el-tabs--right .el-tabs__content,
  .el-tabs--left .el-tabs__content {
    height: 100%;
  }
  .system-tabs-item {
    padding-top: 40px;
    padding-bottom: 10px;
  }
</style>
