<template>
  <DashboardPanel class="focus-panel">
    <span class="focus-eyebrow">THIS WEEK</span>
    <h2>为团队腾出专注的时间</h2>
    <p>{{ description }}</p>
    <strong class="focus-number">
      {{ value }}
      <span>%</span>
    </strong>
    <DashboardProgress :value="value" label="本周目标完成进度" />
    <small>{{ target }}</small>
  </DashboardPanel>
</template>
<script setup lang="ts">
  defineProps<{ value: number; description: string; target: string }>();
  import DashboardPanel from '../components/DashboardPanel.vue';
  import DashboardProgress from '../components/DashboardProgress.vue';
</script>
