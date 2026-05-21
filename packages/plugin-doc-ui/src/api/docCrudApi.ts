import { createCrudApi } from '@mms-ui/plugin-common-kit/api/request';

const RAW_BASE_API = ((import.meta as any).env?.VITE_APP_BASE_API ?? '').toString().trim();
const API_BASE = RAW_BASE_API
  ? RAW_BASE_API.replace(/\/$/, '')
  : (typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) ? '/prod-api' : '');

/** 与后端 {@code doc/docXxx} 控制器路径一致 */
export function docCrudApi(segment: string) {
  return createCrudApi(`${API_BASE}/doc/${segment}`);
}