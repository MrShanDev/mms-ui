<template>
  <DashboardPanel class="project-overview">
    <div>
      <span class="focus-eyebrow">SPRINT OVERVIEW · 示例</span>
      <h2>{{ project.name }}</h2>
      <p>{{ project.description }}</p>
    </div>
    <div class="project-progress">
      <span>
        迭代进度
        <b>{{ project.progress }}%</b>
      </span>
      <DashboardProgress :value="project.progress" label="迭代进度" />
      <small>里程碑：{{ project.milestone }}</small>
    </div>
  </DashboardPanel>
</template>
<script setup lang="ts">
  defineProps<{
    project: { name: string; description: string; progress: number; milestone: string };
  }>();
  import DashboardPanel from '../components/DashboardPanel.vue';
  import DashboardProgress from '../components/DashboardProgress.vue';
</script>
