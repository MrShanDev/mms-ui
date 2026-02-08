<template>
  <div class="home-container layout-pd">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="15" class="home-card-stats">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="(item, index) in state.homeInfoData" :key="index">
        <div class="stat-card" :style="{ borderLeft: `4px solid ${item.color1}` }">
          <div class="stat-card-header">
            <div class="stat-icon" :style="{ background: item.color2 }">
              <el-icon style="font-size: 2rem" :style="{ color: item.color1 }">
                <component :is="item.num4" />
              </el-icon>
            </div>
            <div>
              <div class="stat-label">{{ item.num3 }}</div>
              <div class="stat-subtitle">Total {{ item.num3 }}</div>
            </div>
          </div>

          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ item.num1 }}</div>
            <div class="stat-trend ml20" v-if="item.num2 > 0">
              <span class="trend-up">+{{ item.num2 }}</span>
              <el-icon class="trend-up"><ele-Top /></el-icon>
              <span class="ml5 f-12 color-999">今日新增</span>
            </div>
            <div class="stat-trend ml20" v-else>
              <span class="color-999 f-12">今日暂无新增</span>
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
              class="quick-menu-item cursor-pointer"
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
<!--    <el-row :gutter="15" class="home-card-three">-->
<!--      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">-->
<!--        <div class="home-card-item mb15">-->
<!--          <div class="home-card-item-title">月收入</div>-->
<!--          <div class="home-card-item-content" style="padding: 20px">-->
<!--            <div ref="incomeChartRef" style="width: 100%; height: 400px"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-row :gutter="15" class="home-card-four">
<!--      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">-->
<!--        <div class="home-card-item mb15">-->
<!--          <div class="home-card-item-title">支付方式</div>-->
<!--          <div class="home-card-item-content" style="padding: 20px">-->
<!--            <div ref="paymentChartRef" style="width: 100%; height: 400px"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">最新会员</div>
          <div class="home-card-item-content">
            <el-table :data="state.latestMembers" style="width: 100%" height="400px">
                <el-table-column prop="nickname" label="昵称" show-overflow-tooltip>
                    <template #default="scope">
                        {{ scope.row.nickname==null||scope.row.nickname==''?'未设置':scope.row.nickname }}
                    </template>
                </el-table-column>
                <el-table-column prop="headPortrait" label="头像" header-align="center" align="center" show-overflow-tooltip>
                    <template #default="scope">
                        <el-image
                            style="height: 50px"
                            :src="scope.row.headPortrait"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :preview-src-list="[scope.row.headPortrait]"
                            :initial-index="1"
                            preview-teleported
                            fit="cover"
                        />
                    </template>
                </el-table-column>
                <fast-table-column prop="sex" label="性别" dict-type="SYS_SEX"></fast-table-column>
              <el-table-column prop="phone" label="手机号" width="220" />
            <el-table-column prop="account" label="邮箱" show-overflow-tooltip >
                <template #default="scope">
                    {{ scope.row.account==null||scope.row.account==''?'未设置':scope.row.account }}
                </template>
            </el-table-column>
              <el-table-column prop="createdTime" label="注册时间" width="180" />

              <el-table-column prop="tags" label="签名" show-overflow-tooltip />
              <el-table-column prop="city" label="城市" show-overflow-tooltip />
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button type="primary" link @click="router.push('/member/storeMember')">详情</el-button>
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
  import { noticeApi } from '/@/views/system/notice';
  import { homeApi } from '/@/views/system/home';
  import { storeMemberApi } from '/@/views/member/storeMember';
  import * as echarts from 'echarts';
  import type { EChartsOption } from 'echarts';
  import FastTableColumn from "/@/components/fast-table-column/src/fast-table-column.vue";

  const stores = useUserInfo();
  const { userInfos } = storeToRefs(stores);
  const route = useRoute();
  const router = useRouter();
  const baseApi = homeApi();
  const baseApiNotice = noticeApi();
  const memberApi = storeMemberApi();

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
    homeInfoData: [] as any[],
    // 快捷菜单
    quickMenuData: [
      { name: '会员管理', icon: 'ele-User', path: '/sxpcwlkj/storeMember', color: '#FF6462' },
      { name: '话题管理', icon: 'ele-ChatDotSquare', path: '/sxpcwlkj/bbsTopic', color: '#6690F9' },
      { name: '文章管理', icon: 'ele-Document', path: '/sxpcwlkj/storeArticle', color: '#88D565' },
      { name: '系统用户', icon: 'ele-UserFilled', path: '/system/user', color: '#409eff' },
      { name: '系统公告', icon: 'ele-Bell', path: '/system/notice', color: '#ff8c00' },
    ] as QuickMenu[],
    // 系统公告
    sysNoticeData: [] as NoticeEntity[],
    // 最新会员
    latestMembers: [] as any[],
  });

  // 页面加载时
  onMounted(() => {
    getHomeInfo();
    getNoticeList();
    getLatestMembers();
    nextTick(() => {
      initIncomeChart();
      initPaymentChart();
    });
  });

  /**
   * 获取首页统计数据
   */
  const getHomeInfo = () => {
    baseApi.info().then((res) => {
      state.homeInfoData = res.data;
    });
  };

  /**
   * 初始化月收入曲线图
   */
  const initIncomeChart = () => {
    if (!incomeChartRef.value) return;

    const chart = echarts.init(incomeChartRef.value);

    baseApi.orderNum().then((res: any) => {
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      const list1 = res.data.list1 || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const list2 = res.data.list2 || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      const option: EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          data: ['订单金额', '订单数量'],
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
          data: months,
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
            name: '金额(元)',
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
            name: '数量(笔)',
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
            name: '订单金额',
            type: 'line',
            smooth: true,
            yAxisIndex: 0,
            data: list1,
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
            data: list2,
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
    });

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
   * 获取最新会员列表
   */
  const getLatestMembers = () => {
    memberApi.list({
      pageNum: 1,
      pageSize: 10,
    }).then(res => {
      state.latestMembers = res.rows;
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
      }
    }

    .color-999 { color: #999; }
    .f-12 { font-size: 12px; }
    .ml5 { margin-left: 5px; }

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
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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
