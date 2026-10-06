<template>
  <DashboardPanel title="成交渠道" description="触达用户的每一个入口">
    <template #actions><span class="panel-tag">示例</span></template>

    <div class="channel-total">
      <span>全渠道成交</span>
      <strong>100%</strong>
    </div>
    <div v-for="(channel, index) in channels" :key="channel.name" class="channel-row">
      <div>
        <span>
          <i :style="{ background: channel.color }"></i>
          {{ channel.name }}
        </span>
        <b>{{ channel.value }}%</b>
      </div>
      <DashboardProgress
        :value="channel.value"
        :color="channel.color"
        :label="`${channel.name}成交占比`"
      />
      <small>{{ ['主要成交渠道', '持续增长', '稳定转化'][index] }}</small>
    </div>
  </DashboardPanel>
</template>
<script setup lang="ts">
  import DashboardPanel from '../components/DashboardPanel.vue';
  import DashboardProgress from '../components/DashboardProgress.vue';
  defineProps<{ channels: { name: string; value: number; color: string }[] }>();
</script>
