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
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
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
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <div class="home-card-item mb15">
          <div class="home-card-item-title home-card-notice-head">
            <span>系统公告</span>
            <el-tag v-if="homeUnreadNoticeList.length" type="warning" size="small" effect="plain" class="home-card-notice-unread-tag">
              {{ homeUnreadNoticeList.length === 1 ? '未读' : `未读 ${homeUnreadNoticeList.length}` }}
            </el-tag>
          </div>
          <div class="home-card-item-content home-notice-sticky-wrap">
            <template v-if="homeUnreadNoticeList.length">
              <div class="home-notice-sticky-stack" role="list" aria-label="未读公告">
                <div
                  v-for="(stickyItem, snx) in homeUnreadNoticeList"
                  :key="String(stickyItem.id ?? snx)"
                  class="home-notice-sticky home-notice-sticky--stack"
                  :class="[`home-notice-sticky--t${snx % 3}`]"
                  role="button"
                  tabindex="0"
                  @click="openNoticeDetail(stickyItem)"
                  @keydown.enter.prevent="openNoticeDetail(stickyItem)"
                  @keydown.space.prevent="openNoticeDetail(stickyItem)"
                >
                  <div class="home-notice-sticky-pin" aria-hidden="true"></div>
                  <div class="home-notice-sticky-body">
                    <div class="home-notice-sticky-title">{{ stickyItem.title }}</div>
                    <div class="home-notice-sticky-time">{{ noticeRowTime(stickyItem) }}</div>
                    <div class="home-notice-sticky-hint">点击查阅</div>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="home-notice-sticky-empty">
              <p class="home-notice-empty-text">暂无未读公告</p>
              <p class="home-notice-empty-sub">新发公告会自动出现在此处</p>
              <el-link type="primary" :underline="false" @click="router.push('/system/notice')">查看全部公告</el-link>
            </div>
            <div class="home-notice-more">
              <el-link type="info" :underline="false" @click="router.push('/system/notice')">公告列表 »</el-link>
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
      <!-- 运行状态（实时图表） -->
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
        <div class="home-card-item mb15">
          <div class="home-card-item-title home-card-item-title--with-action">
            <div>运行状态</div>
          </div>
          <div class="home-card-item-content home-runtime-card-content">
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
      
        <div class="runtime-kv-pack">
          <div class="runtime-section-title">运行快照</div>
          <el-descriptions class="runtime-kv-desc" size="small" :column="3" border>
          <!-- 一行三列：宿主/负载 → 进程 → 环境 -->
          <el-descriptions-item label="CPU核心数">{{ safeText(state.runtimeInfo?.cpu?.cores) }}</el-descriptions-item>
          <el-descriptions-item label="负载(1/5/15)">
            {{ loadAvgText(state.runtimeInfo?.cpu?.loadAverage) }}
          </el-descriptions-item>
          <el-descriptions-item label="服务器">
            {{ safeText(state.runtimeInfo?.os?.hostname) }} · {{ safeText(state.runtimeInfo?.os?.arch) }}
          </el-descriptions-item>
          <el-descriptions-item label="PID">{{ safeText(state.runtimeInfo?.app?.pid) }}</el-descriptions-item>
          <el-descriptions-item label="端口">{{ safeText(state.runtimeInfo?.app?.serverPort) }}</el-descriptions-item>
          <el-descriptions-item label="运行时长">
            {{ safeText(state.runtimeInfo?.app?.uptimeMs ? formatDuration(state.runtimeInfo.app.uptimeMs) : '') }}
          </el-descriptions-item>
          <el-descriptions-item label="JDK">
            <div class="home-desc-monospace">{{ safeText(state.runtimeInfo?.app?.jdkVersion) }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据库">
            <template v-if="state.runtimeInfo?.db?.available">
              <div class="home-desc-db-meta">
                {{ safeText(state.runtimeInfo?.db?.productName) }} {{ safeText(state.runtimeInfo?.db?.productVersion, '') }}
              </div>
            </template>
            <template v-else>
              <span class="color-999">未获取</span>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="文档地址">
            <el-link
              v-if="state.runtimeInfo?.app?.docUrl"
              class="home-desc-doc-link"
              :href="String(state.runtimeInfo.app.docUrl)"
              target="_blank"
              type="primary"
            >
              {{ String(state.runtimeInfo.app.docUrl) }}
            </el-link>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>
        </div>
      
        <div class="runtime-section runtime-db-section">
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
          <el-table :data="Array.isArray(state.runtimeInfo?.slowSqlRecent) ? state.runtimeInfo.slowSqlRecent : []" style="width: 100%" height="148">
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

      <!-- 应用信息 -->
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">应用信息</div>
          <div class="home-card-item-content">
            <div v-loading="state.runtimeInfoLoading" class="home-app-runtime-desc-wrap">
              <div class="app-info-note">
                <div class="app-info-note-title">系统说明</div>
                <div
                  class="app-info-note-text"
                  :class="{ 'app-info-note-text--pre': appDescribeView.mode === 'plain' || appDescribeView.mode === 'empty' }"
                >
                  <template v-if="appDescribeView.mode === 'empty'">
                    <span class="color-999">暂无说明</span>
                  </template>
                  <template v-else-if="appDescribeView.mode === 'plain'">
                    {{ appDescribeView.text }}
                  </template>
                  <template v-else>
                    <p v-if="appDescribeView.intro" class="app-info-note-lead">{{ appDescribeView.intro }}</p>
                    <div class="app-info-note-capblock">
                      <div class="app-info-note-capblock-hd">以下为技术能力概要</div>
                      <ul class="app-info-note-cap-list">
                        <li v-for="(item, capIx) in appCapabilityCards" :key="capIx" class="app-info-cap-card">
                          <div class="app-info-cap-card-top" :class="{ 'app-info-cap-card-top--solo': !item.headline }">
                            <span class="app-info-cap-num">{{ item.idx }}</span>
                            <span v-if="item.icon" class="app-info-cap-emoji" aria-hidden="true">{{ item.icon }}</span>
                            <span v-if="item.headline" class="app-info-cap-head">{{ item.headline }}</span>
                          </div>
                          <p class="app-info-cap-detail">{{ item.detail }}</p>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="homeinfo">
  import { reactive, onMounted, onBeforeUnmount, ref, nextTick, computed, watch } from 'vue';
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
  import { Local, Session } from '/@/utils/storage';
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

  interface AppCapabilityCard {
    /** 展示序号（与原文编号尽量一致） */
    idx: number;
    icon: string;
    headline: string;
    detail: string;
  }

  /** 「N. Emoji **标题**：详情」或未约定格式的概要行 → 卡片字段 */
  const parseCapabilityLineToCard = (raw: string, indexOneBased: number): AppCapabilityCard => {
    let s = String(raw ?? '')
      .trim()
      .replace(/\r/g, '');
    let idx = indexOneBased;
    const prefixNum = s.match(/^(\d+)\.\s+/);
    if (prefixNum) {
      const n = Number.parseInt(prefixNum[1], 10);
      if (Number.isFinite(n) && n > 0) idx = n;
      s = s.slice(prefixNum[0].length).trim();
    }
    const emojiRe = /^((?:\p{Extended_Pictographic}\uFE0F?)(?:\u200D(?:\p{Extended_Pictographic}\uFE0F?))*)\s+/u;
    let icon = '';
    const emMatch = s.match(emojiRe);
    if (emMatch) {
      icon = emMatch[1];
      s = s.slice(emMatch[0].length).trim();
    }
    const stripMdBold = (t: string) => t.replace(/\*\*/g, '').trim();

    const mdTitle = s.match(/^\*\*(.+?)\*\*\s*[：:]\s*(.+)$/s);
    if (mdTitle) {
      return {
        idx,
        icon,
        headline: stripMdBold(mdTitle[1]),
        detail: mdTitle[2].trim(),
      };
    }
    const colon = s.match(/^(.{1,80}?)[：:]\s*(.+)$/s);
    if (colon) {
      const headPart = stripMdBold(colon[1]);
      const tailPart = colon[2].trim();
      if (headPart && tailPart.length > 0) {
        return { idx, icon, headline: headPart, detail: tailPart };
      }
    }
    return { idx, icon, headline: '', detail: stripMdBold(s) };
  };

  /**
   * 「应用信息 · 系统说明」：若正文含「以下为技术能力概要：」则拆成引言与编号列表条目，便于版式美化。
   */
  const appDescribeView = computed(() => {
    const raw = state.runtimeInfo?.app?.describe;
    if (raw === undefined || raw === null) {
      return { mode: 'empty' as const };
    }
    const s0 = String(raw);
    if (!s0.trim()) {
      return { mode: 'empty' as const };
    }
    const s = s0.replace(/\r\n/g, '\n');
    const idx = s.search(/以下为技术能力概要[：:]/);
    if (idx < 0) {
      return { mode: 'plain' as const, text: s.trim() };
    }
    const intro = s.slice(0, idx).trim();
    const afterMarker = s.slice(idx).replace(/^以下为技术能力概要[：:]\s*\n?/, '');
    const lines = afterMarker
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) {
      return { mode: 'plain' as const, text: s.trim() };
    }
    return { mode: 'split' as const, intro, lines };
  });

  /** 技术能力概要：解析为松散卡片网格（减轻长列表挤压感） */
  const appCapabilityCards = computed((): AppCapabilityCard[] => {
    const v = appDescribeView.value;
    if (v.mode !== 'split') return [];
    return v.lines.map((line, i) => parseCapabilityLineToCard(line, i + 1));
  });

  let cpuTrendChart: echarts.ECharts | null = null;
  let memTrendChart: echarts.ECharts | null = null;
  let jvmTrendChart: echarts.ECharts | null = null;
  let sse: EventSource | null = null;

  const slowSqlThresholdText = '≥500ms';

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

  /** 首页公告已读 ID（服务端无字段时按用户维度存本机，与「系统公告」列表独立） */
  const HOME_NOTICE_READ_STORAGE = 'homeSysNoticeReadIds';
  const noticeReadIdList = ref<string[]>([]);

  const homeNoticeUserScope = (): string => {
    const u = userInfos.value as Record<string, unknown>;
    const c = u?.userId ?? u?.id ?? u?.userName ?? u?.loginName;
    const s = c != null ? String(c).trim() : '';
    return s || '_guest';
  };

  function readNoticeStorageKey() {
    return `${HOME_NOTICE_READ_STORAGE}:${homeNoticeUserScope()}`;
  }

  function hydrateHomeNoticeReads() {
    try {
      const parsed = Local.get(readNoticeStorageKey());
      noticeReadIdList.value = Array.isArray(parsed) ? parsed.map((x: unknown) => String(x)) : [];
    } catch {
      noticeReadIdList.value = [];
    }
  }

  function persistHomeNoticeReads() {
    const dedup = [...new Set(noticeReadIdList.value.map(String).filter(Boolean))];
    noticeReadIdList.value = dedup;
    Local.set(readNoticeStorageKey(), dedup);
  }

  /** 公告详情加载成功后视为「已阅读」 */
  function markNoticeReadLocally(id: unknown) {
    const sid = id != null ? String(id).trim() : '';
    if (!sid || noticeReadIdList.value.includes(sid)) return;
    noticeReadIdList.value = [...noticeReadIdList.value, sid];
    persistHomeNoticeReads();
  }

  watch(
    userInfos,
    () => {
      hydrateHomeNoticeReads();
    },
    { deep: true, immediate: true },
  );

  /** 首页便签区：最多展示的未读条数（列表已为发布时间倒序，靠前即较新） */
  const HOME_NOTICE_STICKY_MAX = 8;

  /** 本机未标记已读的公告，自上而下多张便签 */
  const homeUnreadNoticeList = computed((): NoticeEntity[] => {
    const reads = new Set(noticeReadIdList.value.map(String));
    const rows = state.sysNoticeData;
    if (!Array.isArray(rows)) return [];
    const out: NoticeEntity[] = [];
    for (let i = 0; i < rows.length && out.length < HOME_NOTICE_STICKY_MAX; i++) {
      const row = rows[i];
      if (row?.id === undefined || row?.id === null) continue;
      const nid = String(row.id).trim();
      if (nid && !reads.has(nid)) out.push(row);
    }
    return out;
  });

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
        markNoticeReadLocally(row.id);
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
    lines.push('- 采用 SSE 长连接实时推送运行指标（CPU/内存/连接池/慢 SQL 等），前端以 Sparkline 趋势图展示。');
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
    cpuTrendChart = null;
    memTrendChart = null;
    jvmTrendChart = null;
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
    updateTrendCharts();
    window.addEventListener('resize', () => {
      cpuTrendChart?.resize();
      memTrendChart?.resize();
      jvmTrendChart?.resize();
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
        pageSize: 50,
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
        .home-card-notice-head {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px 10px;
        }

        .home-card-notice-unread-tag {
          margin: 0;
        }

        .home-notice-sticky-wrap {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .home-notice-sticky-stack {
          flex: 1;
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 11px;
          padding: 6px 2px 2px;
        }

        .home-notice-sticky {
          flex: 0 0 auto;
          position: relative;
          margin: 0;
          padding: 12px 12px 9px;
          cursor: pointer;
          border-radius: 2px;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
          background: linear-gradient(152deg, #fffbeb 0%, #fef3c7 48%, #fde68a 100%);
          border: 1px solid rgba(251, 191, 36, 0.45);
          box-shadow:
            0 10px 22px rgba(15, 23, 42, 0.08),
            0 3px 0 rgba(253, 230, 138, 0.35) inset,
            3px 4px 0 rgba(251, 191, 36, 0.1);

          &.home-notice-sticky--t0 {
            transform: rotate(-0.78deg);
          }

          &.home-notice-sticky--t1 {
            transform: rotate(0.58deg);
          }

          &.home-notice-sticky--t2 {
            transform: rotate(-0.38deg);
          }

          &:hover {
            transform: rotate(0deg) translateY(-2px);
            box-shadow:
              0 16px 28px rgba(15, 23, 42, 0.11),
              0 4px 0 rgba(253, 230, 138, 0.45) inset,
              4px 5px 0 rgba(251, 191, 36, 0.14);
            z-index: 2;
          }

          &:focus-visible {
            outline: 2px solid var(--el-color-primary);
            outline-offset: 2px;
            z-index: 2;
          }

          &.home-notice-sticky--stack {
            padding-top: 13px;

            .home-notice-sticky-pin {
              top: -9px;
              width: 22px;
              height: 22px;
              left: calc(50% - 11px);
            }

            .home-notice-sticky-pin::after {
              bottom: -6px;
              border-left-width: 5px;
              border-right-width: 5px;
              border-top-width: 8px;
            }

            .home-notice-sticky-title {
              font-size: 14px;
              -webkit-line-clamp: 2;
              margin-bottom: 5px;
            }

            .home-notice-sticky-time {
              margin-bottom: 4px;
            }
          }
        }

        .home-notice-sticky-pin {
          position: absolute;
          top: -12px;
          left: calc(50% - 13px);
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 32%, #f87171 0%, #b91c1c 72%, #7f1d1d 100%);
          box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.2),
            0 -1px 0 rgba(255, 255, 255, 0.35) inset;
          pointer-events: none;
          z-index: 1;

          &::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -8px;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 9px solid #9f1239;
            opacity: 0.92;
          }
        }

        .home-notice-sticky-body {
          position: relative;
          z-index: 0;
        }

        .home-notice-sticky-title {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.42;
          color: #78350f;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          margin-bottom: 8px;
        }

        .home-notice-sticky-time {
          font-size: 12px;
          color: #92400e;
          opacity: 0.92;
          margin-bottom: 6px;
        }

        .home-notice-sticky-hint {
          font-size: 12px;
          font-weight: 700;
          color: var(--el-color-primary);
          text-decoration: underline;
          text-decoration-style: dashed;
          text-underline-offset: 3px;
          line-height: 1.45;
        }

        .home-notice-sticky-empty {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 14px 8px;

          .home-notice-empty-text {
            margin: 0 0 6px;
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
          }

          .home-notice-empty-sub {
            margin: 0 0 10px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            line-height: 1.5;
          }
        }

        .home-notice-more {
          flex-shrink: 0;
          text-align: center;
          padding-top: 4px;

          .el-link {
            font-size: 12px;
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

    // 饼图和表格（双列与较高一侧等高；右侧数据库段 margin-top:auto 吸底）
    .home-card-four {
      align-items: stretch;

      :deep(.el-col) {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-width: 0;
      }

      :deep(.el-col > .home-card-item) {
        flex: 1;
        min-height: 0;
        width: 100%;
      }

      .home-card-item > .home-card-item-title {
        padding: 12px 16px;
      }

      .home-card-item:has(.home-app-runtime-desc-wrap) > .home-card-item-content {
        padding: 12px 16px 13px;
      }

      /* 卡片在 flex col 内需可收缩，避免 Descriptions 长文本撑裂栅格溢出到右侧卡片 */
      .home-card-item {
        min-width: 0;
        overflow: hidden;
        flex: 1;
        display: flex;
        flex-direction: column;

        .home-app-runtime-desc-wrap {
          min-width: 0;
          width: 100%;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .home-runtime-card-content {
          padding: 8px 14px 10px;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        /** 右侧「运行状态」汇总表：Descriptions 表格防撑裂 */
        .runtime-kv-desc {
          width: 100%;
          box-sizing: border-box;

          :deep(table.el-descriptions__table) {
            /* auto：按内容分配列宽，避免 fixed+错用 1% 把值列挤成「竖排单字」 */
            table-layout: auto;
            width: 100%;
          }

          :deep(.el-descriptions__body tr > td),
          :deep(.el-descriptions__body td) {
            word-break: break-word;
            /* 不用 anywhere，避免在窄列里被强制逐字符断行 */
            overflow-wrap: break-word;
            vertical-align: top;
          }

          /* 标签列收紧占位（1% + nowrap），宽度交给相邻值列 */
          :deep(td.el-descriptions__label) {
            width: 1%;
            white-space: nowrap;
            vertical-align: top;
          }

          :deep(table.el-descriptions__table td.el-descriptions__cell) {
            padding: 12px 12px;
          }
        }

        .home-desc-db-meta {
          line-height: 1.55;
        }

        .home-desc-monospace {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
          line-height: 1.55;
          word-break: break-word;
          overflow-wrap: anywhere;
          font-size: 13px;
        }
        .home-desc-doc-link :deep(.el-link__inner) {
          word-break: break-word;
          overflow-wrap: anywhere;
          white-space: normal;
          text-align: left;
          line-height: 1.5;
        }

        .app-info-note {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          margin-top: 0;
          padding: 11px 13px 13px;
          background: linear-gradient(155deg, #f9fbfe 0%, #f1f5fb 48%, #eef2f9 100%);
          border-radius: 8px;
          border: 1px solid var(--el-border-color-lighter);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);

          .app-info-note-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            letter-spacing: 0.02em;
            margin-bottom: 8px;

            &::before {
              content: '';
              width: 4px;
              min-height: 1.05em;
              align-self: stretch;
              border-radius: 4px;
              background: linear-gradient(180deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
              flex-shrink: 0;
            }
          }

          .app-info-note-text {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            font-size: 13px;
            line-height: 1.62;
            color: #445060;
            word-break: break-word;
            overflow-wrap: break-word;

            &.app-info-note-text--pre {
              white-space: pre-wrap;
            }

            .app-info-note-lead {
              margin: 0 0 10px;
              color: #3e4a58;
              text-align: justify;
              text-justify: inter-ideograph;
            }

            .app-info-note-capblock {
              margin-top: 4px;
            }

            .app-info-note-capblock-hd {
              font-size: 12px;
              font-weight: 600;
              color: var(--el-color-primary);
              margin-bottom: 10px;
              padding-bottom: 6px;
              border-bottom: 1px dashed var(--el-border-color);
            }

            .app-info-note-cap-list {
              margin: 0;
              padding: 0;
              list-style: none;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
              gap: 12px 14px;

              .app-info-cap-card {
                margin: 0;
                padding: 12px 14px 13px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.92);
                border: 1px solid rgba(228, 231, 237, 0.98);
                border-left: 3px solid var(--el-color-primary-light-3);
                box-shadow:
                  0 1px 0 rgba(255, 255, 255, 0.9) inset,
                  0 1px 2px rgba(15, 23, 42, 0.04);
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-height: 0;
              }

              .app-info-cap-card-top {
                display: flex;
                flex-wrap: wrap;
                align-items: flex-start;
                gap: 8px 10px;
                line-height: 1.35;

                &--solo {
                  margin-bottom: -2px;
                }
              }

              .app-info-cap-num {
                flex-shrink: 0;
                min-width: 1.5em;
                height: 22px;
                padding: 0 7px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 700;
                color: var(--el-color-primary);
                background: linear-gradient(145deg, rgba(64, 158, 255, 0.12) 0%, rgba(64, 158, 255, 0.05) 100%);
                border-radius: 6px;
                border: 1px solid rgba(64, 158, 255, 0.2);
              }

              .app-info-cap-emoji {
                flex-shrink: 0;
                font-size: 18px;
                line-height: 1;
                transform: translateY(1px);
              }

              .app-info-cap-head {
                flex: 1;
                min-width: 0;
                font-size: 13px;
                font-weight: 600;
                color: #334155;
                letter-spacing: 0.01em;
              }

              .app-info-cap-detail {
                margin: 0;
                font-size: 12.5px;
                line-height: 1.62;
                color: #5c6b7a;
                word-break: break-word;
                overflow-wrap: break-word;
              }

              .app-info-cap-card-top--solo + .app-info-cap-detail {
                color: #495663;
              }
            }
          }
        }

        .runtime-wrap {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;

          .runtime-top {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 0;
            flex-shrink: 0;
          }

          .runtime-kv-pack {
            flex-shrink: 0;
          }

          /** 趋势图 → 「运行快照」 */
          .runtime-top + .runtime-kv-pack {
            margin-top: 12px;
          }

          .runtime-kv-pack > .runtime-section-title {
            margin: 0 0 7px;
          }

          /** 「数据库」段吸底，与上方块之间随卡片增高自动拉开 */
          .runtime-kv-pack + .runtime-db-section {
            margin-top: auto;
            padding-top: 14px;
          }

          .runtime-db-section > .runtime-section-title {
            margin: 0 0 11px;
          }

          .runtime-metric {
            padding: 8px;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
          }

          .runtime-metric-title {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
          }

          .runtime-spark {
            width: 100%;
            height: 76px;
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
            margin-top: 0;

            &.runtime-db-section {
              margin-top: 0;
              flex-shrink: 0;
            }
          }

          .runtime-section-title {
            font-size: 13px;
            font-weight: 600;
            color: #333;
            margin: 0 0 2px;
          }

          .runtime-section-subtitle {
            font-size: 13px;
            color: #666;
            margin: 10px 0 6px;
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
            gap: 7px;
            margin-bottom: 6px;
          }

          .db-metric {
            padding: 7px 8px;
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

      .home-card-item-content {
        flex: 1;
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      // 让「应用信息」内部内容按列布局，系统说明填满剩余空间
      .home-card-item-content > div {
        flex: 1;
        min-height: 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
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
