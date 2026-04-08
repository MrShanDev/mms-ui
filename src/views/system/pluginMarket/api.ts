import request from '/@/utils/request';
import { getEnv, getFingerprint } from '/@/utils/mms';
import { Session } from '/@/utils/storage';
import { SysEnum } from '/@/enums/SysEnum';
import type { AxiosPromise, AxiosProgressEvent } from 'axios';

const hostBase = () => getEnv() + '/system/pluginHost';
const marketBase = () => getEnv() + '/system/pluginMarket';

export function fetchPluginMarketCards<T = any>(): AxiosPromise<T> {
  return request({ url: marketBase() + '/cards', method: 'get' });
}

export function fetchPluginHostStatus<T = any>(): AxiosPromise<T> {
  return request({ url: hostBase() + '/status', method: 'get' });
}

export function reloadPlugins<T = any>(): AxiosPromise<T> {
  return request({ url: hostBase() + '/reload', method: 'post' });
}

export function fetchPluginHostHealth<T = any>(): AxiosPromise<T> {
  return request({ url: hostBase() + '/health', method: 'get' });
}

/** 安装向导：数据源 / JDBC / 插件根目录 / DDL 执行器 / 库表桥接 等探测 */
export function fetchPluginInstallReadiness<T = any>(): AxiosPromise<T> {
  return request({ url: hostBase() + '/installReadiness', method: 'get' });
}

/** 插件独立日志尾部（logs/plugins/{pluginId}@{version}.log），默认约 128KB */
export function fetchPluginLogTail<T = any>(
  pluginId: string,
  version?: string | null,
  maxBytes?: number
): AxiosPromise<T> {
  return request({
    url: hostBase() + '/pluginLogTail',
    method: 'get',
    params: {
      pluginId,
      ...(version ? { version } : {}),
      ...(maxBytes != null ? { maxBytes } : {}),
    },
  });
}

/** 截断清空 plugins 下该插件独立日志文件 */
export function clearPluginLog<T = any>(pluginId: string, version?: string | null): AxiosPromise<T> {
  return request({
    url: hostBase() + '/pluginLogClear',
    method: 'post',
    data: { pluginId, version: version ?? null },
  });
}

export function fetchPluginManifests<T = any>(): AxiosPromise<T> {
  return request({ url: hostBase() + '/manifests', method: 'get' });
}

/** 安装前预览 JAR 内 META-INF/mms/schema.sql（不执行、不落盘） */
export function previewBundledPluginSchema(
  file: File,
  options?: { onUploadProgress?: (e: AxiosProgressEvent) => void }
): AxiosPromise<any> {
  const fd = new FormData();
  fd.append('file', file);
  return request({
    url: hostBase() + '/bundledSchemaPreview',
    method: 'post',
    data: fd,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: options?.onUploadProgress,
    timeout: 600_000,
  });
}

export function installPluginJar(
  file: File,
  options?: {
    /** 为 true 时跳过 JAR 内 schema.sql 与 script/install.sql；默认执行（与宿主 defaultValue=false 一致） */
    skipBundledSchemaExecution?: boolean;
    onUploadProgress?: (e: AxiosProgressEvent) => void;
  }
): AxiosPromise<any> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('skipBundledSchemaExecution', String(options?.skipBundledSchemaExecution === true));
  return request({
    url: hostBase() + '/install',
    method: 'post',
    data: fd,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: options?.onUploadProgress,
    // 大 JAR 上传 + 服务端解压校验可能较久，单独放宽（全局 request 默认 50s）
    timeout: 600_000,
  });
}

