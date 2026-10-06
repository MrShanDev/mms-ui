<template>
  <section class="business-console">
    <DashboardDataSource />
    <div class="metric-grid">
      <DashboardMetric
        v-for="metric in metrics.office"
        :key="metric[0]"
        :label="metric[0]"
        :value="metric[1]"
        :detail="metric[2]"
        :icon="metric[3]"
      />
    </div>
    <div class="panel-grid">
      <ApprovalList :approvals="approvals" />
      <DailySchedule :schedule="schedule" />
    </div>
    <div class="panel-grid">
      <TeamActivity :activity="activity" />
      <WeeklyGoal
        :value="weeklyGoal.value"
        :description="weeklyGoal.description"
        :target="weeklyGoal.target"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
  import DashboardDataSource from '../components/DashboardDataSource.vue';
  import DashboardMetric from '../components/DashboardMetric.vue';
  import { metrics } from '../scenes';
  import { approvals, schedule, activity, weeklyGoal } from '../demoData';
  import ApprovalList from '../widgets/ApprovalList.vue';
  import DailySchedule from '../widgets/DailySchedule.vue';
  import TeamActivity from '../widgets/TeamActivity.vue';
  import WeeklyGoal from '../widgets/WeeklyGoal.vue';
</script>
