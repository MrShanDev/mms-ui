<template>
  <section class="website-plugin-page">
    <header>
      <span>官网管理</span>
      <h1>网站配置</h1>
      <p>维护官网展示信息、SEO 与品牌内容。</p>
    </header>
    <el-card shadow="never"><WebsiteSettings /></el-card>
  </section>
</template>
<script setup lang="ts">
  import WebsiteSettings from './components/WebsiteSettings.vue';
</script>
<style scoped lang="scss">
  .website-plugin-page { padding: 24px; min-width: 0; color: var(--el-text-color-primary); }
  header { margin-bottom: 22px; }
  header span { color: var(--el-color-primary); font-size: 11px; }
  h1 { margin: 8px 0; font-size: 24px; }
  p { margin: 0; color: var(--el-text-color-secondary); font-size: 12px; }
  :deep(.el-card) { border-radius: 14px; }
  @media (max-width: 600px) { .website-plugin-page { padding: 16px 12px; } }
</style>
