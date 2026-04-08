/**
 * mms.plugin.doc — 管理端联邦路由注册（与 packages/plugin-doc-ui exposes 一致）。
 */
import { registerPluginFederationRoutes } from '../registry';

registerPluginFederationRoutes([
  { component: 'doc/docConfig/index', load: () => import('mms_plugin_doc_ui/DocConfigPage') },
  { component: 'doc/docProduct/index', load: () => import('mms_plugin_doc_ui/DocProductPage') },
  { component: 'doc/docOrder/index', load: () => import('mms_plugin_doc_ui/DocOrderPage') },
  { component: 'doc/docAuthorizeUser/index', load: () => import('mms_plugin_doc_ui/DocAuthorizeUserPage') },
]);
