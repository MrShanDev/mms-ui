<template>
  <DashboardPanel title="任务看板" description="从计划到完成，看见每一步进展" class="task-panel">
    <template #actions>
      <div class="task-filters">
        <el-input
          v-model="taskSearch"
          placeholder="搜索任务或负责人"
          clearable
          aria-label="搜索任务或负责人"
        />
        <DashboardSelect
          v-model="projectFilter"
          label="项目筛选"
          :options="
            ['全部项目', ...new Set(tasks.map((task) => task.project))].map((value) => ({
              label: value,
              value,
            }))
          "
        />
      </div>
    </template>

    <div class="kanban">
      <section v-for="stage in stages" :key="stage" class="kanban-column">
        <h3>
          <span class="stage-dot" :class="{ completed: stage === '已完成' }"></span>
          {{ stage }}
          <span>{{ tasksAt(stage).length }}</span>
        </h3>
        <article v-for="task in tasksAt(stage)" :key="task.title" class="task-card">
          <div class="task-card-top">
            <span>{{ task.project }}</span>
            <b :class="{ high: task.priority === '高' }">{{ task.priority }}优先</b>
          </div>
          <h4>{{ task.title }}</h4>
          <DashboardProgress :value="task.progress" :label="`${task.title}完成进度`" />
          <div class="task-card-bottom">
            <span>
              <i class="mini-avatar">{{ task.initials }}</i>
              {{ task.owner }}
            </span>
            <small>{{ task.date }}</small>
          </div>
        </article>
        <p v-if="!tasksAt(stage).length" class="empty-column">暂无匹配任务</p>
      </section>
    </div>
    <p class="board-note">看板为示例展示；不执行任务状态更新或业务写入。</p>
  </DashboardPanel>
</template>
<script setup lang="ts">
  import DashboardPanel from '../components/DashboardPanel.vue';
  import DashboardProgress from '../components/DashboardProgress.vue';
  import DashboardSelect from '../components/DashboardSelect.vue';
  import { computed, ref } from 'vue';
  import type { demoTasks } from '../scenes';
  const props = defineProps<{ tasks: typeof demoTasks }>();
  const taskSearch = ref('');
  const projectFilter = ref('全部项目');
  const stages = ['待开始', '进行中', '待验收', '已完成'];
  const filteredTasks = computed(() =>
    props.tasks.filter(
      (task) =>
        (projectFilter.value === '全部项目' || task.project === projectFilter.value) &&
        `${task.title} ${task.owner} ${task.project}`.includes(taskSearch.value.trim())
    )
  );
  const tasksAt = (stage: string) => filteredTasks.value.filter((task) => task.stage === stage);
</script>
