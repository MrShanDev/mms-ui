import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
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
    /** 默认 true：不执行 JAR 内 schema.sql（与历史行为一致） */
    skipBundledSchemaExecution?: boolean;
    onUploadProgress?: (e: AxiosProgressEvent) => void;
  }
): AxiosPromise<any> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('skipBundledSchemaExecution', String(options?.skipBundledSchemaExecution !== false));
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
