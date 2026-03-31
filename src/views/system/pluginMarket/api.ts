import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import type { AxiosPromise } from 'axios';

const base = () => getEnv() + '/system/pluginHost';

export function fetchPluginHostStatus<T = any>(): AxiosPromise<T> {
  return request({ url: base() + '/status', method: 'get' });
}

export function reloadPlugins<T = any>(): AxiosPromise<T> {
  return request({ url: base() + '/reload', method: 'post' });
}

export function fetchPluginHostHealth<T = any>(): AxiosPromise<T> {
  return request({ url: base() + '/health', method: 'get' });
}

export function fetchPluginManifests<T = any>(): AxiosPromise<T> {
  return request({ url: base() + '/manifests', method: 'get' });
}

export function installPluginJar(file: File): AxiosPromise<any> {
  const fd = new FormData();
  fd.append('file', file);
  return request({
    url: base() + '/install',
    method: 'post',
    data: fd,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
