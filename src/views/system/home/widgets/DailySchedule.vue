<template>
  <DashboardPanel title="今日日程" description="给重要的事情留出时间">
    <template #actions><SvgIcon name="ele-Calendar" :size="20" /></template>

    <div class="schedule-row" v-for="(item, index) in schedule" :key="item.title">
      <div class="schedule-time">
        {{ item.time }}
        <small>{{ item.duration }}</small>
      </div>
      <div class="schedule-copy" :class="{ current: index === 1 }">
        <strong>{{ item.title }}</strong>
        <p>{{ item.place }}</p>
        <span>{{ item.team }}</span>
      </div>
    </div>
  </DashboardPanel>
</template>
<script setup lang="ts">
  import DashboardPanel from '../components/DashboardPanel.vue';
  import type { schedule as scheduleData } from '../demoData';
  defineProps<{ schedule: typeof scheduleData }>();
</script>
