import axios, { type AxiosInstance, type AxiosPromise } from 'axios';
import { ElMessage } from 'element-plus';
import Cookie from 'js-cookie';
import { AES, enc, mode, pad } from 'crypto-js';

function hostSessionValue(key: string): string | null {
  const current = window.sessionStorage.getItem(`mms-ui:${key}`);
  if (current !== null) return current;
  // Compatibility with the already-deployed lab bundle's missing package-name define.
  if (window.location.hostname === '127.0.0.1' && window.location.port === '18081') {
    return window.sessionStorage.getItem(`undefined:${key}`);
  }
  return null;
}

function cookieValue(name: string): string {
  // The Docker lab isolates its login session from other localhost apps.
  const labValue = hostSessionValue(`lab-cookie:${name}`);
  const value = (labValue ? JSON.parse(labValue) : Cookie.get(name)) ?? '';
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === 'string' ? parsed : value;
  } catch {
    return value;
  }
}

function decryptResponse(ciphertext: string): unknown {
  const key = cookieValue('Secret-Key');
  const appId = cookieValue('App-Id');
  if (!key || appId.length !== 16) throw new Error('登录加密会话无效，请重新登录');
  const plaintext = AES.decrypt(ciphertext, enc.Utf8.parse(key), {
    iv: enc.Utf8.parse(appId), mode: mode.CBC, padding: pad.ZeroPadding,
  }).toString(enc.Utf8);
  return JSON.parse(plaintext);
}

/** 从宿主 cookie 读取 token（仅依赖 js-cookie，安全） */
function getAuthToken(): string | null {
  const ownSession = hostSessionValue('token');
  const token = ownSession ? JSON.parse(ownSession) : Cookie.get('token');
  if (token != null && token !== '') {
    return token;
  }
  return null;
}

/** 创建通用 axios 实例 */
export function createHttp(baseURL?: string): AxiosInstance {
  const http = axios.create({
    baseURL: baseURL ?? '',
    timeout: 50000,
    headers: { 'Content-Type': 'application/json' },
  });

  // 请求拦截：注入 Authorization
  http.interceptors.request.use((config) => {
    config.headers['App-Id'] = cookieValue('App-Id');
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = token;
    }
    return config;
  });

  // 响应拦截：统一错误提示
  http.interceptors.response.use(
    (response) => {
      const result = response.data;
      if (result?.isSecurity === true) {
        if (result.data && typeof result.data === 'object' && 'total' in result.data) {
          result.rows = decryptResponse(result.data.rows);
          result.total = Number(result.data.total);
          delete result.data;
        } else {
          result.data = decryptResponse(result.data);
        }
        delete result.isSecurity;
      }
      return response;
    },
    (error) => {
      const msg = error?.response?.data?.msg || error?.message || '请求失败';
      ElMessage.warning(msg);
      return Promise.reject(error);
    },
  );

  return http;
}

/** 默认实例（baseURL 在构建时求值或运行时从 window 推断） */
const defaultHttp = createHttp();

/** 通用 CRUD 请求工具 */
export function createCrudApi(prefix: string, http: AxiosInstance = defaultHttp) {
  const secureHeaders = {
    'Encrypt-State': '0',
    'Encrypt-Type': 'AES',
  };

  return {
    list: <T = any>(params?: object): AxiosPromise<T> =>
      http({ url: `${prefix}/list`, method: 'post', data: params, headers: secureHeaders }),

    query: <T = any>(id?: number | string): AxiosPromise<T> =>
      http({ url: `${prefix}/${id}`, method: 'get', headers: secureHeaders }),

    insert: <T = any>(params?: object): AxiosPromise<T> =>
      http({ url: prefix, method: 'post', data: params, headers: secureHeaders }),

    edit: <T = any>(params?: object): AxiosPromise<T> =>
      http({ url: prefix, method: 'put', data: params, headers: secureHeaders }),

    delete: <T = any>(id?: number | string): AxiosPromise<T> =>
      http({ url: `${prefix}/${id}`, method: 'delete', headers: secureHeaders }),
  };
}

export default defaultHttp;
