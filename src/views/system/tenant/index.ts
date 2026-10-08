import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
export const tenantApi = {
  list: (data: object) => request({ url: getEnv() + '/system/tenant/list', method: 'post', data }),
  runtime: () => request({ url: getEnv() + '/system/config/tenantRuntime', method: 'get' }),
  query: (id: string) =>
    request({ url: getEnv() + '/system/tenant/' + encodeURIComponent(id), method: 'get' }),
  save: (data: object, create: boolean) =>
    request({ url: getEnv() + '/system/tenant', method: create ? 'post' : 'put', data }),
  packages: () => request({ url: getEnv() + '/system/tenantPackage', method: 'get' }),
  menus: () => request({ url: getEnv() + '/system/tenantPackage/menus', method: 'get' }),
  savePackage: (data: object) =>
    request({ url: getEnv() + '/system/tenantPackage', method: 'post', data }),
  mode: (enabled: boolean) =>
    request({ url: getEnv() + '/system/config/tenantRuntime', method: 'put', data: { enabled } }),
};
