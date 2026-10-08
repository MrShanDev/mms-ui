<template>
  <el-dialog v-model="visible" :title="String(notice.title || '公告预览')" width="760px" class="notice-preview-dialog" @closed="clear">
    <div v-loading="loading" class="notice-preview-body">
      <div class="notice-preview-meta">
        <el-tag :type="String(notice.status) === '1' ? 'success' : 'info'">{{ String(notice.status) === '1' ? '已发布' : '未发布' }}</el-tag>
        <span>{{ notice.updatedTime || notice.createdTime || '' }}</span>
      </div>
      <div v-if="notice.content" class="notice-preview-content" v-html="safeContent"></div>
      <el-empty v-else-if="!loading" description="暂无公告正文" :image-size="80" />
    </div>
    <template #footer><el-button @click="visible = false">关闭</el-button></template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import DOMPurify from 'dompurify';
import { noticeApi } from '../index';
import type { NoticeEntity } from '../type';
const visible = ref(false);
const loading = ref(false);
const notice = ref<Partial<NoticeEntity>>({});
let generation = 0;
const safeContent = computed(() => DOMPurify.sanitize(String(notice.value.content || '')));
async function open(row: NoticeEntity) {
  const current = ++generation;
  notice.value = { title: row.title };
  visible.value = true;
  loading.value = true;
  try {
    const result = await noticeApi().query(row.id);
    if (current !== generation) return;
    if (!result.data) { visible.value = false; return; }
    notice.value = result.data;
  } catch {
    if (current === generation) visible.value = false;
  } finally {
    if (current === generation) loading.value = false;
  }
}
function clear() { ++generation; notice.value = {}; loading.value = false; }
defineExpose({ open });
</script>
<style scoped>
.notice-preview-body { min-height: 120px; }
.notice-preview-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; color: var(--el-text-color-secondary); font-size: 12px; }
.notice-preview-content { line-height: 1.8; overflow-wrap: anywhere; }
.notice-preview-content :deep(img), .notice-preview-content :deep(video) { max-width: 100%; height: auto; }
.notice-preview-content :deep(table) { display: block; max-width: 100%; overflow-x: auto; }
.notice-preview-content :deep(pre) { white-space: pre-wrap; }
:global(.notice-preview-dialog) { max-width: 94vw; }
</style>
