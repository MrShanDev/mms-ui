<template>
  <DashboardPanel title="销售趋势" description="经营的每一次增长，都值得关注" class="trend-panel">
    <template #actions>
      <DashboardSelect
        v-model="period"
        label="销售趋势周期"
        :options="[
          { label: '近 7 天', value: 'week' },
          { label: '近 30 天', value: 'month' },
        ]"
        class="period-select"
      />
    </template>

    <div class="chart-summary">
      <strong>{{ salesTotal }}</strong>
      <span>周期成交额 · 示例</span>
    </div>
    <div
      class="bar-chart"
      role="img"
      :aria-label="`${period === 'week' ? '近七天' : '近三十天'}示例销售柱状图`"
    >
      <div v-for="(value, index) in chartValues" :key="index" class="chart-column">
        <span class="bar-value">¥{{ (value / 1000).toFixed(1) }}k</span>
        <i
          :style="{
            height: `${Math.max(...chartValues) ? (value / Math.max(...chartValues)) * 90 : 0}%`,
          }"
        ></i>
        <small>
          {{
            period === 'week'
              ? ['周三', '周四', '周五', '周六', '周日', '周一', '周二'][index]
              : ['1–4日', '5–8日', '9–12日', '13–16日', '17–20日', '21–24日', '25–30日'][index]
          }}
        </small>
      </div>
    </div>
  </DashboardPanel>
</template>
<script setup lang="ts">
  import DashboardPanel from '../components/DashboardPanel.vue';
  import DashboardSelect from '../components/DashboardSelect.vue';
  import { computed, ref } from 'vue';
  const props = defineProps<{ series: Record<string, number[]> }>();
  const period = ref('week');
  const chartValues = computed(() => props.series[period.value] || []);
  const salesTotal = computed(() =>
    new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      maximumFractionDigits: 0,
    }).format(chartValues.value.reduce((sum, value) => sum + value, 0))
  );
</script>
