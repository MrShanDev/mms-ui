<template>
  <!-- 与插件市场「独立日志」预览能力对齐：主题、下载、全屏、跟随滚底、定时滚底/恢复 -->
  <div class="mms-syslog-fed layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <template #header>
        <span>运行时日志（插件）</span>
        <el-button type="primary" size="small" class="mms-syslog-fed__refresh" :loading="loading" @click="refreshFiles">
          刷新文件列表
        </el-button>
      </template>
      <div class="mms-syslog-fed__controls-row">
        <el-form :inline="true" class="mms-syslog-fed__form">
          <el-form-item label="日志文件">
            <el-select v-model="selectedFile" placeholder="选择 logs 目录下 .log" filterable style="width: 280px">
              <el-option v-for="f in files" :key="f" :label="f" :value="f" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!selectedFile" @click="loadTail">读取尾部</el-button>
          </el-form-item>
        </el-form>
        <div v-show="!logFullscreen" class="plugin-log-toolbar mms-syslog-fed__toolbar-inline">
          <el-radio-group v-model="logTheme" size="small" class="plugin-log-theme-switch">
            <el-radio-button label="eye-care">护眼</el-radio-button>
            <el-radio-button label="dark">深色</el-radio-button>
          </el-radio-group>
          <el-button
            size="small"
            type="primary"
            plain
            :disabled="!tailText"
            :loading="logDownloadLoading"
            @click="downloadSyslogText"
          >
            下载日志
          </el-button>
          <el-button size="small" @click="logFullscreen = !logFullscreen">
            {{ logFullscreen ? '退出全屏' : '全屏预览' }}
          </el-button>
          <span class="plugin-log-toolbar__gap" />
          <span class="plugin-log-toolbar__label text-gray">跟随底部</span>
          <el-switch v-model="logFollowBottom" size="small" @change="onLogFollowSwitch" />
          <span v-if="!logFollowBottom" class="plugin-log-toolbar__hint text-warning">已暂停 · 30s 无操作后恢复</span>
          <span class="plugin-log-toolbar__gap plugin-log-toolbar__gap--sm" />
          <span class="plugin-log-toolbar__label text-gray">实时缓冲</span>
          <el-switch v-model="liveOn" size="small" @change="toggleLive" />
          <template v-if="liveOn">
            <span class="plugin-log-toolbar__label text-gray">间隔</span>
            <el-input-number
              v-model="livePollIntervalMs"
              :min="1500"
              :max="60000"
              :step="500"
              size="small"
              controls-position="right"
              class="plugin-log-toolbar__interval"
              @change="rescheduleLivePoll"
            />
            <span class="text-gray plugin-log-toolbar__hint">ms</span>
          </template>
        </div>
      </div>

      <div class="mms-syslog-log-panel plugin-log-panel" :class="{ 'plugin-log-panel--fullscreen': logFullscreen }">
        <el-button v-if="logFullscreen" type="primary" class="plugin-log-exit-fullscreen" @click="logFullscreen = false">
          退出全屏
        </el-button>
        <div class="plugin-log-body">
          <!-- 与插件市场独立日志一致：目录说明与正文同一滚动容器；全屏下仅 pre 区固定高度滚动 -->
          <div
            ref="logScrollRef"
            class="plugin-log-scroll"
            :class="`plugin-log-theme--${logTheme}`"
            @scroll.passive="onPluginLogScroll"
          >
            <p v-if="logsDir" class="plugin-log-meta plugin-log-meta--path text-gray">
              <span>目录：</span><code class="plugin-log-path">{{ logsDir }}</code>
            </p>
            <pre class="plugin-log-pre"><code class="plugin-log-code language-log" v-html="logHighlightedHtml" /></pre>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { saveAs } from 'file-saver';
import { usePluginLogViewer, Session, SysEnum } from '@mms-ui/plugin-common-kit';
import { ElButton, ElCard, ElForm, ElFormItem, ElInputNumber, ElMessage, ElOption, ElRadioButton, ElRadioGroup, ElSelect, ElSwitch } from 'element-plus';
import { onUnmounted, ref, watch } from 'vue';

const PLUGIN_ID = 'mms.plugin.syslog';
const RAW_BASE_API = ((import.meta as any).env?.VITE_APP_BASE_API ?? '').toString().trim();
const API_BASE = RAW_BASE_API
  ? RAW_BASE_API.replace(/\/$/, '')
  : (typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) ? '/prod-api' : '');
const API = `${API_BASE}/plugin/${PLUGIN_ID}/syslog`;

const http = axios.create({
  baseURL: ((import.meta as any).env?.VITE_APP_BASE ?? '').toString(),
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = Session.get(SysEnum.TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = String(token);
  }
  return config;
});

async function apiGet(url: string, params?: Record<string, any>) {
  const { data } = await http.get(url, { params });
  if (data?.code != null && data.code !== 200) {
    throw new Error(data?.msg || `HTTP ${data?.code}`);
  }
  return data?.data ?? data;
}

const panelActive = ref(true);
const loading = ref(false);
const files = ref<string[]>([]);
const logsDir = ref('');
const selectedFile = ref<string>('');
const tailText = ref('');
const liveOn = ref(false);
const livePollIntervalMs = ref(2000);
const sinceSeq = ref(0);
let pollTimer: ReturnType<typeof setInterval> | null = null;

