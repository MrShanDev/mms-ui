# plugin-syslog-ui（Module Federation Remote）

在 **mms-ui 仓库内** 构建 syslog 插件的联邦 **Remote**，产出 `dist/assets/remoteEntry.js` 与 `assets/*` chunks，随 JAR 置于 **`META-INF/mms/web/`**，由后端 **`/plugin-assets/{pluginId}/{version}/...`** 提供静态资源（见 `version/v2.0.4-插件前端联邦模块开发方案.md`）。

## 与主工程的关系

| 项 | 说明 |
|----|------|
| **别名 `/@`** | `vite.config.ts` 中指向仓库根 `src/`，可与主工程共用 `/@/utils/request` 等。 |
| **shared** | `vue` / `vue-router` / `pinia` / `element-plus` 与 Host **singleton**。 |
| **Host** | 主工程 `mms-ui` 已注册 `remotes.mms_plugin_syslog_ui`，菜单组件 **`system/runtimeLog/index`** 对应 `src/views/system/runtimeLog/index.vue`，动态加载本包暴露的 **`SyslogPage`**。 |

## 脚本（在 **mms-ui 根目录** 执行）

```bash
pnpm install
pnpm run fed:syslog-ui:dev     # 开发：默认 http://localhost:5175，产出 /assets/remoteEntry.js
pnpm run fed:syslog-ui:build    # 产出 packages/plugin-syslog-ui/dist/
```

联调顺序：终端 A `pnpm fed:syslog-ui:dev`，终端 B `pnpm dev`；`.env.development` 中 **`VITE_SYSLOG_REMOTE_ENTRY=http://localhost:5175/assets/remoteEntry.js`**（与默认 `MMS_FED_REMOTE_BASE` 一致）。

## 生产 publicPath

打包进插件 JAR 时，`base` 须与 **`plugin.json` 的 id、version** 及 **`remoteEntryFile`** 一致，例如：

```bash
MMS_FED_REMOTE_BASE=/plugin-assets/mms.plugin.syslog/1.0.0/ pnpm run fed:syslog-ui:build
```

入口相对路径为 **`assets/remoteEntry.js`**（见 `plugin.json` → `frontend.remoteEntryFile`）。主工程生产环境在 **`.env.production`** 中配置 **`VITE_SYSLOG_REMOTE_ENTRY`** 指向同一 URL（默认已写 1.0.0 路径，升级插件版本时请同步修改）。

## 注意事项

- 子包未启用 **unplugin-auto-import**，请显式 `import` Element 等组件。
- 需登录且具备 **`plugin:syslog:*`** 等权限，接口前缀为 **`/plugin/mms.plugin.syslog/syslog`**。
