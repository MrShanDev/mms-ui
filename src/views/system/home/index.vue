<template>
  <div class="console-shell" :style="{ '--scene-accent': scene.color }">
    <div class="console-toolbar">
      <div>
        <span class="workspace-dot"></span>
        <strong>MMS 工作空间</strong>
        <span class="workspace-caption">/ 控制台</span>
      </div>
      <span class="console-date">{{ dateLabel }}</span>
    </div>
    <DashboardHero v-if="selected !== 'base'" :key="`hero-${selected}`" :scene="scene" />
    <component :is="dashboardPage" :key="selected" />
  </div>
</template>
<script setup lang="ts" name="homeinfo">
  import { computed } from 'vue';
  import DashboardHero from './components/DashboardHero.vue';
  import BaseDashboard from './pages/BaseDashboard.vue';
  import MallDashboard from './pages/MallDashboard.vue';
  import OfficeDashboard from './pages/OfficeDashboard.vue';
  import TaskDashboard from './pages/TaskDashboard.vue';
  import { useThemeConfig } from '/@/stores/themeConfig';
  import { scenes, type SceneKey } from './scenes';
  import './dashboard.scss';
  import './dashboard-motion.scss';
  const themeStore = useThemeConfig();
  const selected = computed<SceneKey>(() => themeStore.themeConfig.dashboardScene || 'base');
  const scene = computed(() => scenes.find((item) => item.key === selected.value) || scenes[0]);
  const dashboardPage = computed(
    () =>
      ({ base: BaseDashboard, mall: MallDashboard, office: OfficeDashboard, task: TaskDashboard })[
        selected.value
      ]
  );
  const dateLabel = new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(new Date());
</script>
