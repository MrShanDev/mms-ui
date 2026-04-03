# plugin-remote-sample（Module Federation Remote）

在 **mms-ui 仓库内** 增加联邦 **Remote** 构建，产出 `remoteEntry.js` 与 `assets/*` chunks，供 v2.0.4 所述 **`META-INF/mms/web/`** 或静态目录 **`/plugin-assets/...`** 使用。

## 与主工程的关系

| 项 | 说明 |
|----|------|
| **别名 `/@`** | 在 `vite.config.ts` 中指向 **仓库根** 的 `src/`，可在本包 `.vue/.ts` 中 `import ... from '/@/utils/...'` 等，**与主工程同源**。 |
| **shared** | 默认 `vue` / `vue-router` / `pinia` 与 Host **singleton**。若页面使用 Element Plus，请在 `vite.config.ts` 的 `shared` 中取消注释 `element-plus`。 |
| **打进 Remote 包的内容** | 你从 `/@` 引用的 **业务组件、工具、样式** 会被 Rollup **打进本 Remote**（体积随引用增加）。 |

## 脚本（在 **mms-ui 根目录** 执行）

```bash
pnpm install
pnpm run fed:remote:sample:dev    # 开发：http://localhost:5174
pnpm run fed:remote:sample:build  # 产出 packages/plugin-remote-sample/dist/
```

## 生产 publicPath

构建默认 `base` 为 `/plugin-assets/com.sxpcwlkj.plugin.remote.sample/1.0.0/`。若你的插件 id/version 不同，构建前设置：

```bash
MMS_FED_REMOTE_BASE=/plugin-assets/你的插件ID/版本/ pnpm run fed:remote:sample:build
```

入口文件位于 **`dist/assets/remoteEntry.js`**（非根目录），`plugin.json` 的 `remoteEntryFile` 可写 `assets/remoteEntry.js`（以 v2.0.4 评审字段为准）。

## 注意事项

- 主工程大量使用的 **unplugin-auto-import** 在本子包 **未启用**，请尽量 **显式 import**（如 Element 组件、API）。
- 若 Remote 引用了依赖 **全局 Pinia / Router 实例** 的模块，需与 Host 挂载顺序一致，否则运行期可能异常。
- 与 Host 联调：主应用需配置 Federation **Host** 并注册 `remotes.mms_plugin_remote_sample`（开发态指向 `http://localhost:5174/remoteEntry.js`），具体见 `version/v2.0.4-插件前端联邦模块开发方案.md`。
