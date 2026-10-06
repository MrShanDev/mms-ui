<template>
  <el-select
    :model-value="modelValue"
    :aria-label="label"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>
<script setup lang="ts">
  defineProps<{ modelValue: string; label: string; options: { label: string; value: string }[] }>();
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>
