/**
 * 插件联邦路由入口：导入各插件注册模块（副作用），并导出解析函数供 {@code backEnd.ts} 使用。
 * 新增插件：增加 ./plugins/<id>.ts，并在本文件追加 import './plugins/<id>'。
 */
import './plugins/doc';

export { resolvePluginFederatedView, registerPluginFederationRoutes } from './registry';
export type { PluginFederationRouteReg } from './registry';
