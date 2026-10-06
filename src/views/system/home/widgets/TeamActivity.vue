<template>
  <DashboardPanel title="团队动态" description="让进展保持同步">
    <template #actions><span class="panel-tag">示例</span></template>

    <div v-for="item in activity" :key="item.title" class="activity-row">
      <span class="activity-dot"></span>
      <div>
        <strong>{{ item.title }}</strong>
        <p>{{ item.detail }}</p>
      </div>
      <small>{{ item.time }}</small>
    </div>
  </DashboardPanel>
</template>
<script setup lang="ts">
  import DashboardPanel from '../components/DashboardPanel.vue';
  import type { activity as activityData } from '../demoData';
  defineProps<{ activity: typeof activityData }>();
</script>
