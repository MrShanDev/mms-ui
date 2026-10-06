<template>
  <section class="business-console">
    <DashboardDataSource />
    <div class="metric-grid">
      <DashboardMetric
        v-for="metric in metrics.task"
        :key="metric[0]"
        :label="metric[0]"
        :value="metric[1]"
        :detail="metric[2]"
        :icon="metric[3]"
      />
    </div>
    <ProjectOverview :project="project" />
    <TaskBoard :tasks="demoTasks" />
  </section>
</template>
<script setup lang="ts">
  import DashboardDataSource from '../components/DashboardDataSource.vue';
  import DashboardMetric from '../components/DashboardMetric.vue';
  import { metrics } from '../scenes';
  import { demoTasks, project } from '../demoData';
  import ProjectOverview from '../widgets/ProjectOverview.vue';
  import TaskBoard from '../widgets/TaskBoard.vue';
</script>
