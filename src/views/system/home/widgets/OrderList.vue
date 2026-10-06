<template>
  <DashboardPanel title="最新订单" description="关注支付与履约进展">
    <template #actions>
      <DashboardSelect
        v-model="orderFilter"
        label="订单状态筛选"
        :options="
          ['全部订单', '待发货', '已支付', '已完成'].map((value) => ({ label: value, value }))
        "
        class="period-select"
      />
    </template>

    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>订单 / 商品</th>
            <th>客户</th>
            <th>实付金额</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>
              <strong>{{ order.name }}</strong>
              <small>{{ order.id }}</small>
            </td>
            <td>{{ order.customer }}</td>
            <td>{{ order.amount }}</td>
            <td>
              <span class="status-pill" :class="{ warm: order.status === '待发货' }">
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DashboardPanel>
</template>
<script setup lang="ts">
  import DashboardPanel from '../components/DashboardPanel.vue';
  import DashboardSelect from '../components/DashboardSelect.vue';
  import { computed, ref } from 'vue';
  import type { demoOrders } from '../scenes';
  const props = defineProps<{ orders: typeof demoOrders }>();
  const orderFilter = ref('全部订单');
  const filteredOrders = computed(() =>
    props.orders.filter(
      (order) => orderFilter.value === '全部订单' || order.status === orderFilter.value
    )
  );
</script>
