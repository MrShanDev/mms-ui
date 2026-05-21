<template>
  <div class="mms-plugin-remote-sample">
    <p class="mms-plugin-remote-sample__title">联邦 Remote 示例（依赖主工程工具）</p>
    <p class="mms-plugin-remote-sample__time">主工程 formatDate：{{ timeLabel }}</p>
    <p class="mms-plugin-remote-sample__hint">
      源码在 packages/plugin-remote-sample；`/@` 指向 mms-ui/src，构建会打进本 Remote，Vue/Element 运行时与 Host 走 shared。
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// 来自主工程 src（由 vite alias /@ 解析）
import { formatDate } from '@mms-ui/plugin-common-kit/utils/formatTime';

const timeLabel = computed(() => formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS'));
</script>

<style scoped>
.mms-plugin-remote-sample {
  padding: 12px;
  border: 1px dashed var(--el-border-color, #dcdfe6);
  border-radius: 4px;
}
.mms-plugin-remote-sample__title {
  font-weight: 600;
  margin: 0 0 8px;
}
.mms-plugin-remote-sample__time {
  margin: 0 0 8px;
  font-family: ui-monospace, monospace;
}
.mms-plugin-remote-sample__hint {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary, #909399);
}
</style>
