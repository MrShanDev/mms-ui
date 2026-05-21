import axios, { type AxiosInstance, type AxiosPromise } from 'axios';
import { ElMessage } from 'element-plus';
import { Session } from '/@/utils/storage';
import { SysEnum } from '/@/enums/SysEnum';

/** 从宿主 cookie 读取 token（仅依赖 js-cookie，安全） */
function getAuthToken(): string | null {
  const token = Session.get(SysEnum.TOKEN_KEY);
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
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = token;
    }
    return config;
  });

  // 响应拦截：统一错误提示
  http.interceptors.response.use(
    (response) => response,
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