/** 与后端 `PluginInstallStreamResultCode`（mms-plugin-api）对齐；`HTTP_STATUS_ERROR` 仅前端兜底。 */
export const PluginInstallStreamResultCode = {
  SUCCESS: 'PLUGIN_INSTALL_SUCCESS',
  REQUEST_FILE_EMPTY: 'PLUGIN_INSTALL_REQUEST_FILE_EMPTY',
  REQUEST_NOT_JAR: 'PLUGIN_INSTALL_REQUEST_NOT_JAR',
  REQUEST_UPLOAD_FAILED: 'PLUGIN_INSTALL_REQUEST_UPLOAD_FAILED',
  SCHEMA_EXECUTOR_MISSING: 'PLUGIN_INSTALL_SCHEMA_EXECUTOR_MISSING',
  SCHEMA_EXECUTION_FAILED: 'PLUGIN_INSTALL_SCHEMA_EXECUTION_FAILED',
  INSTALL_SQL_EXECUTION_FAILED: 'PLUGIN_INSTALL_INSTALL_SQL_EXECUTION_FAILED',
  JAR_VALIDATION_FAILED: 'PLUGIN_INSTALL_JAR_VALIDATION_FAILED',
  JAR_INSTALL_FAILED: 'PLUGIN_INSTALL_JAR_INSTALL_FAILED',
  DATABASE_REGISTRATION_FAILED: 'PLUGIN_INSTALL_DATABASE_REGISTRATION_FAILED',
  STREAM_IO_FAILED: 'PLUGIN_INSTALL_STREAM_IO_FAILED',
  STREAM_INTERNAL_ERROR: 'PLUGIN_INSTALL_STREAM_INTERNAL_ERROR',
  /** 仅前端：响应状态非 2xx 且仍解析出成功 done 等兜底场景 */
  HTTP_STATUS_ERROR: 'PLUGIN_INSTALL_HTTP_STATUS_ERROR',
} as const;

export type InstallStreamLineEvent = { type: 'line'; level: string; text: string };
export type InstallStreamDoneEvent =
  | { type: 'done'; ok: true; code?: string; data: Record<string, unknown> }
  | { type: 'done'; ok: false; code?: string; msg: string };

export type InstallStreamEvent = InstallStreamLineEvent | InstallStreamDoneEvent;

/**
 * NDJSON 流式安装（与 POST /install 等价），每行一个 JSON：进度行 type=line，结束 type=done。
 * @param options.signal 外部中止（如用户点「取消」）
 * @param options.idleTimeoutMs 超过该毫秒未收到任意字节/行则中止（默认 3 分钟，防止后端卡死界面一直 loading）
 * @param options.overallTimeoutMs 从发起请求起整单硬超时（默认 10 分钟，含大 JAR 上传）
 */
