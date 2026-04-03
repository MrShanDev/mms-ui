import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import type { AxiosPromise } from 'axios';

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

export function fetchPluginManifests<T = any>(): AxiosPromise<T> {
  return request({ url: hostBase() + '/manifests', method: 'get' });
}

export function installPluginJar(file: File): AxiosPromise<any> {
  const fd = new FormData();
  fd.append('file', file);
  return request({
    url: hostBase() + '/install',
    method: 'post',
    data: fd,
    headers: { 'Content-Type': 'multipart/form-data' },
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

/** 移除 sys_plugins / sys_plugin_version 中该插件的登记并重载；不删磁盘（与 uninstall 区分） */
export function removePluginCatalog(pluginId: string): AxiosPromise<any> {
  return request({
    url: marketBase() + '/removeCatalog',
    method: 'post',
    data: { pluginId },
  });
}
