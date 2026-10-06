import { createHttp } from '@mms-ui/plugin-common-kit/api/request';

const http = createHttp(import.meta.env.VITE_APP_BASE || '');
const apiBase = import.meta.env.VITE_APP_BASE_API || '/prod-api';
const headers = { 'Encrypt-State': '0', 'Encrypt-Type': 'AES' };
type ConfigItem = { configKey: string; configValue: string };
type Result<T> = { code: number; msg?: string; data: T };
function unwrap<T>(result: Result<T>): Result<T> {
  if (result.code !== 200) throw new Error(result.msg || '请求失败');
  return result;
}
// 使用插件公共请求工具；授权仍由通用配置服务的 super_admin 校验。
export function websiteSettingsApi() {
  return {
    getConfigs: async (params: object) =>
      unwrap((await http.post<Result<ConfigItem[]>>(`${apiBase}/system/config/getConfigs`, params, { headers })).data),
    configs: async (params: object) =>
      unwrap((await http.post<Result<boolean>>(`${apiBase}/system/config/configs`, params, { headers })).data),
  };
}
export async function uploadImg(params: FormData) {
  const response = await http.post<Result<{ url: string }>>(`${apiBase}/system/oss/elUpload`, params, {
    headers: { ...headers, 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response.data);
}
