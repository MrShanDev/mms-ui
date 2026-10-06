<template>
  <section class="business-console">
    <DashboardDataSource />
    <div class="metric-grid">
      <DashboardMetric
        v-for="metric in metrics.mall"
        :key="metric[0]"
        :label="metric[0]"
        :value="metric[1]"
        :detail="metric[2]"
        :icon="metric[3]"
      />
    </div>
    <div class="panel-grid">
      <SalesTrend :series="salesSeries" />
      <ChannelDistribution :channels="channels" />
    </div>
    <OrderList :orders="demoOrders" />
  </section>
</template>
<script setup lang="ts">
  import DashboardDataSource from '../components/DashboardDataSource.vue';
  import DashboardMetric from '../components/DashboardMetric.vue';
  import { metrics } from '../scenes';
  import { salesSeries, channels, demoOrders } from '../demoData';
  import SalesTrend from '../widgets/SalesTrend.vue';
  import ChannelDistribution from '../widgets/ChannelDistribution.vue';
  import OrderList from '../widgets/OrderList.vue';
</script>