const {
  logScrollRef,
  logTheme,
  logFullscreen,
  logFollowBottom,
  logDownloadLoading,
  logHighlightedHtml,
  onPluginLogScroll,
  onLogFollowSwitch,
} = usePluginLogViewer({ panelActive, text: tailText });

async function refreshFiles() {
  loading.value = true;
  try {
    const data: any = await apiGet(`${API}/files`);
    logsDir.value = data?.logsDir ?? '';
    files.value = Array.isArray(data?.files) ? data.files : [];
    if (files.value.length && !selectedFile.value) {
      selectedFile.value = files.value[0] ?? '';
    }
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false;
  }
}

async function loadTail() {
  if (!selectedFile.value) return;
  try {
    const data: any = await apiGet(`${API}/tail`, { file: selectedFile.value, maxBytes: 131072 });
    tailText.value = data?.text ?? '';
  } catch {
    /* */
  }
}

function stopLivePoll() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function pollLive() {
  try {
    const data: any = await apiGet(`${API}/live/poll`, { sinceSeq: sinceSeq.value });
    const lines: string[] = data?.lines ?? [];
    const next = data?.nextSeq ?? sinceSeq.value;
    sinceSeq.value = typeof next === 'number' ? next : sinceSeq.value;
    if (lines.length) {
      const chunk = lines.join('\n') + '\n';
      tailText.value = (tailText.value ? tailText.value + '\n' : '') + chunk;
    }
  } catch {
    /* */
  }
}

function rescheduleLivePoll() {
  if (!liveOn.value) return;
  stopLivePoll();
  const ms = Math.min(Math.max(livePollIntervalMs.value, 1500), 60000);
  pollTimer = setInterval(pollLive, ms);
}

function toggleLive(on: boolean | string | number) {
  const enabled = on === true;
  stopLivePoll();
  if (enabled) {
    sinceSeq.value = 0;
    tailText.value = '';
    void pollLive();
    rescheduleLivePoll();
    ElMessage.info('已开启实时日志轮询；无 plugin:syslog:live 权限时无法拉取缓冲日志');
  }
}

watch(livePollIntervalMs, () => {
  if (liveOn.value) rescheduleLivePoll();
});

function downloadSyslogText() {
  if (!tailText.value) {
    ElMessage.warning('暂无内容可下载');
    return;
  }
  const raw = selectedFile.value || 'syslog';
  const safe = String(raw).replace(/[^a-zA-Z0-9._-]+/g, '_');
  const name = safe.endsWith('.log') ? safe : `${safe}.log`;
  const blob = new Blob([tailText.value], { type: 'text/plain;charset=utf-8' });
  logDownloadLoading.value = true;
  try {
    saveAs(blob, name);
    ElMessage.success('已开始下载');
  } finally {
    logDownloadLoading.value = false;
  }
}

onUnmounted(() => {
  stopLivePoll();
});

refreshFiles();
</script>

<style scoped lang="scss">
@use '/@/styles/plugin-log-viewer.scss' as *;

.mms-syslog-fed {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.mms-syslog-fed :deep(.el-card) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mms-syslog-fed :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.mms-syslog-fed__refresh {
  float: right;
}
.mms-syslog-fed__controls-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  width: 100%;
  margin-bottom: 8px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--el-bg-color);
  padding-bottom: 8px;
  box-shadow: 0 1px 0 var(--el-border-color-lighter);
}
.mms-syslog-fed__form {
  flex: 0 1 auto;
  margin-bottom: 0;
}
.mms-syslog-fed__form :deep(.el-form-item) {
  margin-bottom: 0;
}
.mms-syslog-fed__toolbar-inline {
  flex: 1 1 auto;
  min-width: 0;
  margin-bottom: 0;
}
.text-gray {
  color: var(--el-text-color-secondary);
}
.text-warning {
  color: var(--el-color-warning);
}
.mms-syslog-log-panel {
  width: 100%;
  flex: 1;
  min-height: 0;
}
.mms-syslog-log-panel .plugin-log-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
  overscroll-behavior: none;
}
.mms-syslog-log-panel.plugin-log-panel--fullscreen .plugin-log-body {
  flex: 1 1 0%;
  min-height: 0;
}
/* 路径高亮见 /@/styles/plugin-log-viewer.scss */
/* 非全屏：日志区固定可视高度（与插件市场弹窗非全屏策略一致） */
.mms-syslog-log-panel:not(.plugin-log-panel--fullscreen) .plugin-log-scroll {
  flex: none;
  height: calc(100vh - 300px);
  min-height: 200px;
  max-height: calc(100vh - 300px);
  overflow: auto;
}
/* 页面内全屏：与插件市场全屏独立日志一致 */
.mms-syslog-log-panel.plugin-log-panel--fullscreen {
  --plugin-log-fullscreen-pre-chrome: 140px;
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: var(--el-bg-color);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
.mms-syslog-log-panel.plugin-log-panel--fullscreen .plugin-log-scroll {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  min-height: 0 !important;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden !important;
}
.mms-syslog-log-panel.plugin-log-panel--fullscreen .plugin-log-scroll .plugin-log-meta {
  flex-shrink: 0;
}
.mms-syslog-log-panel.plugin-log-panel--fullscreen .plugin-log-pre {
  flex: none;
  height: calc(100vh - var(--plugin-log-fullscreen-pre-chrome, 140px));
  min-height: 160px;
  max-height: calc(100vh - var(--plugin-log-fullscreen-pre-chrome, 140px));
  overflow-x: auto;
  overflow-y: auto !important;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}
</style>
