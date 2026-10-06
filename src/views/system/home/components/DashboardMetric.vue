<template>
  <article class="metric-card">
    <div class="metric-heading">
      {{ label }}
      <span class="metric-icon"><SvgIcon :name="icon" :size="19" /></span>
    </div>
    <strong>{{ value }}</strong>
    <small>{{ detail }}</small>
  </article>
</template>
<script setup lang="ts">
  defineProps<{ label: string; value: string | number; detail: string; icon: string }>();
</script>
