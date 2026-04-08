/**
 * 插件联邦：后端菜单 {@code component} → 异步加载函数（内部为静态 {@code import('scope/Expose')}，供 Vite 分析 remote 边界）。
 */
export type PluginFederationRouteReg = {
  /** 与后端菜单 component 一致，如 doc/docConfig/index */
  component: string;
  load: () => Promise<unknown>;
};

const loaders = new Map<string, () => Promise<unknown>>();

function normalizeMenuComponent(raw: string): string {
  return raw.trim().replace(/^\/+/, '').replace(/\.vue$/i, '');
}

/** 由各插件在 {@code plugins/*.ts} 中调用，在应用启动前完成（经 {@code index.ts} 副作用 import）。 */
export function registerPluginFederationRoutes(entries: readonly PluginFederationRouteReg[]): void {
  for (const e of entries) {
    loaders.set(normalizeMenuComponent(e.component), e.load);
  }
}

export function resolvePluginFederatedView(component: string): (() => Promise<unknown>) | undefined {
  return loaders.get(normalizeMenuComponent(component));
}
