<template>
  <div class="system-website-config-container layout-padding w100">
    <el-tabs v-model="tabName" type="border-card">
      <el-tab-pane label="网站配置" name="main">
        <div class="website-config-pane">
          <ConfigWebsite ref="configWebsiteRef" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="systemWebsiteConfig">
  import { defineAsyncComponent, nextTick, onActivated, onMounted, ref } from 'vue';

  const tabName = ref('main');
  const ConfigWebsite = defineAsyncComponent(
    () => import('/@/views/system/config/ConfigWebsite.vue')
  );
  const configWebsiteRef = ref<{ initData: () => void } | null>(null);

  const refresh = () => {
    nextTick(() => {
      configWebsiteRef.value?.initData();
    });
  };

  onMounted(refresh);
  onActivated(refresh);
</script>

<style scoped lang="scss">
  .website-config-pane {
    min-height: 500px;
    padding: 32px;
    color: #6b778c;
    font-size: 14px;
  }
</style>
