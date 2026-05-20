# mms-ui（管理端前端）

[English](README.en.md) | 简体中文

`mms-ui` 是 **MMS 管理端前端**，用于对接 `mms/mms-admin` 后端能力，同时支持将部分“插件前端子包”通过 **Module Federation** 的方式打包并随插件 JAR 一起交付（见 `mms-plugins/README.md` 中的联邦章节）。

---

## 技术栈

- Vue 3 + Vite + TypeScript
- Element Plus / Pinia / Vue Router
- 包管理器：pnpm（推荐团队统一）

---

## 环境要求

- Node.js：建议 **18+**（推荐 20 LTS）
- pnpm：建议 8+（`npm i -g pnpm`）

---

## 快速开始

### 安装依赖

```bash
cd mms-ui
pnpm install
```

### 本地开发

```bash
pnpm dev
```

### 构建与预览

```bash
pnpm build
pnpm preview
```

---

## 常用脚本（package.json）

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 开发（`vite --mode development --open`） |
| `pnpm build` | 生产构建（`vite build --mode production`） |
| `pnpm preview` | 预览构建产物 |
| `pnpm lint` / `pnpm lint:fix` | ESLint 检查 / 自动修复 |
| `pnpm type-check` | `vue-tsc` 类型检查（不产物输出） |
| `pnpm format` / `pnpm format:check` | Prettier 格式化 / 校验 |
| `pnpm fed:plugin-ui:build` | 构建插件联邦子包（配合 `-- <packageName>`） |
| `pnpm fed:plugin-ui:dev` | 开发插件联邦子包（配合 `-- <packageName>`） |
| `pnpm mms` / `pnpm mms:win` | 交互式菜单脚本（镜像/依赖/构建等） |

---

## 插件联邦（Module Federation）

部分插件会把前端子包（通常在 `mms-ui/packages/plugin-*-ui`）构建产物打进插件 JAR 的 `META-INF/mms/web`，实现“插件安装即带 UI”。

示例（以 syslog 插件为例，**须在 `mms-ui` 仓库根**执行）：

```bash
cd mms-ui
pnpm install
pnpm run fed:plugin-ui:build -- @mms-ui/plugin-syslog-ui
```

与插件 Maven 构建联动（**`-Pfed-web` 会在 `prepare-package` 自动调用上述 pnpm 命令**；需已安装 Node/pnpm）：

```bash
# 在 mms-plus/mms-plugins 目录：
mvn -pl mms-plugin-tool-syslog -am package -Pfed-web -DskipTests

# 或在单插件目录 mms-plugins/mms-plugin-tool-syslog：
mvn -pl . -am package -Pfed-web -DskipTests
```

已打好 `dist` 且仅需打 JAR 时：`-Dskip.fed.syslog.ui.build=true`。构建告警与体积说明见 **`packages/plugin-syslog-ui/README.md`**（CI 一节）。

详细规范与自检清单：

- `mms-plugins/README.md`（联邦章节）
- `.cursor/skills/mms-plugin/SKILL.md`（联邦前端与插件 JAR 一键打包）

---

## 国内镜像/依赖安装加速（可选）

项目内提供了镜像配置与验证脚本（在 `mms-ui/` 下）：

```bash
bash scripts/setup-npm-mirrors.sh
bash scripts/verify-mirrors.sh
```

---

## 常见问题（精选）

1. `vite build` 时出现一堆 TS 类型错误  
   - 这是 `vue-tsc --noEmit` 的类型检查结果；是否阻断构建以团队策略为准。
2. 安装依赖卡住/找不到某些平台包  
   - 建议先统一 Node/pnpm 版本，再清理 `node_modules` 与 lockfile 重新安装。

---

## 相关链接

- 后端（子模块）：`../mms/`
- 插件聚合：`../mms-plugins/`
- 文档站：`../mms-doc/`

