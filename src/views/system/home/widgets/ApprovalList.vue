<template>
  <DashboardPanel title="待办审批" description="聚焦需要你关注的事项">
    <template #actions>
      <DashboardSelect
        v-model="approvalFilter"
        label="审批类型筛选"
        :options="
          ['全部类型', '采购', '报销', '请假', '合同'].map((value) => ({ label: value, value }))
        "
        class="period-select"
      />
    </template>

    <div v-for="item in filteredApprovals" :key="item.title" class="approval-row">
      <span class="avatar">{{ item.person.slice(-1) }}</span>
      <div class="row-copy">
        <strong>{{ item.title }}</strong>
        <p>{{ item.person }} · {{ item.detail }}</p>
      </div>
      <div class="row-meta">
        <span v-if="item.urgent" class="status-pill warm">优先</span>
        <small>{{ item.time }}</small>
      </div>
    </div>
  </DashboardPanel>
</template>
<script setup lang="ts">
  import DashboardPanel from '../components/DashboardPanel.vue';
  import DashboardSelect from '../components/DashboardSelect.vue';
  import { computed, ref } from 'vue';
  import type { approvals as approvalsData } from '../scenes';
  const props = defineProps<{ approvals: typeof approvalsData }>();
  const approvalFilter = ref('全部类型');
  const filteredApprovals = computed(() =>
    props.approvals.filter(
      (item) => approvalFilter.value === '全部类型' || item.type === approvalFilter.value
    )
  );
</script>
