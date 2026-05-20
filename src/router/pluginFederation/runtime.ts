import { getEnv } from '/@/utils/mms';
import { fetchPluginManifests } from '/@/views/system/pluginMarket/api';

/**
 * originjs federation 运行时 API（构建期 remotes 为空，通过运行时动态注册）。
 */
import {
  __federation_method_getRemote as getRemote,
  __federation_method_setRemote as setRemote,
  __federation_method_unwrapDefault as unwrapDefault,
} from 'virtual:__federation__';

type PluginManifestLike = {
  id?: string;
  frontend?: {
    modulePackage?: string;
  };
};

const scopeToPluginId = new Map<string, string>();
const scopeRegistered = new Set<string>();
let loaded = false;
let loading: Promise<void> | null = null;

function normalizeScope(raw: string): string {
  return raw.trim();
}

function buildRemoteEntryUrl(pluginId: string): string {
  return `/plugin-assets/${pluginId}/current/assets/remoteEntry.js`;
}

async function ensureManifestIndexLoaded(): Promise<void> {
  if (loaded) {
    return;
  }
  if (loading) {
    return loading;
  }
  loading = (async () => {
    const res = await fetchPluginManifests<any>();
    const arr = Array.isArray(res?.data) ? (res.data as PluginManifestLike[]) : [];
    scopeToPluginId.clear();
    for (const m of arr) {
      const pid = String(m?.id ?? '').trim();
      const scope = normalizeScope(String(m?.frontend?.modulePackage ?? ''));
      if (!pid || !scope) {
        continue;
      }
      scopeToPluginId.set(scope, pid);
    }
    loaded = true;
  })().finally(() => {
    loading = null;
  });
  return loading;
}

async function ensureScopeRemoteRegistered(scope: string): Promise<void> {
  await ensureManifestIndexLoaded();
  if (scopeRegistered.has(scope)) {
    return;
  }
  const pluginId = scopeToPluginId.get(scope);
  if (!pluginId) {
    throw new Error(`未找到 scope 对应的已加载插件: ${scope}`);
  }
  const remoteEntry = buildRemoteEntryUrl(pluginId);
  setRemote(scope, {
    url: remoteEntry,
    from: 'vite',
    format: 'esm',
  });
  scopeRegistered.add(scope);
}

export type FederationComponentRef = {
  scope: string;
  expose: string;
};

/**
 * 菜单 component 约定：federation:<ExposeName>@<scope>
 * 例：federation:SyslogPage@mms_plugin_syslog_ui
 */
export function parseFederationComponentRef(component: string): FederationComponentRef | null {
  const raw = String(component ?? '').trim();
  if (!raw.toLowerCase().startsWith('federation:')) {
    return null;
  }
  const payload = raw.slice('federation:'.length).trim();
  const at = payload.lastIndexOf('@');
  if (at <= 0 || at >= payload.length - 1) {
    return null;
  }
  const exposeRaw = payload.slice(0, at).trim();
  const scope = normalizeScope(payload.slice(at + 1));
  if (!exposeRaw || !scope) {
    return null;
  }
  const expose = exposeRaw.startsWith('./') ? exposeRaw : `./${exposeRaw}`;
  return { scope, expose };
}

export async function loadFederationComponent(scope: string, expose: string): Promise<unknown> {
  await ensureScopeRemoteRegistered(scope);
  const mod = await getRemote(scope, expose);

  const candidates: unknown[] = [unwrapDefault(mod), (mod as any)?.default, mod];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }
    if (typeof candidate === 'object' || typeof candidate === 'function') {
      return candidate;
    }
  }

  throw new Error(`联邦组件解析失败: ${scope}${expose}`);
}