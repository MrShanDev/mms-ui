/**
 * 主站 Vite Module Federation（Host）远程列表：与 {@code vite.config.ts} 中 federation.remotes 同源。
 * 新增插件时：
 * 1. 在此数组追加一项（scope、环境变量名、dev/prod 默认 remoteEntry URL）；
 * 2. 在 {@code src/types/plugin-federation-scopes.d.ts} 为同一 scope 追加一条 {@code declare module '<scope>/*'}（供 TS 识别动态 import）；
 * 3. 在 {@code src/router/pluginFederation/plugins/} 下新增注册文件并 {@code import} 到 {@code pluginFederation/index.ts}。
 */
export type PluginFederationRemoteDef = {
  /** 与 Remote 子包 vite federation {@code name} 一致，且为 remotes 键 */
  scope: string;
  /** 完整 remoteEntry URL（或同源路径）；由 .env 覆盖 */
  envVar: string;
  devFallback: string;
  prodFallback: string;
};

export const PLUGIN_FEDERATION_REMOTES: PluginFederationRemoteDef[] = [
  {
    scope: 'mms_plugin_doc_ui',
    envVar: 'VITE_DOC_REMOTE_ENTRY',
    devFallback: 'http://localhost:5176/assets/remoteEntry.js',
    prodFallback: '/plugin-assets/mms.plugin.doc/1.0.0/assets/remoteEntry.js',
  },
];

/**
 * 生成 {@code @originjs/vite-plugin-federation} 的 {@code remotes} 字段。
 * <p>值须为 <strong>remoteEntry 的完整 URL 或同源路径</strong>（勿使用 {@code scope@url}）：否则运行时会生成
 * {@code import('scope@http://...')}，浏览器原生动态 import 无法解析该说明符，报
 * {@code Failed to resolve module specifier}。</p>
 */
export function buildOriginjsFederationRemotes(
  env: Record<string, string>,
  command: 'build' | 'serve'
): Record<string, string> {
  const remotes: Record<string, string> = {};
  for (const r of PLUGIN_FEDERATION_REMOTES) {
    const raw = env[r.envVar]?.trim();
    const entry = raw || (command === 'serve' ? r.devFallback : r.prodFallback);
    remotes[r.scope] = entry;
  }
  return remotes;
}

/**
 * 与各插件 Remote 子包 {@code vite.config} 的 {@code shared} 主版本保持一致；新增 Remote 时勿改版本线除非全仓对齐。
 */
export const PLUGIN_FEDERATION_SHARED = {
  vue: { singleton: true, requiredVersion: '^3.5.0' },
  'vue-router': { singleton: true, requiredVersion: '^4.3.0' },
  pinia: { singleton: true, requiredVersion: '^2.0.0' },
  'element-plus': { singleton: true, requiredVersion: '^2.11.0' },
} as const;
