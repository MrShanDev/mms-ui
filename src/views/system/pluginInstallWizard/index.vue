<template>
  <div class="plugin-install-wizard-page layout-padding layout-padding-auto">
    <div class="plugin-install-wizard-page__head">
      <el-page-header @back="goMarket">
        <template #content>
          <span class="plugin-install-wizard-page__title">插件安装向导（全屏）</span>
        </template>
      </el-page-header>
      <p class="text-gray plugin-install-wizard-page__hint">
        与插件市场「上传安装」弹窗流程一致，并包含<strong>联邦前端</strong>说明步骤。适合分步对照文档完成安装；快速安装仍可在
        <el-button link type="primary" @click="goMarket">插件市场</el-button>
        使用上传入口。安装前请阅读
        <el-button link type="primary" @click="goAgreement">《插件使用协议》</el-button>
        。
      </p>
    </div>
    <el-card shadow="never" class="plugin-install-wizard-page__card">
      <PluginInstallWizard variant="page" />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="systemPluginInstallWizard">
import { useRouter } from 'vue-router';
import PluginInstallWizard from '../pluginMarket/components/PluginInstallWizard.vue';

const router = useRouter();

function goMarket() {
  router.push('/system/pluginMarket');
}

function goAgreement() {
  router.push('/system/pluginUsageAgreement');
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
</style>
