<template>
  <div class="home-container layout-pd">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="15" class="home-card-stats">
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="(item, index) in state.homeInfoData" :key="index">
        <div class="stat-card" :style="{ borderLeft: `4px solid ${item.color1}` }">
          <div class="stat-card-header">
            <div class="stat-icon" :style="statIconBgStyle(item.color2)">
              <SvgIcon :name="homeStatIconName(item.num4)" :size="32" :color="item.color1" />
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
                <SvgIcon :name="item.icon" :size="48" :color="item.color" />
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
                :key="item.id ?? index"
                class="notice-item flex row-between col-center cursor-pointer"
                @click="openNoticeDetail(item)"
              >
                <div class="flex-1 f-16">{{ index + 1 }}. {{ item.title }}</div>
                <div class="f-14" style="color: #999">{{ noticeRowTime(item) }}</div>
              </div>
            </div>
          </div>
        </div>        
      </el-col>
    </el-row>

    <el-dialog
      v-model="noticeDetailVisible"
      :title="noticeDetail.title ? String(noticeDetail.title) : '公告详情'"
      width="680px"
      align-center
      destroy-on-close
      append-to-body
      class="home-notice-detail-dialog"
      @closed="onNoticeDetailClosed"
    >
      <div v-loading="noticeDetailLoading" class="home-notice-detail-wrap">
        <div v-if="noticeDetailTime" class="home-notice-detail-meta">{{ noticeDetailTime }}</div>
        <div class="home-notice-detail-html" v-html="noticeDetailHtml"></div>
      </div>
    </el-dialog>

    <el-row :gutter="15" class="home-card-four">
      <!-- 应用信息 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">应用信息</div>
          <div class="home-card-item-content">
            <div v-loading="state.runtimeInfoLoading">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="系统名称">{{ safeText(state.runtimeInfo?.app?.name) }}</el-descriptions-item>
                <el-descriptions-item label="版本">{{ safeText(state.runtimeInfo?.app?.version) }}</el-descriptions-item>
                <el-descriptions-item label="机构组织">{{ safeText(state.runtimeInfo?.app?.organization) }}</el-descriptions-item>
                <el-descriptions-item label="服务器时间">{{ safeText(state.runtimeInfo?.app?.serverTimeMs ? formatServerTime(state.runtimeInfo.app.serverTimeMs) : '') }}</el-descriptions-item>
                <el-descriptions-item label="启动时间">{{ safeText(state.runtimeInfo?.app?.startTimeMs ? formatServerTime(state.runtimeInfo.app.startTimeMs) : '') }}</el-descriptions-item>
                <el-descriptions-item label="运行时长">{{ safeText(state.runtimeInfo?.app?.uptimeMs ? formatDuration(state.runtimeInfo.app.uptimeMs) : '') }}</el-descriptions-item>
                <el-descriptions-item label="OS">{{ safeText(state.runtimeInfo?.os?.name) }} {{ safeText(state.runtimeInfo?.os?.version, '') }}</el-descriptions-item>
                <el-descriptions-item label="架构">{{ safeText(state.runtimeInfo?.os?.arch) }}</el-descriptions-item>
                <el-descriptions-item label="主机名">{{ safeText(state.runtimeInfo?.os?.hostname) }}</el-descriptions-item>
                <el-descriptions-item label="PID">{{ safeText(state.runtimeInfo?.app?.pid) }}</el-descriptions-item>
                <el-descriptions-item label="JDK">{{ safeText(state.runtimeInfo?.app?.jdkVersion) }}</el-descriptions-item>
                <el-descriptions-item label="JVM">{{ safeText(state.runtimeInfo?.app?.jvmName) }}</el-descriptions-item>
                <el-descriptions-item label="JavaHome" :span="2">{{ safeText(state.runtimeInfo?.app?.javaHome) }}</el-descriptions-item>
                <el-descriptions-item label="数据库" :span="2">
                  <template v-if="state.runtimeInfo?.db?.available">
                    {{ safeText(state.runtimeInfo?.db?.productName) }} {{ safeText(state.runtimeInfo?.db?.productVersion, '') }}
                    <span class="ml5 color-999 f-12">{{ safeText(state.runtimeInfo?.db?.url, '') }}</span>
                  </template>
                  <template v-else>
                    <span class="color-999">未获取</span>
                  </template>
                </el-descriptions-item>
                <el-descriptions-item label="文档地址" :span="2">
                  <el-link v-if="state.runtimeInfo?.app?.docUrl" :href="String(state.runtimeInfo.app.docUrl)" target="_blank" type="primary">
                    {{ String(state.runtimeInfo.app.docUrl) }}
                  </el-link>
                  <span v-else>-</span>
                </el-descriptions-item>
              </el-descriptions>

              <el-divider class="app-info-divider" />
              <div class="app-info-note">
                <div class="app-info-note-title">系统说明</div>
                <div class="app-info-note-text">
                  {{ safeText(state.runtimeInfo?.app?.describe, '暂无说明') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 运行状态（实时图表） -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="home-card-item mb15">
          <div class="home-card-item-title home-card-item-title--with-action">
            <div>运行状态</div>
          </div>
          <div class="home-card-item-content">
            <div v-loading="state.runtimeInfoLoading" class="runtime-wrap">
              <div class="runtime-top">
                <div class="runtime-metric">
                  <div class="runtime-metric-title">
                    <SvgIcon name="ele-Cpu" :size="16" color="#409eff" />
                    <span>CPU（趋势）</span>
                  </div>
                  <div ref="cpuTrendRef" class="runtime-spark"></div>
                  <div class="runtime-metric-value">
                    {{ percentText(state.runtimeInfo?.cpu?.systemLoad) }}
                    <span class="runtime-metric-sub"> · {{ safeText(state.runtimeInfo?.cpu?.cores) }}核</span>
                  </div>
                </div>
                <div class="runtime-metric">
                  <div class="runtime-metric-title">
                    <SvgIcon name="ele-Coin" :size="16" color="#67c23a" />
                    <span>物理内存（趋势）</span>
                  </div>
                  <div ref="memTrendRef" class="runtime-spark"></div>
                  <div class="runtime-metric-value">
                    {{ percentText(state.runtimeInfo?.memory?.usedPercent) }}
                    <span class="runtime-metric-sub"> · {{ bytesText(state.runtimeInfo?.memory?.used) }} / {{ bytesText(state.runtimeInfo?.memory?.total) }}</span>
                  </div>
                </div>
                <div class="runtime-metric">
                  <div class="runtime-metric-title">
                    <SvgIcon name="ele-Platform" :size="16" color="#e6a23c" />
                    <span>JVM内存（趋势）</span>
                  </div>
                  <div ref="jvmTrendRef" class="runtime-spark"></div>
                  <div class="runtime-metric-value">
                    {{ percentText(state.runtimeInfo?.jvmMemory?.usedPercent) }}
                    <span class="runtime-metric-sub"> · {{ bytesText(state.runtimeInfo?.jvmMemory?.used) }} / {{ bytesText(state.runtimeInfo?.jvmMemory?.total) }}</span>
                  </div>
                </div>
              </div>

              <el-descriptions class="mt15" :column="2" border>
                <el-descriptions-item label="CPU核心数">{{ safeText(state.runtimeInfo?.cpu?.cores) }}</el-descriptions-item>
                <el-descriptions-item label="负载(1/5/15)">
                  {{ loadAvgText(state.runtimeInfo?.cpu?.loadAverage) }}
                </el-descriptions-item>
                <el-descriptions-item label="服务器">
                  {{ safeText(state.runtimeInfo?.os?.hostname) }} · {{ safeText(state.runtimeInfo?.os?.arch) }}
                </el-descriptions-item>
                <el-descriptions-item label="运行时长">
                  {{ safeText(state.runtimeInfo?.app?.uptimeMs ? formatDuration(state.runtimeInfo.app.uptimeMs) : '') }}
                </el-descriptions-item>
              </el-descriptions>

              <div class="runtime-section">
                <div class="runtime-section-title">磁盘占用</div>
                <div ref="diskListChartRef" class="runtime-disk-chart"></div>
              </div>

              <div class="runtime-section">
                <div class="runtime-section-title">数据库</div>
                <div class="db-grid">
                  <div class="db-metric">
                    <div class="db-metric-label">连接池</div>
                    <div class="db-metric-value">{{ safeText(state.runtimeInfo?.dbPool?.type) }}</div>
                  </div>
                  <div class="db-metric">
                    <div class="db-metric-label">活跃</div>
                    <div class="db-metric-value">{{ safeText(state.runtimeInfo?.dbPool?.active) }}</div>
                  </div>
                  <div class="db-metric">
                    <div class="db-metric-label">空闲</div>
                    <div class="db-metric-value">{{ safeText(state.runtimeInfo?.dbPool?.idle) }}</div>
                  </div>
                  <div class="db-metric">
                    <div class="db-metric-label">等待</div>
                    <div class="db-metric-value">{{ safeText(state.runtimeInfo?.dbPool?.pending) }}</div>
                  </div>
                </div>

                <div class="runtime-section-subtitle">
                  慢 SQL（阈值：{{ safeText(state.runtimeInfo?.slowSqlRecent?.length ? slowSqlThresholdText : '') }}）
                </div>
                <el-table :data="Array.isArray(state.runtimeInfo?.slowSqlRecent) ? state.runtimeInfo.slowSqlRecent : []" style="width: 100%" height="220">
                  <el-table-column prop="elapsedMs" label="耗时(ms)" width="110" />
                  <el-table-column prop="datasource" label="数据源" width="120" show-overflow-tooltip />
                  <el-table-column prop="timeMs" label="时间" width="180">
                    <template #default="scope">{{ scope.row.timeMs ? formatServerTime(scope.row.timeMs) : '-' }}</template>
                  </el-table-column>
                  <el-table-column prop="sql" label="SQL" show-overflow-tooltip />
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="homeinfo">
  import { reactive, onMounted, onBeforeUnmount, ref, nextTick, computed } from 'vue';
  import { useUserInfo } from '/@/stores/userInfo';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { noticeApi } from '/@/views/system/notice';
  import type { NoticeEntity } from '/@/views/system/notice/type';
  import { homeApi } from '/@/views/system/home';
  import * as echarts from 'echarts';
  import type { EChartsOption } from 'echarts';
  import { getEnv } from '/@/utils/mms';
  import { Session } from '/@/utils/storage';
  import { SysEnum } from '/@/enums/SysEnum';

  const stores = useUserInfo();
  const { userInfos } = storeToRefs(stores);
  const route = useRoute();
  const router = useRouter();
  const baseApi = homeApi();
  const baseApiNotice = noticeApi();

  const incomeChartRef = ref<HTMLDivElement>();
  const paymentChartRef = ref<HTMLDivElement>();
  const cpuTrendRef = ref<HTMLDivElement>();
  const memTrendRef = ref<HTMLDivElement>();
  const jvmTrendRef = ref<HTMLDivElement>();
  const diskListChartRef = ref<HTMLDivElement>();

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
    // 系统运行信息（/system/home/runtimeInfo）
    runtimeInfo: {} as any,
    // 系统运行趋势（/system/home/runtimeTrend）
    runtimeTrend: [] as any[],
    runtimeInfoLoading: false,
  });

  const safeText = (v: unknown, fallback = '-') => {
    if (v === undefined || v === null) return fallback;
    const s = String(v).trim();
    return s ? s : fallback;
  };

  const bytesText = (v: unknown) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return '-';
    const kb = 1024;
    const mb = kb * 1024;
    const gb = mb * 1024;
    const tb = gb * 1024;
    if (n >= tb) return `${(n / tb).toFixed(2)} TB`;
    if (n >= gb) return `${(n / gb).toFixed(2)} GB`;
    if (n >= mb) return `${(n / mb).toFixed(2)} MB`;
    if (n >= kb) return `${(n / kb).toFixed(2)} KB`;
    return `${n.toFixed(0)} B`;
  };

  const percentText = (v: unknown) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return '-';
    return `${(n * 100).toFixed(1)}%`;
  };

  const loadAvgText = (arr: unknown) => {
    const a = Array.isArray(arr) ? arr : [];
    const fmt = (x: any) => {
      const n = Number(x);
      return Number.isFinite(n) ? n.toFixed(2) : '-';
    };
    return `${fmt(a[0])} / ${fmt(a[1])} / ${fmt(a[2])}`;
  };

  const formatServerTime = (ms: unknown) => {
    const n = Number(ms);
    if (!Number.isFinite(n)) return '';
    const d = new Date(n);
    const pad = (x: number) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const formatDuration = (ms: unknown) => {
    const n = Number(ms);
    if (!Number.isFinite(n) || n < 0) return '';
    const s = Math.floor(n / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d) parts.push(`${d}天`);
    if (h || d) parts.push(`${h}小时`);
    if (m || h || d) parts.push(`${m}分`);
    parts.push(`${sec}秒`);
    return parts.join('');
  };

  const primaryDisk = computed(() => {
    const disks = state.runtimeInfo?.disks;
    if (!Array.isArray(disks) || disks.length === 0) return null;
    // 优先找根挂载
    const root = disks.find((d: any) => String(d?.mount || '') === '/' || String(d?.mount || '').toLowerCase().includes('c:'));
    return root || disks[0];
  });

  const primaryDiskUsedPercent = computed(() => primaryDisk.value?.usedPercent);

  let cpuTrendChart: echarts.ECharts | null = null;
  let memTrendChart: echarts.ECharts | null = null;
  let jvmTrendChart: echarts.ECharts | null = null;
  let diskListChart: echarts.ECharts | null = null;
  let sse: EventSource | null = null;

  const slowSqlThresholdText = '≥500ms';

  const diskColor = (p: unknown) => {
    const n = Number(p);
    if (!Number.isFinite(n)) return '#409eff';
    if (n >= 0.9) return '#f56c6c';
    if (n >= 0.75) return '#e6a23c';
    return '#67c23a';
  };

  /** 首页统计卡片图标：后端传 SvgIcon 约定名（ele- / iconify: / iconfont 等），勿传裸字符串当组件名 */
  const homeStatIconName = (num4: unknown): string => {
    const s = num4 == null ? '' : String(num4).trim();
    return s || 'ele-DataAnalysis';
  };

  const statIconBgStyle = (color2: unknown) => {
    const v = color2 == null ? '' : String(color2).trim();
    if (!v) return {};
    if (v.startsWith('--')) return { background: `var(${v})` };
    return { background: v };
  };

  const noticeDetailVisible = ref(false);
  const noticeDetailLoading = ref(false);
  const noticeDetail = ref<Partial<NoticeEntity>>({});

  const noticeDetailTime = computed(() => {
    const d = noticeDetail.value;
    const t = d.createTime ?? (d as { createdTime?: string }).createdTime;
    return t ? String(t) : '';
  });

  const noticeDetailHtml = computed(() => {
    const c = noticeDetail.value.content;
    if (c == null || String(c).trim() === '') {
      return '<p class="home-notice-empty">暂无正文</p>';
    }
    return String(c);
  });

  const noticeRowTime = (item: NoticeEntity) => {
    const t = item.createTime ?? (item as NoticeEntity & { createdTime?: string }).createdTime;
    return t ? String(t) : '';
  };

  const openNoticeDetail = (row: NoticeEntity) => {
    if (row.id === undefined || row.id === null || String(row.id) === '') {
      ElMessage.warning('无法打开公告详情');
      return;
    }
    noticeDetailVisible.value = true;
    noticeDetailLoading.value = true;
    noticeDetail.value = { id: row.id, title: row.title };
    baseApiNotice
      .query(row.id)
      .then((res: any) => {
        noticeDetail.value = { ...(res.data || {}) };
      })
      .catch((err) => {
        ElMessage.warning(err);
        noticeDetailVisible.value = false;
      })
      .finally(() => {
        noticeDetailLoading.value = false;
      });
  };

  const onNoticeDetailClosed = () => {
    noticeDetail.value = {};
  };

  const systemNoteText = computed(() => {
    const base = state.runtimeInfo?.app?.describe ? String(state.runtimeInfo.app.describe) : '';
    const lines: string[] = [];
    if (base.trim()) {
      lines.push(`【系统描述】${base.trim()}`);
      lines.push('');
    }
    lines.push('【系统结构速览】');
    lines.push('- mms-plus：围绕 MMS（模块化管理系统）的扩展工作区，承载插件体系、管理端前端、文档站、多端工程等。');
    lines.push('- mms/：主后端（Git 子模块），Spring Boot 3.x + Maven 多模块（mms-admin 启动模块 + mms-modules 业务模块集）。');
    lines.push('- mms-system：系统管理域模块（用户/角色/菜单/字典/配置/公告等），本页的系统运行信息接口也放在该模块对外提供。');
    lines.push('- mms-ui：管理端前端（Vue3 / Vite / TS / Element Plus），并支持插件前端子包通过 Module Federation 随插件 JAR 一起交付。');
    lines.push('- mms-plugins：动态 JAR 插件聚合；插件安装后可由宿主在运行期加载/卸载，扩展业务能力与页面。');
    lines.push('- mms-unix：uni-app-x 移动端工程（UTS/uvue），内置登录、会员中心等基础能力，可对接同一后端。');
    lines.push('- mms-unxt：Nuxt 3 PC 端/站点脚手架与多模板示例（mms-ui-nuxt）。');
    lines.push('');
    lines.push('【本页运行状态】');
    lines.push('- 采用 SSE 长连接实时推送运行指标（CPU/内存/磁盘/连接池/慢 SQL 等），前端以趋势图表与占用图表展示。');
    return lines.join('\n');
  });

  // 页面加载时
  onMounted(() => {
    getHomeInfo();
    getNoticeList();
    startRuntimeSse();
    nextTick(() => {
      initIncomeChart();
      initPaymentChart();
      initRuntimeCharts();
    });
  });

  onBeforeUnmount(() => {
    stopRuntimeSse();
    cpuTrendChart?.dispose();
    memTrendChart?.dispose();
    jvmTrendChart?.dispose();
    diskListChart?.dispose();
    cpuTrendChart = null;
    memTrendChart = null;
    jvmTrendChart = null;
    diskListChart = null;
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
  const initRuntimeCharts = () => {
    if (cpuTrendRef.value && !cpuTrendChart) cpuTrendChart = echarts.init(cpuTrendRef.value);
    if (memTrendRef.value && !memTrendChart) memTrendChart = echarts.init(memTrendRef.value);
    if (jvmTrendRef.value && !jvmTrendChart) jvmTrendChart = echarts.init(jvmTrendRef.value);
    if (diskListChartRef.value && !diskListChart) diskListChart = echarts.init(diskListChartRef.value);
    updateTrendCharts();
    window.addEventListener('resize', () => {
      cpuTrendChart?.resize();
      memTrendChart?.resize();
      jvmTrendChart?.resize();
      diskListChart?.resize();
    });
  };

  const sparkOption = (color: string, data: Array<[number, number]>) => {
    return {
      grid: { left: 0, right: 0, top: 6, bottom: 0, containLabel: false },
      xAxis: { type: 'time', show: false },
      yAxis: { type: 'value', min: 0, max: 100, show: false },
      tooltip: { trigger: 'axis', axisPointer: { type: 'line' }, formatter: (params: any) => `${params?.[0]?.value?.[1]?.toFixed?.(1) ?? '-'}%` },
      series: [
        {
          type: 'line',
          smooth: true,
          showSymbol: false,
          data,
          lineStyle: { color, width: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: `${color}55` }, { offset: 1, color: `${color}05` }]) },
        },
      ],
    } as any;
  };

  const updateTrendCharts = () => {
    const points = Array.isArray(state.runtimeTrend) ? state.runtimeTrend : [];
    const cpu = points.map((p: any) => [Number(p.timeMs), Number(p.cpu) * 100]).filter((x: any) => Number.isFinite(x[0]) && Number.isFinite(x[1]));
    const mem = points.map((p: any) => [Number(p.timeMs), Number(p.mem) * 100]).filter((x: any) => Number.isFinite(x[0]) && Number.isFinite(x[1]));
    const jvm = points.map((p: any) => [Number(p.timeMs), Number(p.jvm) * 100]).filter((x: any) => Number.isFinite(x[0]) && Number.isFinite(x[1]));
    cpuTrendChart?.setOption(sparkOption('#409eff', cpu));
    memTrendChart?.setOption(sparkOption('#67c23a', mem));
    jvmTrendChart?.setOption(sparkOption('#e6a23c', jvm));

    // 磁盘占用图表（Top N）
    const disks = Array.isArray(state.runtimeInfo?.disks) ? state.runtimeInfo.disks : [];
    const rows = disks
      .map((d: any) => ({
        mount: String(d?.mount || d?.name || '-'),
        usedPercent: Number(d?.usedPercent),
        used: d?.used,
        total: d?.total,
        free: d?.free,
      }))
      .filter((r: any) => r.mount && Number.isFinite(r.usedPercent))
      .sort((a: any, b: any) => b.usedPercent - a.usedPercent)
      .slice(0, 8);

    if (diskListChart) {
      diskListChart.setOption({
        // 左侧留白更宽，避免挂载点/路径过长被截断
        grid: { left: 240, right: 20, top: 10, bottom: 20 },
        xAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLabel: { formatter: '{value}%' },
          splitLine: { lineStyle: { color: '#f0f0f0' } },
        },
        yAxis: {
          type: 'category',
          data: rows.map((r: any) => r.mount),
          axisLabel: { color: '#666', width: 220, overflow: 'truncate' },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const p = params?.[0];
            const idx = p?.dataIndex ?? 0;
            const r = rows[idx];
            if (!r) return '';
            const pct = (r.usedPercent * 100).toFixed(1);
            return [
              `挂载点：${r.mount}`,
              `占用率：${pct}%`,
              `已用：${bytesText(r.used)}`,
              `总量：${bytesText(r.total)}`,
              `剩余：${bytesText(r.free)}`,
            ].join('<br/>');
          },
        },
        series: [
          {
            type: 'bar',
            data: rows.map((r: any) => ({
              value: Math.round(r.usedPercent * 1000) / 10,
              itemStyle: { color: diskColor(r.usedPercent) },
            })),
            barWidth: 14,
            label: { show: true, position: 'right', formatter: '{c}%' },
          },
        ],
      } as any);
    }
  };

  const buildRuntimeSseUrl = () => {
    const baseApiPrefix = getEnv('VITE_APP_BASE_API').replace(/\/$/, '');
    const token = Session.get(SysEnum.TOKEN_KEY);
    if (!token) return '';
    return `${baseApiPrefix}/system/home/runtimeSse?Authorization=${encodeURIComponent(String(token))}`;
  };

  const stopRuntimeSse = () => {
    try {
      sse?.close();
    } catch (e) {
      // ignore
    } finally {
      sse = null;
    }
  };

  const startRuntimeSse = () => {
    stopRuntimeSse();
    const url = buildRuntimeSseUrl();
    if (!url) {
      ElMessage.warning('未获取到登录信息，无法建立实时连接');
      return;
    }
    if (!(window as any).EventSource) {
      ElMessage.warning('当前浏览器不支持 SSE（EventSource）');
      return;
    }

    state.runtimeInfoLoading = true;
    sse = new EventSource(url);

    sse.addEventListener('runtime', (evt: any) => {
      try {
        const data = JSON.parse(evt.data || '{}');
        if (data.info) {
          state.runtimeInfo = data.info;
        }
        if (data.point && typeof data.point === 'object') {
          // 维护前端趋势窗口（最多 120 点）
          state.runtimeTrend.push(data.point);
          if (state.runtimeTrend.length > 120) {
            state.runtimeTrend.splice(0, state.runtimeTrend.length - 120);
          }
        }
        updateTrendCharts();
      } catch (e) {
        // ignore parse error
      } finally {
        state.runtimeInfoLoading = false;
      }
    });

    sse.onerror = () => {
      // EventSource 会自动重连，这里不弹窗，避免刷屏
      state.runtimeInfoLoading = false;
    };
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

        &.home-card-item-title--with-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .home-card-item-title-action {
          flex-shrink: 0;
        }
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
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            transition: all 0.3s;
          }

          .quick-menu-text {
            font-size: 14px;
            color: #333;
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

        // 左侧「应用信息」说明块：用于补齐高度
        .app-info-divider {
          margin: 14px 0;
        }
        .app-info-note {
          margin-top: 0;
          padding: 12px 14px;
          background: #f5f7fa;
          border-radius: 8px;
          border: 1px solid #ebeef5;

          .app-info-note-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
          }

          .app-info-note-text {
            font-size: 13px;
            color: #666;
            line-height: 1.7;
            white-space: pre-wrap;
            word-break: break-word;
          }
        }

        .runtime-wrap {
          .runtime-top {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .runtime-metric {
            padding: 12px;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
          }

          .runtime-metric-title {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            color: #333;
            margin-bottom: 6px;
          }

          .runtime-spark {
            width: 100%;
            height: 64px;
          }

          .runtime-metric-value {
            text-align: center;
            font-size: 13px;
            color: #666;
            margin-top: 6px;

            .runtime-metric-sub {
              color: #999;
              font-size: 12px;
            }
          }

          .runtime-section {
            margin-top: 14px;
          }

          .runtime-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin: 6px 0 10px;
          }

          .runtime-section-subtitle {
            font-size: 13px;
            color: #666;
            margin: 10px 0 8px;
          }

          .runtime-disk-chart {
            width: 100%;
            height: 240px;
          }

          .runtime-kv {
            margin-top: 10px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px 12px;
            color: #666;
            font-size: 13px;
          }

          .db-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 10px;
          }

          .db-metric {
            padding: 10px 12px;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            background: #fff;

            .db-metric-label {
              font-size: 12px;
              color: #999;
              margin-bottom: 4px;
            }

            .db-metric-value {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
          }
        }
      }

      // 让左右两张卡片等高
      :deep(.el-col) {
        display: flex;
      }
      .home-card-item {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .home-card-item-content {
        flex: 1;
      }

      // 让「应用信息」内部内容按列布局，系统说明填满剩余空间
      .home-card-item-content > div {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .app-info-note {
        flex: 1;
      }
    }
  }
</style>

<!-- append-to-body 的弹层不在当前组件 DOM 内，需非 scoped 才能命中 -->
<style lang="scss">
  .home-notice-detail-dialog.el-dialog {
    max-width: 92vw;
    margin: 0 auto;
  }

  .home-notice-detail-dialog .el-dialog__body {
    padding-top: 8px;
  }

  .home-notice-detail-wrap {
    max-height: min(70vh, 560px);
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .home-notice-detail-meta {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    margin-bottom: 12px;
  }

  .home-notice-detail-html {
    line-height: 1.65;
    word-break: break-word;

    .home-notice-empty {
      margin: 0;
      color: var(--el-text-color-secondary);
    }

    img {
      max-width: 100%;
      height: auto;
    }

    p {
      margin: 0 0 8px;
    }
  }
</style>
