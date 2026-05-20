/**
 * 插件联邦路由入口：仅导出解析函数；远程插件改为运行时按已安装清单动态装载。
 */

export { resolvePluginFederatedView, registerPluginFederationRoutes } from './registry';
export type { PluginFederationRouteReg } from './registry';
