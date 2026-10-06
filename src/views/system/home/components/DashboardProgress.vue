<template>
  <div
    class="progress-track"
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="safeValue"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <i :style="{ width: `${safeValue}%`, background: color }"></i>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  const props = defineProps<{ value: number; label: string; color?: string }>();
  const safeValue = computed(() =>
    Number.isFinite(props.value) ? Math.min(100, Math.max(0, props.value)) : 0
  );
</script>
