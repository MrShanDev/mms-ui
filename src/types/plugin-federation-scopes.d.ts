/**
 * 联邦 Remote 的 import 路径形如 {@code <scope>/<ExposeName>}。
 * 每在 {@link ../../plugin-federation.host.ts} 增加一个 {@code scope}，请在此追加一条同名的 {@code declare module '<scope>/*'}，
 * 以便 TypeScript 识别动态 import（Vite 仍由 federation remotes 解析真实资源）。
 */
declare module 'mms_plugin_doc_ui/*' {
  import type { DefineComponent } from 'vue';
  const c: DefineComponent<object, object, any>;
  export default c;
}
