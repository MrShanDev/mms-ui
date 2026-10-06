<template>
  <component :is="pages[scene]" />
</template>
<script setup lang="ts">
  import MallDashboard from './pages/MallDashboard.vue';
  import OfficeDashboard from './pages/OfficeDashboard.vue';
  import TaskDashboard from './pages/TaskDashboard.vue';
  import type { SceneKey } from './scenes';
  defineProps<{ scene: Exclude<SceneKey, 'base'> }>();
  const pages = { mall: MallDashboard, office: OfficeDashboard, task: TaskDashboard };
</script>
