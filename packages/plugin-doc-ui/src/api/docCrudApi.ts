import axios, { type AxiosInstance, type AxiosPromise } from 'axios';

const RAW_BASE_API = ((import.meta as any).env?.VITE_APP_BASE_API ?? '').toString().trim();
const API_BASE = RAW_BASE_API
  ? RAW_BASE_API.replace(/\/$/, '')
  : (typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) ? '/prod-api' : '');

const http: AxiosInstance = axios.create({
  baseURL: ((import.meta as any).env?.VITE_APP_BASE ?? '').toString(),
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token =
    (typeof localStorage !== 'undefined' &&
      (localStorage.getItem('Authorization') ||
        localStorage.getItem('TOKEN') ||
        localStorage.getItem('token'))) ||
    '';
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = String(token);
  }
  return config;
});

const secureHeaders = {
  'Encrypt-State': '0',
  'Encrypt-Type': 'AES',
};

/** 与后端 {@code doc/docXxx} 控制器路径一致（不含前导斜杠段外的 doc） */
export function docCrudApi(segment: string) {
  const prefix = `${API_BASE}/doc/${segment}`;
  return {
    list: <T = any>(params?: object): AxiosPromise<T> =>
      http({
        url: `${prefix}/list`,
        method: 'post',
        data: params,
        headers: secureHeaders,
      }),
    edit: <T = any>(params?: object): AxiosPromise<T> =>
      http({
        url: prefix,
        method: 'put',
        data: params,
        headers: secureHeaders,
      }),
    query: <T = any>(id?: number | string): AxiosPromise<T> =>
      http({
        url: `${prefix}/${id}`,
        method: 'get',
        headers: secureHeaders,
      }),
    insert: <T = any>(params?: object): AxiosPromise<T> =>
      http({
        url: prefix,
        method: 'post',
        data: params,
        headers: secureHeaders,
      }),
    delete: <T = any>(id?: number | string): AxiosPromise<T> =>
      http({
        url: `${prefix}/${id}`,
        method: 'delete',
        headers: secureHeaders,
      }),
  };
}
