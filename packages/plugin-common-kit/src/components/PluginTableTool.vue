<template>
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px">
    <el-button type="primary" @click="$emit('insert', { type: 'insert' })">新增</el-button>
    <el-button type="danger" :disabled="!hasSelection" @click="$emit('deletes', { type: 'delete', ids: selectIds })">批量删除</el-button>
    <slot name="extra" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ hasSelection?: boolean; selectIds?: string }>();
defineEmits<{
  insert: [{ type: string }];
  deletes: [{ type: string; ids?: string }];
}>();
</script>