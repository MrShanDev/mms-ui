<template>
  <div class="home-container layout-pd">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="15" class="home-card-stats">
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-orange">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#ff8c00"><ele-Memo /></el-icon>
            </div>
            <div>
              <div class="stat-label">今日订单</div>
              <div class="stat-subtitle">Today's orders</div>
            </div>
          </div>
          
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todayOrders }}</div>
            <div class="stat-trend ml20" :class="state.statsData.ordersChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.ordersChange >= 0 ? '+' : '' }}{{ state.statsData.ordersChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.ordersChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-green">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#2dac34"><ele-User /></el-icon>
            </div>
            <div>
              <div class="stat-label">今日用户</div>
              <div class="stat-subtitle">today's users</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todayUsers }}</div>
            <div class="stat-trend ml20" :class="state.statsData.usersChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.usersChange >= 0 ? '+' : '' }}{{ state.statsData.usersChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.usersChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-blue">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#409eff"><ele-Tickets /></el-icon>
            </div>
            <div>
              <div class="stat-label">今日售后</div>
              <div class="stat-subtitle">After-sales service</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todayAfterSales }}</div>
            <div class="stat-trend ml20" :class="state.statsData.afterSalesChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.afterSalesChange >= 0 ? '+' : '' }}{{ state.statsData.afterSalesChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.afterSalesChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-purple">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#9c27b0"><ele-TrendCharts /></el-icon>
            </div>
            <div>
              <div class="stat-label">今日销售额</div>
              <div class="stat-subtitle">Today's sales</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todaySales }}</div>
            <div class="stat-trend ml20" :class="state.statsData.salesChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.salesChange >= 0 ? '+' : '' }}{{ state.statsData.salesChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.salesChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-gray">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#606266"><ele-User /></el-icon>
            </div>
            <div>
              <div class="stat-label">总用户</div>
              <div class="stat-subtitle">Total Users</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.totalUsers }}</div>
            <div class="stat-trend ml20" :class="state.statsData.totalUsersChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.totalUsersChange >= 0 ? '+' : '' }}{{ state.statsData.totalUsersChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.totalUsersChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-red">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#f56c6c"><ele-Wallet /></el-icon>
            </div>
            <div>
              <div class="stat-label">总收入</div>
              <div class="stat-subtitle">Total Revenue</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.totalRevenue }}</div>
            <div class="stat-trend ml20" :class="state.statsData.revenueChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.revenueChange >= 0 ? '+' : '' }}{{ state.statsData.revenueChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.revenueChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-two">
      <el-col :xs="24" :sm="24" :md="14" :lg="16" :xl="16">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">快捷菜单</div>
          <div class="home-card-item-content" style="display: flex; flex-direction: row;">
            <div
              v-for="(item, index) in state.quickMenuData"
              :key="index"
              @click="router.push(item.path)"
              class="quick-menu-item flex-col row-center col-center cursor-pointer"
            >
              <div class="quick-menu-icon">
                <el-icon style="font-size: 3rem"><component :is="item.icon" /></el-icon>
              </div>
              <div class="quick-menu-text">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="8">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">系统公告</div>
          <div class="home-card-item-content">
            <div class="notice-list">
              <div
                v-for="(item, index) in state.sysNoticeData"
                :key="index"
                class="notice-item flex row-between col-center cursor-pointer"
              >
                <div class="flex-1 f-16">{{ index + 1 }}. {{ item.title }}</div>
                <div class="f-14" style="color: #999">{{ item.createTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-three">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">月收入</div>
          <div class="home-card-item-content" style="padding: 20px">
            <div ref="incomeChartRef" style="width: 100%; height: 400px"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-four">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">支付方式</div>
          <div class="home-card-item-content" style="padding: 20px">
            <div ref="paymentChartRef" style="width: 100%; height: 400px"></div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">待售后</div>
          <div class="home-card-item-content">
            <el-table :data="state.afterSalesData" style="width: 100%">
              <el-table-column prop="orderNo" label="订单id" width="120" />
              <el-table-column prop="phone" label="购买方式" />
              <el-table-column prop="area" label="购买方式" />
              <el-table-column prop="price" label="购买价格" />
              <el-table-column prop="freight" label="快递信息" />
              <el-table-column prop="paymentTime" label="购买时间" />
              <el-table-column prop="isRefund" label="是否退款" />
              <el-table-column label="操作">
                <template #default>
                  <el-button type="primary" link>详情查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="homeinfo">
  import { reactive, onMounted, ref, nextTick } from 'vue';
  import { formatAxis } from '/@/utils/formatTime';
  import { useUserInfo } from '/@/stores/userInfo';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { noticeApi } from '/@/api/system/notice';
  import { homeApi } from '/@/api/system/home';
  import * as echarts from 'echarts';
  import type { EChartsOption } from 'echarts';

  const stores = useUserInfo();
  const { userInfos } = storeToRefs(stores);
  const route = useRoute();
  const router = useRouter();
  const baseApi = homeApi();
  const baseApiNotice = noticeApi();

  const incomeChartRef = ref<HTMLDivElement>();
  const paymentChartRef = ref<HTMLDivElement>();

  interface StatsData {
    todayOrders: number;
    ordersChange: number;
    todayUsers: number;
    usersChange: number;
    todayAfterSales: number;
    afterSalesChange: number;
    todaySales: number;
    salesChange: number;
    totalRevenue: number;
    revenueChange: number;
    totalUsers: number;
    totalUsersChange: number;
  }

  interface QuickMenu {
    name: string;
    icon: string;
    path: string;
    color: string;
  }

  interface NoticeEntity {
    id?: string;
    title: string;
    content?: string;
    createTime?: string;
  }

  interface AfterSalesData {
    orderNo: string;
    phone: string;
    area: string;
    price: string;
    freight: string;
    paymentTime: string;
    isRefund: string;
  }

  const state = reactive({
    // 统计数据
    statsData: {
      todayOrders: 12138,
      ordersChange: 25,
      todayUsers: 12138,
      usersChange: 46,
      todayAfterSales: 112138,
      afterSalesChange: 0,
      todaySales: 121388,
      salesChange: 4023,
      totalRevenue: 1213888,
      revenueChange: 1,
      totalUsers: 256388,
      totalUsersChange: 12,
    } as StatsData,
    // 快捷菜单
    quickMenuData: [
      { name: '角色列表', icon: 'ele-Menu', path: '/system/role', color: '#409eff' },
      { name: '生成代码', icon: 'ele-Picture', path: '/system/generate', color: '#2dac34' },
      { name: '系统设置', icon: 'ele-Setting', path: '/system/config', color: '#ff8c00' },
      { name: '系统部门', icon: 'ele-OfficeBuilding', path: '/system/dept', color: '#9c27b0' },
      { name: '系统公告', icon: 'ele-ChatDotSquare', path: '/system/notice', color: '#00bcd4' },
    ] as QuickMenu[],
    // 系统公告
    sysNoticeData: [] as NoticeEntity[],
    // 待售后数据
    afterSalesData: [
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
    ] as AfterSalesData[],
  });

  // 页面加载时
  onMounted(() => {
    getNoticeList();
    nextTick(() => {
      initIncomeChart();
      initPaymentChart();
    });
  });

  /**
   * 初始化月收入曲线图
   */
  const initIncomeChart = () => {
    if (!incomeChartRef.value) return;

    const chart = echarts.init(incomeChartRef.value);
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['订单总数', '订单数量'],
        right: '5%',
        top: '0',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06', '01/07', '01/08', '01/09', '01/10', '01/11', '01/12', '01/13', '01/14', '01/15'],
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '100(万元)',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#409eff',
            },
          },
          axisLabel: {
            color: '#666',
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5',
            },
          },
        },
        {
          type: 'value',
          name: '(笔)100',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#2dac34',
            },
          },
          axisLabel: {
            color: '#666',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '订单总数',
          type: 'line',
          smooth: true,
          yAxisIndex: 0,
          data: [40, 50, 60, 50, 69, 50, 40, 50, 30, 50, 60, 50, 60, 70, 60],
          lineStyle: {
            color: '#409eff',
            width: 2,
          },
          itemStyle: {
            color: '#409eff',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
            ]),
          },
        },
        {
          name: '订单数量',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: [60, 40, 30, 40, 20, 40, 50, 60, 70, 60, 50, 60, 40, 30, 40],
          lineStyle: {
            color: '#2dac34',
            width: 2,
          },
          itemStyle: {
            color: '#2dac34',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(45, 172, 52, 0.3)' },
              { offset: 1, color: 'rgba(45, 172, 52, 0.05)' },
            ]),
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式
    window.addEventListener('resize', () => {
      chart.resize();
    });
  };

  /**
   * 初始化支付方式饼图
   */
  const initPaymentChart = () => {
    if (!paymentChartRef.value) return;

    const chart = echarts.init(paymentChartRef.value);
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: '5%',
        left: 'center',
      },
      series: [
        {
          name: '支付方式',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{d}%',
            fontSize: 14,
            fontWeight: 'bold',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 82, name: '支付宝', itemStyle: { color: '#409eff' } },
            { value: 18, name: '微信', itemStyle: { color: '#2dac34' } },
          ],
        },
      ],
    };

    chart.setOption(option);

    // 响应式
    window.addEventListener('resize', () => {
      chart.resize();
    });
  };
  /**
   * 系统公告
   */
  const getNoticeList = () => {
    baseApiNotice
      .list({
        pageNum: 1,
        pageSize: 10,
      })
      .then((res) => {
        state.sysNoticeData = res.rows;
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {});
  };
</script>

<style scoped lang="scss">
  .home-container {
    overflow: hidden;
    // 统计卡片
    .home-card-stats {
      .stat-card {
        padding: 20px;
        background: var(--el-color-white);
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        min-height: 120px;
        margin-bottom: 15px;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
        }

        .stat-card-header{
          display: flex;
          align-items: flex-end;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .stat-label {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            margin-bottom: 2px;
          }

          .stat-subtitle {
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
          }

        .stat-content {
          .stat-value {
            font-size: 26px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }

          .stat-trend {
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;

            &.trend-up {
              color: #FF2D55;
            }

            &.trend-down {
              color: #2dac34;
            }
          }
        }

        &.stat-card-orange .stat-icon {
          background: rgba(255, 140, 0, 0.1);
        }

        &.stat-card-green .stat-icon {
          background: rgba(45, 172, 52, 0.1);
        }

        &.stat-card-blue .stat-icon {
          background: rgba(64, 158, 255, 0.1);
        }

        &.stat-card-purple .stat-icon {
          background: rgba(156, 39, 176, 0.1);
        }

        &.stat-card-red .stat-icon {
          background: rgba(245, 108, 108, 0.1);
        }

        &.stat-card-gray .stat-icon {
          background: rgba(96, 98, 102, 0.1);
        }
      }
    }

    // 卡片通用样式
    .home-card-item {
      background: var(--el-color-white);
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
      }

      .home-card-item-title {
        padding: 15px 20px;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid #f0f0f0;
      }

      .home-card-item-content {
        padding: 20px;
      }
    }

    // 快捷菜单
    .home-card-two {
      .home-card-item {
        height: 245px; 
        display: flex;
        flex-direction: column;

        .home-card-item-title {
          flex-shrink: 0;
        }

        .home-card-item-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          &.flex {
            flex: 1;
          }
        }

        .quick-menu-item {
          width: 20%;
          padding: 20px 10px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-5px);

            .quick-menu-icon {
              transform: scale(1.1);
            }
          }

          .quick-menu-icon {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            background: #48A1FA;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            transition: all 0.3s;
            color: #fff;
          }

          
          .quick-menu-text {
            font-size: 14px;
            color: #333;
          }
        }
        .quick-menu-item:nth-child(2n) {
          .quick-menu-icon {
            background: #45DDB6;
          }
        }
        .notice-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .notice-item {
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f5f7fa;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 4px;
          }
        }
      }
    }

    // 曲线图
    .home-card-three {
      .home-card-item {
        min-height: 450px;
      }
    }

    // 饼图和表格
    .home-card-four {
      .home-card-item {
        min-height: 500px;

        :deep(.el-table) {
          .el-table__header th {
            background: #f5f7fa;
            font-weight: 600;
          }
        }
      }
    }
  }
</style>
