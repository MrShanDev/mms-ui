import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import { highlightPluginLogText } from '/@/utils/pluginLogHighlight';

export const PLUGIN_LOG_THEME_STORAGE_KEY = 'mms.pluginLog.theme';

export type PluginLogTheme = 'dark' | 'eye-care';

export function readStoredPluginLogTheme(): PluginLogTheme {
  try {
    const v = localStorage.getItem(PLUGIN_LOG_THEME_STORAGE_KEY);
    if (v === 'eye-care' || v === 'dark') return v;
  } catch {
    /* */
  }
  return 'dark';
}

export interface UsePluginLogViewerOptions {
  /** 日志原文（尾部或实时拼接） */
  text: Ref<string>;
  /** 面板是否处于展示中：弹窗打开为 true；整页常驻为 ref(true) */
  panelActive: Ref<boolean>;
}

/**
 * 插件日志预览：护眼/深色主题持久化、跟随滚底、5s 兜底滚底、手动上滚后 30s 恢复跟随、全屏状态 ref。
 * 下载逻辑因数据源不同（宿主 tail / 插件 syslog）由调用方自行实现。
 */
export function usePluginLogViewer(options: UsePluginLogViewerOptions) {
  const { text, panelActive } = options;

  const logScrollRef = ref<HTMLElement | null>(null);
  const logTheme = ref<PluginLogTheme>(readStoredPluginLogTheme());
  const logFullscreen = ref(false);
  const logFollowBottom = ref(true);
  const logLastScrollAwayAt = ref(0);
  const logDownloadLoading = ref(false);

  const logHighlightedHtml = computed(() => highlightPluginLogText(text.value));

  watch(logTheme, (v) => {
    try {
      localStorage.setItem(PLUGIN_LOG_THEME_STORAGE_KEY, v);
    } catch {
      /* */
    }
  });

  let logAutoScrollTimer: ReturnType<typeof setInterval> | null = null;
  let logResumeFollowTimer: ReturnType<typeof setInterval> | null = null;

  function stopLogUiTimers() {
    if (logAutoScrollTimer != null) {
      clearInterval(logAutoScrollTimer);
      logAutoScrollTimer = null;
    }
    if (logResumeFollowTimer != null) {
      clearInterval(logResumeFollowTimer);
      logResumeFollowTimer = null;
    }
  }

  function startLogUiTimers() {
    stopLogUiTimers();
    logAutoScrollTimer = setInterval(() => {
      if (!panelActive.value || !logFollowBottom.value) return;
      void scrollLogToBottom();
    }, 5000);
    logResumeFollowTimer = setInterval(() => {
      if (!panelActive.value || logFollowBottom.value) return;
      const t = logLastScrollAwayAt.value;
      if (t > 0 && Date.now() - t >= 30000) {
        logFollowBottom.value = true;
        void scrollLogToBottom();
      }
    }, 1000);
  }

  async function scrollLogToBottom() {
    await nextTick();
    const el = logScrollRef.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  function onPluginLogScroll() {
    const el = logScrollRef.value;
    if (!el) return;
    const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = gap < 80;
    if (!nearBottom) {
      logFollowBottom.value = false;
      logLastScrollAwayAt.value = Date.now();
    }
  }

  function onLogFollowSwitch(val: string | number | boolean) {
    if (val === true) {
      void scrollLogToBottom();
    }
  }

  /** 关闭弹窗或离开页时调用 */
  function resetPluginLogPanel() {
    stopLogUiTimers();
    logFullscreen.value = false;
    logFollowBottom.value = true;
    logLastScrollAwayAt.value = 0;
  }

  watch(panelActive, (v) => {
    if (v) {
      startLogUiTimers();
    } else {
      stopLogUiTimers();
    }
  });

  watch(
    () => text.value,
    async () => {
      if (!panelActive.value || !logFollowBottom.value) return;
      await scrollLogToBottom();
    }
  );

  onBeforeUnmount(() => {
    stopLogUiTimers();
  });

  return {
    logScrollRef,
    logTheme,
    logFullscreen,
    logFollowBottom,
    logLastScrollAwayAt,
    logDownloadLoading,
    logHighlightedHtml,
    scrollLogToBottom,
    onPluginLogScroll,
    onLogFollowSwitch,
    resetPluginLogPanel,
  };
}
