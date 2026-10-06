import { ref } from 'vue';
import request from './request';
import { getEnv } from './mms';
import { Local, Session } from './storage';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from './mitt';

export const themeSaveState = ref<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
const transient = new Set(['isDrawer', 'isFixedHeaderChange', 'isShowLogoChange']);
let loadedAccount = '';
let pending = false;
const endpoint = () => `${getEnv()}/system/user/themePreference`;

export function persistableTheme() {
  return Object.fromEntries(
    Object.entries(useThemeConfig().themeConfig).filter(([key]) => !transient.has(key))
  );
}
export async function saveThemePreferences() {
  if (themeSaveState.value === 'saving') return;
  themeSaveState.value = 'saving';
  try {
    const result: any = await request({
      url: endpoint(),
      method: 'put',
      data: persistableTheme(),
    });
    if (result.code !== 200) throw new Error(result.msg || '保存失败');
    themeSaveState.value = 'saved';
  } catch (error) {
    themeSaveState.value = 'error';
    throw error;
  }
}
export async function loadThemePreferences() {
  if (!Session.get('token')) {
    loadedAccount = '';
    return;
  }
  const user = Session.get('userInfo') || {};
  const account = String(user.userId || user.id || user.userName || 'current');
  if (pending || loadedAccount === account) return;
  pending = true;
  themeSaveState.value = 'loading';
  try {
    const response: any = await request({ url: endpoint(), method: 'get' });
    if (response.code !== 200) throw new Error(response.msg || '加载失败');
    const store = useThemeConfig();
    if (!Object.keys(response.data || {}).length) store.$reset();
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(response.data || {})) {
      if (transient.has(key) || !Object.prototype.hasOwnProperty.call(store.themeConfig, key))
        continue;
      const original = (store.themeConfig as any)[key];
      if (typeof value !== typeof original) continue;
      if (
        typeof value === 'string' &&
        /(?:color|bar|primary)/i.test(key) &&
        key !== 'layout' &&
        /[;{}]|url\s*\(/i.test(value)
      )
        continue;
      if (key === 'dashboardScene' && !['base', 'mall', 'office', 'task'].includes(String(value)))
        continue;
      clean[key] = value;
    }
    store.setThemeConfig({ themeConfig: { ...store.themeConfig, ...clean } });
    Local.set('themeConfig', store.themeConfig);
    mittBus.emit('themePreferencesLoaded');
    loadedAccount = account;
    themeSaveState.value = 'idle';
  } catch {
    themeSaveState.value = 'error';
  } finally {
    pending = false;
  }
}
