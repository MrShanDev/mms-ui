<template>
  <div class="home-container base-dashboard layout-pd">
    <header class="system-welcome">
      <img class="workspace-orbit" :src="orbitArtwork" alt="" aria-hidden="true" />
      <div>
        <span class="system-eyebrow">LIVE WORKSPACE</span>
        <h1>系统运行，一目了然</h1>
        <p>管理资源、服务状态与团队通知</p>
      </div>
      <div class="system-live-status" :class="{ 'is-live': runtimeConnected }" role="status">
        <span></span>
        {{
          !canMonitor
            ? '当前账户未获监控权限'
            : runtimeConnected
              ? '实时监控已连接'
              : '实时监控连接中'
        }}
      </div>
    </header>
    <div class="metric-grid">
      <DashboardMetric
        v-for="item in state.homeInfoData"
        :key="item.num3"
        :label="item.num3"
        :value="item.num1"
        :detail="item.num2 > 0 ? `今日新增 ${item.num2}` : '今日暂无新增'"
        :icon="homeStatIconName(item.num4)"
      />
    </div>

    <div class="system-workspace-grid">
      <section class="home-card-four system-monitor-column" aria-label="服务运行监控">
        <RuntimeMonitor
          :info="state.runtimeInfo"
          :connected="runtimeConnected"
          :loading="state.runtimeInfoLoading"
          :slow-sql-threshold-text="slowSqlThresholdText"
          :format="runtimeFormat"
          :set-chart-ref="setChartRef"
        />
      </section>
      <aside class="system-notice-column">
        <SystemNotices
          :items="homeUnreadNoticeList"
          :notice-row-time="noticeRowTime"
          @open="openNoticeDetail"
          @show-all="noticeListVisible = true"
        />
        <QuickEntries :items="availableQuickEntries" @navigate="router.push" />
      </aside>
    </div>
    <section class="workspace-runtime-overview" aria-label="运行详情">
      <h2>
        <SvgIcon name="ele-Document" :size="19" />
        运行详情
        <small>服务器及运行环境信息</small>
      </h2>
      <div class="runtime-overview-grid">
        <div>
          <SvgIcon name="ele-Coin" :size="23" />
          <span>
            服务器名称
            <strong>{{ safeText(state.runtimeInfo?.os?.hostname) }}</strong>
          </span>
        </div>
        <div>
          <SvgIcon name="ele-Monitor" :size="23" />
          <span>
            操作系统
            <strong>
              {{ safeText(state.runtimeInfo?.os?.name) }} ·
              {{ safeText(state.runtimeInfo?.os?.arch) }}
            </strong>
          </span>
        </div>
        <div>
          <SvgIcon name="ele-Box" :size="23" />
          <span>
            项目版本
            <strong>{{ safeText(state.runtimeInfo?.app?.version) }}</strong>
          </span>
        </div>
        <div>
          <SvgIcon name="ele-Timer" :size="23" />
          <span>
            启动时间
            <strong>
              {{
                state.runtimeInfo?.app?.startTimeMs
                  ? formatServerTime(state.runtimeInfo.app.startTimeMs)
                  : '-'
              }}
            </strong>
          </span>
        </div>
      </div>
    </section>
    <details class="system-capabilities home-card-four">
      <summary>
        应用能力与技术说明
        <span>展开查看系统说明</span>
      </summary>
      <ApplicationInfo
        :loading="state.runtimeInfoLoading"
        :app-describe-view="appDescribeView"
        :app-capability-cards="appCapabilityCards"
      />
    </details>

    <el-dialog
      v-model="noticeListVisible"
      title="已发布公告"
      width="min(680px, 92vw)"
      append-to-body
    >
      <el-empty v-if="!state.sysNoticeData.length" description="暂无公告" />
      <div v-for="notice in state.sysNoticeData" :key="String(notice.id)">
        <el-button text @click="openNoticeDetail(notice)">{{ notice.title }}</el-button>
        <span>{{ noticeRowTime(notice) }}</span>
      </div>
    </el-dialog>
    <el-dialog
      v-model="noticeDetailVisible"
      :title="noticeDetail.title ? String(noticeDetail.title) : '公告详情'"
      width="min(680px, 92vw)"
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
  </div>
</template>