export async function installPluginJarStream(
  file: File,
  options?: {
    skipBundledSchemaExecution?: boolean;
    onEvent?: (ev: InstallStreamEvent) => void;
    signal?: AbortSignal;
    idleTimeoutMs?: number;
    overallTimeoutMs?: number;
  }
): Promise<InstallStreamDoneEvent> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('skipBundledSchemaExecution', String(options?.skipBundledSchemaExecution === true));
  const prefix = (getEnv('VITE_APP_BASE') || '').replace(/\/$/, '');
  const path = `${hostBase()}/installStream`.replace(/\/+/g, '/');
  const url = `${prefix}${path.startsWith('/') ? '' : '/'}${path}`;
  const token = Session.get(SysEnum.TOKEN_KEY);
  const headers: Record<string, string> = {
    'App-Id': getFingerprint(),
    'Content-Language': 'CN',
  };
  if (token) {
    headers.Authorization = token;
  }

  const idleMs = options?.idleTimeoutMs ?? 180_000;
  const overallMs = options?.overallTimeoutMs ?? 600_000;
  const composite = new AbortController();
  const onExternalAbort = () => composite.abort();
  if (options?.signal) {
    if (options.signal.aborted) {
      composite.abort();
    } else {
      options.signal.addEventListener('abort', onExternalAbort);
    }
  }

  let lastActivity = Date.now();
  let abortHint: string | null = null;
  const touch = () => {
    lastActivity = Date.now();
  };
  const idleIv = window.setInterval(() => {
    if (Date.now() - lastActivity > idleMs) {
      abortHint = `安装流已超过 ${Math.round(idleMs / 1000)} 秒无新数据，已自动中断（可点「开始安装」重试或检查网络/后端日志）`;
      composite.abort();
    }
  }, 3000);
  const overallTimer = window.setTimeout(() => {
    abortHint = `安装请求整体超过 ${Math.round(overallMs / 1000)} 秒，已中断`;
    composite.abort();
  }, overallMs);

  const cleanupWatchers = () => {
    window.clearInterval(idleIv);
    window.clearTimeout(overallTimer);
    options?.signal?.removeEventListener('abort', onExternalAbort);
  };

  try {
    touch();
    const res = await fetch(url, { method: 'POST', body: fd, headers, signal: composite.signal });
    touch();
    if (!res.body) {
      const t = await res.text();
      throw new Error(t || `HTTP ${res.status}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let lastDone: InstallStreamDoneEvent | null = null;
    while (true) {
      const { done, value } = await reader.read();
      touch();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n');
      buffer = parts.pop() ?? '';
      for (const raw of parts) {
        const line = raw.trim();
        if (!line) {
          continue;
        }
        let ev: InstallStreamEvent;
        try {
          ev = JSON.parse(line) as InstallStreamEvent;
        } catch {
          throw new Error(`无法解析安装流: ${line.slice(0, 200)}`);
        }
        options?.onEvent?.(ev);
        if (ev.type === 'done') {
          lastDone = ev;
        }
      }
    }
    const tail = buffer.trim();
    if (tail) {
      const ev = JSON.parse(tail) as InstallStreamEvent;
      options?.onEvent?.(ev);
      if (ev.type === 'done') {
        lastDone = ev;
      }
    }
    if (!lastDone) {
      throw new Error(res.ok ? '安装流未返回结束标记' : `HTTP ${res.status}，且无有效响应体`);
    }
    if (!res.ok && lastDone.ok) {
      return {
        type: 'done',
        ok: false,
        code: PluginInstallStreamResultCode.HTTP_STATUS_ERROR,
        msg: `HTTP ${res.status}`,
      };
    }
    return lastDone;
  } catch (e) {
    if (abortHint) {
      throw new Error(abortHint);
    }
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('安装已取消或连接已中断');
    }
    throw e;
  } finally {
    cleanupWatchers();
  }
}

/** 服务端从 http(s) URL 下载 JAR 后安装（与上传安装等价，适合 CI/OSS 直链） */
export function installPluginFromUrl(url: string): AxiosPromise<any> {
  return request({
    url: hostBase() + '/installFromUrl',
    method: 'post',
    data: { url },
    timeout: 600_000,
  });
}

export function uninstallPlugin(pluginId: string, version?: string | null): AxiosPromise<any> {
  return request({
    url: hostBase() + '/uninstall',
    method: 'post',
    data: { pluginId, version: version || null },
  });
}

/**
 * 切换库表中的激活版本（磁盘上须已有该版本）。
 * 重载范围由宿主 `mms.plugin.activate-version-reload-scope` 决定：`FULL` 全量，`SINGLE_TARGET` 仅目标插件（见 version/v2.0.5 §5）。
 */
export function activatePluginVersion(pluginId: string, version: string): AxiosPromise<any> {
  return request({
    url: hostBase() + '/activateVersion',
    method: 'post',
    data: { pluginId, version },
  });
}

/** 仅移除库表登记并重载；不删磁盘 */
export function removePluginCatalog(pluginId: string): AxiosPromise<any> {
  return request({
    url: marketBase() + '/removeCatalog',
    method: 'post',
    data: { pluginId },
  });
}

/** 停用：清除库表激活标记并重载；不删磁盘与市场展示 */
export function deactivatePlugin(pluginId: string): AxiosPromise<any> {
  return request({
    url: marketBase() + '/deactivate',
    method: 'post',
    data: { pluginId },
  });
}

/** 删除：删磁盘安装目录 + 库表版本与市场行，并重载 */
export function purgePlugin(pluginId: string): AxiosPromise<any> {
  return request({
    url: marketBase() + '/purge',
    method: 'post',
    data: { pluginId },
  });
}

/** 插件专属 sys_config（键前缀 mms.plugin.{pluginId}.），按当前租户 */
export function fetchPluginMarketSysConfig<T = any>(pluginId: string): AxiosPromise<T> {
  return request({
    url: marketBase() + '/pluginSysConfig',
    method: 'get',
    params: { pluginId },
  });
}

export function savePluginMarketSysConfig<T = any>(body: {
  pluginId: string;
  items: Array<{ keySuffix: string; configName?: string; configValue?: string }>;
}): AxiosPromise<T> {
  return request({
    url: marketBase() + '/pluginSysConfig',
    method: 'post',
    data: body,
  });
}
