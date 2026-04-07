<template>
  <div class="plugin-install-wizard-page layout-padding layout-padding-auto">
    <div class="plugin-install-wizard-page__head">
      <el-page-header @back="goMarket">
        <template #content>
          <span class="plugin-install-wizard-page__title">插件安装</span>
        </template>
      </el-page-header>
      <p class="text-gray plugin-install-wizard-page__hint">
        与插件市场「上传安装」为<strong>同一套流程</strong>：<strong>安装协议</strong> → <strong>选择 JAR</strong> →
        <strong>分步安装向导</strong>（环境检测、建表 DDL、联邦前端说明、安装加载、权限菜单、健康检查）。也可在
        <el-button link type="primary" @click="goMarket">插件市场</el-button>
        直接上传安装。
      </p>
    </div>
    <el-card shadow="never" class="plugin-install-wizard-page__card">
      <PluginInstallUnifiedFlow variant="page" flow-mode="install" @close="goMarket" @installed="goMarket" />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="systemPluginInstallWizard">
import { useRouter } from 'vue-router';
import PluginInstallUnifiedFlow from '../pluginMarket/components/PluginInstallUnifiedFlow.vue';

const router = useRouter();

function goMarket() {
  router.push('/system/pluginMarket');
}
</script>

<style scoped>
.plugin-install-wizard-page__head {
  margin-bottom: 16px;
}
.plugin-install-wizard-page__title {
  font-size: 18px;
  font-weight: 600;
}
.plugin-install-wizard-page__hint {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.6;
  max-width: 920px;
}
.plugin-install-wizard-page__card {
  max-width: 960px;
}
.text-gray {
  color: var(--el-text-color-secondary);
}
</style>
