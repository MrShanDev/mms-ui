# plugin-doc-ui（Module Federation Remote）

MMS **文档站插件**（`mms.plugin.doc`）管理端联邦子包：文档配置、商品、订单、授权用户四类 CRUD，请求前缀与后端 `doc/docConfig` 等控制器一致。

## 与宿主主工程的关系（通用联邦机制）

主站对**所有**带联邦前端的插件采用同一套扩展方式（doc 仅为其中一例）：

1. **`vite.config.ts`**（mms-ui 根目录）：在 `federation({...})` 里维护 `shared` 版本线；`remotes` 已改为运行时按“已安装并已加载插件”动态注册，不再在构建期硬编码插件清单。
2. **`src/types/plugin-federation-scopes.d.ts`**：为同一 `scope` 追加 `declare module '<scope>/*'`。
3. **`src/router/pluginFederation/plugins/doc.ts`**：用 **`registerPluginFederationRoutes`** 注册菜单 `component` → **`import('<scope>/Expose')`**；并在 **`src/router/pluginFederation/index.ts`** 中 **`import './plugins/doc'`**。
4. **`backEnd.ts`** 已统一先走 **`resolvePluginFederatedView`**，无需再改。

本包对应关系：

- 菜单 **`doc/docXxx/index`**（与 `install.sql` 一致）→ **`mms_plugin_doc_ui/*Page`**；**`VITE_DOC_REMOTE_ENTRY`** 覆盖默认 remoteEntry（开发默认 `http://localhost:5176/assets/remoteEntry.js`；生产默认见 **`plugin-federation.host.ts`** / `.env.production`，升级插件版本时请同步）。
- **打 JAR**：在 **`mms-plugins/mms-plugin-doc`** 上 **`mvn ... -Pfed-web`**，将 **`dist/`** 打入 **`META-INF/mms/web/`**，由宿主 **`/plugin-assets/...`** 提供静态资源。

## 命令

```bash
cd mms-ui
pnpm install
pnpm run fed:plugin-ui:dev -- @mms-ui/plugin-doc-ui    # 默认 http://localhost:5176
pnpm run fed:plugin-ui:build -- @mms-ui/plugin-doc-ui
```

联调：终端 A `pnpm run fed:plugin-ui:dev -- @mms-ui/plugin-doc-ui`，终端 B 主站 `pnpm dev`（主站按 **`VITE_DOC_REMOTE_ENTRY`** 拉 **remoteEntry**）。

## 发布静态资源基准路径（可选）

```bash
MMS_FED_REMOTE_BASE=/plugin-assets/mms.plugin.doc/1.0.0/ pnpm run fed:plugin-ui:build -- @mms-ui/plugin-doc-ui
```

与 **`plugin.json` → `frontend.remoteEntryFile`**（默认 **`assets/remoteEntry.js`**）及 **`plugin.json` version** 对齐。
