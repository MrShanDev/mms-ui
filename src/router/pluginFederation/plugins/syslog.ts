/**
 * mms.plugin.syslog — 管理端联邦路由注册（与 packages/plugin-syslog-ui exposes 一致）。
 */
import { registerPluginFederationRoutes } from '../registry';

registerPluginFederationRoutes([
  { component: 'system/runtimeLog/index', load: () => import('mms_plugin_syslog_ui/SyslogPage') },
]);