<script setup lang="ts" name="BaseDashboard">
  import '../base-dashboard.scss';
  import '../system-workspace.scss';
  import '../workspace-light.scss';
  import orbitArtwork from '/@/assets/workspace-orbit-v2.png';
  import QuickEntries from '../widgets/QuickEntries.vue';
  import SystemNotices from '../widgets/SystemNotices.vue';
  import RuntimeMonitor from '../widgets/RuntimeMonitor.vue';
  import ApplicationInfo from '../widgets/ApplicationInfo.vue';
  import DashboardMetric from '../components/DashboardMetric.vue';
  import { reactive, onMounted, onBeforeUnmount, ref, nextTick, computed } from 'vue';
  import { useUserInfo } from '/@/stores/userInfo';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import DOMPurify from 'dompurify';
  import { auth } from '/@/utils/authFunction';
  import type { NoticeEntity } from '/@/views/system/notice/type';
  import { homeApi } from '/@/views/system/home';
  import * as echarts from 'echarts';
  import type { EChartsOption } from 'echarts';
  import { getEnv } from '/@/utils/mms';

  const stores = useUserInfo();
  const { userInfos } = storeToRefs(stores);
  const route = useRoute();
  const router = useRouter();
  const baseApi = homeApi();

  const runtimeConnected = ref(false);
  const cpuTrendRef = ref<HTMLDivElement>();
  const memTrendRef = ref<HTMLDivElement>();
  const jvmTrendRef = ref<HTMLDivElement>();

  interface QuickMenu {
    name: string;
    icon: string;
    path: string;
    color: string;
  }

  const state = reactive({
    // 统计数据
    homeInfoData: [] as any[],
    // 快捷菜单
    quickMenuData: [
      { name: '角色权限', icon: 'ele-Key', path: '/system/role', color: '#7955d9' },
      { name: '租户管理', icon: 'ele-OfficeBuilding', path: '/system/tenant', color: '#138b78' },
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

  const availableQuickEntries = computed(() =>
    state.quickMenuData.filter((item) =>
      router.getRoutes().some((route) => route.path === item.path && !route.meta?.isHide)
    )
  );

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
    const emojiRe =
      /^((?:\p{Extended_Pictographic}\uFE0F?)(?:\u200D(?:\p{Extended_Pictographic}\uFE0F?))*)\s+/u;
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
      const lines = s
        .split(/\n|(?=\b\d+\.\s)/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (lines.length > 1 && /^\d+\./.test(lines[0]))
        return { mode: 'split' as const, intro: '', lines };
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
  let sseGeneration = 0;
  let sseRetry: ReturnType<typeof setTimeout> | undefined;

  const slowSqlThresholdText = '≥500ms';

  /** 首页统计卡片图标：后端传 SvgIcon 约定名（ele- / iconify: / iconfont 等），勿传裸字符串当组件名 */
  const homeStatIconName = (num4: unknown): string => {
    const s = num4 == null ? '' : String(num4).trim();
    return s || 'ele-DataAnalysis';
  };

  const noticeListVisible = ref(false);
  const noticeDetailVisible = ref(false);
  const noticeDetailLoading = ref(false);
  const noticeDetail = ref<Partial<NoticeEntity>>({});

  const canMonitor = computed(() => auth('system:monitor:query'));
  const noticeReadIdList = ref<string[]>([]);
  const markNoticeRead = async (id: string | number) => {
    await baseApi.markNoticeRead(id);
    noticeReadIdList.value = [...new Set([...noticeReadIdList.value, String(id)])];
  };

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
    return DOMPurify.sanitize(String(c));
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
    baseApi
      .noticeDetail(row.id)
      .then((res: any) => {
        noticeDetail.value = { ...(res.data || {}) };
        return markNoticeRead(row.id);
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
    lines.push(
      '- mms-plus：围绕 MMS（模块化管理系统）的扩展工作区，承载插件体系、管理端前端、文档站、多端工程等。'
    );
    lines.push(
      '- mms/：主后端（Git 子模块），Spring Boot 3.x + Maven 多模块（mms-admin 启动模块 + mms-modules 业务模块集）。'
    );
    lines.push(
      '- mms-system：系统管理域模块（用户/角色/菜单/字典/配置/公告等），本页的系统运行信息接口也放在该模块对外提供。'
    );
    lines.push(
      '- mms-ui：管理端前端（Vue3 / Vite / TS / Element Plus），并支持插件前端子包通过 Module Federation 随插件 JAR 一起交付。'
    );
    lines.push(
      '- mms-plugins：动态 JAR 插件聚合；插件安装后可由宿主在运行期加载/卸载，扩展业务能力与页面。'
    );
    lines.push(
      '- mms-unix：uni-app-x 移动端工程（UTS/uvue），内置登录、会员中心等基础能力，可对接同一后端。'
    );
    lines.push('- mms-unxt：Nuxt 3 PC 端/站点脚手架与多模板示例（mms-ui-nuxt）。');
    lines.push('');
    lines.push('【本页运行状态】');
    lines.push(
      '- 采用 SSE 长连接实时推送运行指标（CPU/内存/连接池/慢 SQL 等），前端以 Sparkline 趋势图展示。'
    );
    return lines.join('\n');
  });

  const runtimeFormat = {
    safeText,
    percentText,
    bytesText,
    loadAvgText,
    formatDuration,
    formatServerTime,
  };
  const chartRefs: Record<string, typeof cpuTrendRef> = {
    cpu: cpuTrendRef,
    mem: memTrendRef,
    jvm: jvmTrendRef,
  };
  const setChartRef = (key: string, element: unknown) => {
    if (chartRefs[key]) chartRefs[key].value = element as HTMLDivElement | undefined;
  };
  // 页面加载时
  onMounted(() => {
    getHomeInfo();
    getNoticeList();
    if (canMonitor.value) startRuntimeSse();
    nextTick(() => {
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
      grid: { left: 32, right: 0, top: 6, bottom: 6, containLabel: false },
      xAxis: { type: 'time', show: false },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 50,
        axisLabel: { formatter: '{value}%', color: '#91a4c0', fontSize: 9 },
        splitLine: { lineStyle: { color: '#e8eff9', type: 'dashed' } },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params: any) => `${params?.[0]?.value?.[1]?.toFixed?.(1) ?? '-'}%`,
      },
      series: [
        {
          type: 'line',
          smooth: true,
          showSymbol: false,
          data,
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}55` },
              { offset: 1, color: `${color}05` },
            ]),
          },
        },
      ],
    } as any;
  };

  const updateTrendCharts = () => {
    const points = Array.isArray(state.runtimeTrend) ? state.runtimeTrend : [];
    const cpu = points
      .map((p: any): [number, number] => [Number(p.timeMs), Number(p.cpu) * 100])
      .filter((x: any) => Number.isFinite(x[0]) && Number.isFinite(x[1]));
    const mem = points
      .map((p: any): [number, number] => [Number(p.timeMs), Number(p.mem) * 100])
      .filter((x: any) => Number.isFinite(x[0]) && Number.isFinite(x[1]));
    const jvm = points
      .map((p: any): [number, number] => [Number(p.timeMs), Number(p.jvm) * 100])
      .filter((x: any) => Number.isFinite(x[0]) && Number.isFinite(x[1]));
    cpuTrendChart?.setOption(sparkOption('#409eff', cpu));
    memTrendChart?.setOption(sparkOption('#9254ff', mem));
    jvmTrendChart?.setOption(sparkOption('#00b8d9', jvm));
  };

  const stopRuntimeSse = () => {
    sseGeneration++;
    clearTimeout(sseRetry);
    runtimeConnected.value = false;
    try {
      sse?.close();
    } catch (e) {
      // ignore
    } finally {
      sse = null;
    }
  };

  const startRuntimeSse = async () => {
    stopRuntimeSse();
    const generation = sseGeneration;
    let ticket: string;
    try {
      ticket = (await baseApi.runtimeTicket()).data;
    } catch {
      state.runtimeInfoLoading = false;
      return;
    }
    if (generation !== sseGeneration) return;
    const baseApiPrefix = getEnv('VITE_APP_BASE_API').replace(/\/$/, '');
    const url = ticket
      ? `${baseApiPrefix}/system/home/runtimeSse?ticket=${encodeURIComponent(ticket)}`
      : '';
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

    sse.onopen = () => {
      runtimeConnected.value = true;
    };
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
      runtimeConnected.value = false;
      sse?.close();
      sseRetry = setTimeout(() => {
        if (generation === sseGeneration) void startRuntimeSse();
      }, 5000);
      state.runtimeInfoLoading = false;
    };
  };
  /**
   * 系统公告
   */
  const getNoticeList = () => {
    baseApi
      .notices()
      .then((res) => {
        state.sysNoticeData = res.data?.rows || [];
        noticeReadIdList.value = (res.data?.readIds || []).map(String);
      })
      .catch(() => {
        ElMessage.warning('公告加载失败，请稍后重试');
      });
  };
</script>

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
