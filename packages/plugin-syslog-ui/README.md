# plugin-syslog-ui（Module Federation Remote）

在 **mms-ui 仓库内** 构建 syslog 插件的联邦 **Remote**，产出 `dist/assets/remoteEntry.js` 与 `assets/*` chunks，随 JAR 置于 **`META-INF/mms/web/`**，由后端 **`/plugin-assets/{pluginId}/{version}/...`** 提供静态资源（见 `version/v2.0.4-插件前端联邦模块开发方案.md`）。

**宿主主工程**：`vite.config.ts` 中 **`@mms-packages` → `packages/`**，菜单异步加载 **`@mms-packages/plugin-syslog-ui/src/SyslogPage.vue`**（与联邦 exposes 同源），**不加载 remoteEntry**（避免宿主启用 Module Federation 与 Vue/EP 初始化冲突）。独立跑 `pnpm dev` 开发主站即可联调；仅打 **带联邦静态资源的 JAR** 时需构建本包（见下 **`fed:plugin-ui:build`**）。

## 与主工程的关系

| 项 | 说明 |
|----|------|
| **别名 `/@`** | `vite.config.ts` 中指向仓库根 `src/`，可与主工程共用 `/@/utils/request` 等。 |
| **shared** | `vue` / `vue-router` / `pinia` / `element-plus` 与 Host **singleton**。 |
| **Host** | 菜单组件 **`system/runtimeLog/index`** → 异步导入 **`@mms-packages/plugin-syslog-ui/src/SyslogPage.vue`**（与联邦 exposes 同源）。 |

## 脚本（在 **mms-ui 根目录** 执行）

```bash
pnpm install
pnpm run fed:plugin-ui:dev -- @mms-ui/plugin-syslog-ui   # 开发：默认 http://localhost:5175
pnpm run fed:plugin-ui:build -- @mms-ui/plugin-syslog-ui # 产出 packages/plugin-syslog-ui/dist/
```

联调顺序：终端 A `pnpm run fed:plugin-ui:dev -- @mms-ui/plugin-syslog-ui`，终端 B `pnpm dev`；`.env.development` 中 **`VITE_SYSLOG_REMOTE_ENTRY=http://localhost:5175/assets/remoteEntry.js`**（与默认 `MMS_FED_REMOTE_BASE` 一致）。

## 生产 publicPath

打包进插件 JAR 时，`base` 须与 **`plugin.json` 的 id、version** 及 **`remoteEntryFile`** 一致，例如：

```bash
MMS_FED_REMOTE_BASE=/plugin-assets/mms.plugin.syslog/1.0.0/ pnpm run fed:plugin-ui:build -- @mms-ui/plugin-syslog-ui
```

入口相对路径为 **`assets/remoteEntry.js`**（见 `plugin.json` → `frontend.remoteEntryFile`）。主工程 **默认不通过 remoteEntry 拉取该页**；`.env.production` 中的 **`VITE_SYSLOG_REMOTE_ENTRY`** 仅作与插件 JAR 静态路径对齐的文档/备用参考，升级插件版本时请与 `plugin.json` 的 `version` 同步（当前示例 **1.0.1**）。

## 注意事项

- 子包未启用 **unplugin-auto-import**，请显式 `import` Element 等组件。
- 需登录且具备 **`plugin:syslog:*`** 等权限，接口前缀为 **`/plugin/mms.plugin.syslog/syslog`**。
