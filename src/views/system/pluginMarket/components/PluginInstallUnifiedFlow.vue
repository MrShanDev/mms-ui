<template>
  <div class="plugin-install-unified">
    <!-- 仅查看协议（插件市场顶部按钮） -->
    <template v-if="flowMode === 'agreement'">
      <div class="plugin-install-unified__agreement">
        <el-alert type="warning" :closable="false" show-icon title="请阅读《插件使用协议》全文" />
        <div class="plugin-install-unified__agreement-scroll">
          <PluginUsageAgreementContent />
        </div>
      </div>
      <div class="plugin-install-unified__footer plugin-install-unified__footer--single">
        <el-button type="primary" @click="emit('close')">关闭</el-button>
      </div>
    </template>

    <!-- 完整安装：统一走 4 步安装向导 -->
    <template v-else>
      <PluginInstallWizard
        ref="wizardRef"
        :variant="variant"
        :embedded-in-unified-flow="true"
        :require-agreement-at-install-step="false"
        @close="emit('close')"
        @installed="emit('installed')"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import PluginInstallWizard from './PluginInstallWizard.vue';
import PluginUsageAgreementContent from './PluginUsageAgreementContent.vue';

const props = withDefaults(
  defineProps<{
    variant: 'dialog' | 'page';
    flowMode?: 'install' | 'agreement';
    initialFile?: File | null;
  }>(),
  { flowMode: 'install', initialFile: null }
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'installed'): void;
}>();

const wizardRef = ref<InstanceType<typeof PluginInstallWizard> | null>(null);

watch(
  () => props.initialFile,
  async (f) => {
    if (f && wizardRef.value) {
      await wizardRef.value.startWithFile(f);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (props.initialFile) {
    await nextTick();
    await wizardRef.value?.startWithFile(props.initialFile);
  }
});
</script>

<style scoped>
.plugin-install-unified__agreement-scroll {
  margin: 10px 0 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-lighter);
  max-height: 320px;
  overflow: auto;
}
.plugin-install-unified__footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
.plugin-install-unified__footer--single {
  justify-content: flex-end;
  border-top: none;
  margin-top: 8px;
  padding-top: 0;
}
.text-gray {
  color: var(--el-text-color-secondary);
}
.mt-3 {
  margin-top: 12px;
}
.mb-3 {
  margin-bottom: 12px;
}
</style>
