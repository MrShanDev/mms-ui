<template>
  <nav class="scene-switch" aria-label="控制台场景">
    <button
      v-for="item in scenes"
      :key="item.key"
      type="button"
      :class="{ 'is-selected': modelValue === item.key }"
      :aria-pressed="modelValue === item.key"
      @click="emit('update:modelValue', item.key)"
    >
      <SvgIcon :name="item.icon" :size="17" />
      {{ item.label }}
    </button>
  </nav>
</template>
<script setup lang="ts">
  import { scenes, type SceneKey } from '../scenes';
  defineProps<{ modelValue: SceneKey }>();
  const emit = defineEmits<{ 'update:modelValue': [value: SceneKey] }>();
</script>
