# 📁 MMS-UI 项目文件架构清单 🗂️

## 🎯 项目概述 ✨

**MMS-UI** 是一个基于 **Vue3 + TypeScript + Vite** 技术栈的现代化前端项目，采用模块化架构设计，提供完整的开发环境管理工具和丰富的功能特性。

## 📊 项目统计 📈

- **📂 总目录数**: 15+
- **📄 总文件数**: 100+
- **🔧 脚本工具**: 6个
- **🎨 样式文件**: 5个
- **⚙️ 配置文件**: 12个
- **📦 组件数量**: 19+

## 🌳 项目架构树 🌲

```
mms-ui/
├── 📋 配置文件层
│   ├── .env                    # 🌐 环境变量配置
│   ├── .env.development        # 🛠️ 开发环境配置
│   ├── .env.production         # 🚀 生产环境配置
│   ├── .eslintrc.js            # 📝 ESLint 代码规范配置
│   ├── .prettierrc.js          # 💄 Prettier 格式化配置
│   ├── .npmrc                  # 📦 NPM 镜像源配置
│   ├── .pnpmrc                 # 🚀 PNPM 配置
│   ├── package.json            # 📋 项目依赖配置
│   ├── tsconfig.json           # 🔧 TypeScript 配置
│   ├── vite.config.ts          # ⚡ Vite 构建配置
│   └── windi.config.ts         # 🎨 WindiCSS 样式配置
│
├── 🛠️ 开发脚本层
│   └── scripts/
│       ├── mms.sh              # 🐧 Linux/macOS 开发工具菜单
│       ├── mms.ps1             # 🪟 Windows 开发工具菜单
│       ├── start-pnpm.sh       # 🚀 Linux/macOS 一键启动脚本
│       ├── start-pnpm.ps1      # 🚀 Windows 一键启动脚本
│       ├── setup-npm-mirrors.sh # 🌐 镜像源配置脚本
│       └── verify-mirrors.sh   # ✅ 镜像源验证脚本
│
├── 🎯 核心应用层
│   └── src/
│       ├── 📱 应用入口
│       │   ├── main.ts         # 🚀 应用程序主入口
│       │   ├── App.vue         # 🏠 根组件
│       │   └── index.html      # 📄 HTML 模板
│       │
│       ├── 🧩 组件系统
│       │   ├── components/     # 🧩 公共组件库 (19个组件)
│       │   └── layout/         # 📐 布局组件 (11个文件)
│       │
│       ├── 📄 页面视图
│       │   └── views/          # 📄 页面组件 (4个页面)
│       │
│       ├── 🛣️ 路由导航
│       │   └── router/         # 🛣️ 路由配置 (4个文件)
│       │
│       ├── 🗄️ 状态管理
│       │   └── stores/         # 🗄️ Pinia 状态管理 (8个store)
│       │
│       ├── 🎨 样式系统
│       │   └── styles/         # 🎨 样式文件 (5个文件)
│       │       ├── mms.scss    # 🎯 MMS 工具类样式库
│       │       └── ...         # 🎨 其他样式文件
│       │
│       ├── 🌍 国际化
│       │   └── i18n/           # 🌍 多语言配置 (3个文件)
│       │
│       ├── 🔧 工具函数
│       │   └── utils/          # 🔧 工具函数库 (19个工具)
│       │
│       ├── 📊 类型定义
│       │   └── types/          # 📊 TypeScript 类型定义 (10个文件)
│       │
│       ├── 🎭 指令系统
│       │   └── directive/      # 🎭 Vue 自定义指令 (3个指令)
│       │
│       ├── 🎪 枚举常量
│       │   └── enums/          # 🎪 枚举定义 (4个枚举)
│       │
│       ├── 🔗 自定义钩子
│       │   └── hooks/          # 🔗 Vue Composition API 钩子 (2个钩子)
│       │
│       ├── 🎨 主题系统
│       │   └── theme/          # 🎨 主题配置 (12个文件)
│       │
│       ├── 🖼️ 图标资源
│       │   └── icons/          # 🖼️ SVG 图标 (1个文件)
│       │
│       └── 📦 静态资源
│           └── assets/         # 📦 静态资源 (10个文件)
│
├── 🌐 静态资源层
│   └── public/
│       └── favicon.ico         # 🔖 网站图标
│
├── 📚 文档系统
│   ├── README.md               # 📖 项目说明文档
│   ├── USAGE_GUIDE.md          # 🚀 项目使用指南
│   ├── MMS_SCSS_GUIDE.md       # 🎨 样式库使用指南
│   └── START_PNPM_GUIDE.md     # 🚀 启动脚本指南
│
└── 🔐 版本控制
    ├── .git/                   # 🔐 Git 版本控制
    ├── .gitignore              # 🚫 Git 忽略文件
    ├── LICENSE                 # 📜 开源许可证
    └── pnpm-lock.yaml          # 🔒 依赖锁定文件
```

## 📋 详细文件清单 📝

### 🎯 核心配置文件 ⚙️

| 文件名 | 用途说明 | 重要程度 |
|--------|----------|----------|
| `📦 package.json` | 项目依赖和脚本配置 | ⭐⭐⭐⭐⭐ |
| `⚡ vite.config.ts` | Vite 构建工具配置 | ⭐⭐⭐⭐⭐ |
| `🔧 tsconfig.json` | TypeScript 编译配置 | ⭐⭐⭐⭐⭐ |
| `🎨 windi.config.ts` | WindiCSS 样式框架配置 | ⭐⭐⭐⭐ |
| `📝 .eslintrc.js` | ESLint 代码规范配置 | ⭐⭐⭐⭐ |
| `💄 .prettierrc.js` | Prettier 代码格式化配置 | ⭐⭐⭐⭐ |
| `🌐 .npmrc` | NPM 镜像源和缓存配置 | ⭐⭐⭐ |
| `🚀 .pnpmrc` | PNPM 包管理器配置 | ⭐⭐⭐ |

### 🛠️ 开发脚本工具 🔧

| 脚本文件 | 功能描述 | 平台支持 |
|----------|----------|----------|
| `🐧 mms.sh` | Linux/macOS 综合开发工具菜单 | Linux/macOS |
| `🪟 mms.ps1` | Windows 综合开发工具菜单 | Windows |
| `🚀 start-pnpm.sh` | Linux/macOS 一键启动脚本 | Linux/macOS |
| `🚀 start-pnpm.ps1` | Windows 一键启动脚本 | Windows |
| `🌐 setup-npm-mirrors.sh` | NPM 镜像源配置脚本 | 跨平台 |
| `✅ verify-mirrors.sh` | 镜像源验证脚本 | 跨平台 |

### 🎯 源代码架构 💻

#### 📱 应用核心 (src/)

| 目录/文件 | 功能说明 | 文件数量 |
|-----------|----------|----------|
| `🚀 main.ts` | 应用程序主入口文件 | 1个 |
| `🏠 App.vue` | 根组件，应用程序外壳 | 1个 |
| `🧩 components/` | 可复用的公共组件库 | 19个组件 |
| `📐 layout/` | 页面布局组件系统 | 11个文件 |
| `📄 views/` | 页面级组件 | 4个页面 |
| `🛣️ router/` | Vue Router 路由配置 | 4个文件 |
| `🗄️ stores/` | Pinia 状态管理 | 8个store |

#### 🎨 样式与主题系统

| 目录/文件 | 功能说明 | 特色 |
|-----------|----------|------|
| `🎨 styles/` | 样式文件集合 | 5个文件 |
| `🎯 styles/mms.scss` | MMS 工具类样式库 | 200+样式类 |
| `🎨 theme/` | 主题配置系统 | 12个文件 |
| `🎨 windi.config.ts` | WindiCSS 配置 | 协同工作 |

#### 🔧 工具与类型系统

| 目录 | 功能说明 | 文件数量 |
|------|----------|----------|
| `🔧 utils/` | 工具函数库 | 19个工具 |
| `📊 types/` | TypeScript 类型定义 | 10个文件 |
| `🎪 enums/` | 枚举常量定义 | 4个枚举 |
| `🎭 directive/` | Vue 自定义指令 | 3个指令 |
| `🔗 hooks/` | Composition API 钩子 | 2个钩子 |

#### 🌍 国际化与资源

| 目录 | 功能说明 | 内容 |
|------|----------|------|
| `🌍 i18n/` | 多语言国际化 | 3个语言文件 |
| `🖼️ icons/` | SVG 图标资源 | 1个图标文件 |
| `📦 assets/` | 静态资源文件 | 10个资源文件 |

### 📚 文档系统 📖

| 文档文件 | 内容描述 | 用途 |
|----------|----------|------|
| `📖 README.md` | 项目主要说明文档 | 项目介绍、快速开始 |
| `🚀 USAGE_GUIDE.md` | 完整使用指南 | 详细使用说明 |
| `🎨 MMS_SCSS_GUIDE.md` | 样式库使用指南 | 见名知意的样式文档 |
| `🚀 START_PNPM_GUIDE.md` | 启动脚本使用指南 | 脚本使用说明 |

## 🎯 架构特点 ✨

### 🏗️ **模块化设计**
- **📂 目录分层**: 清晰的功能分层架构
- **🧩 组件化**: 高度模块化的组件系统
- **🔧 工具化**: 丰富的工具函数库
- **🎨 主题化**: 完整的主题系统

### ⚡ **现代化技术栈**
- **🚀 Vue3**: 最新的 Vue.js 框架
- **📝 TypeScript**: 完整的类型系统
- **⚡ Vite**: 快速的构建工具
- **🎨 WindiCSS**: 高效的样式框架
- **🧩 Element Plus**: 丰富的 UI 组件库

### 🛠️ **开发体验优化**
- **📋 脚本工具**: 8个开发脚本工具
- **🔧 配置完善**: 12个配置文件
- **📚 文档齐全**: 4个详细文档
- **🌐 镜像加速**: 完整的镜像配置

### 🎨 **样式系统**
- **🎯 MMS.scss**: 200+ 见名知意的样式类
- **🎨 WindiCSS**: 协同工作避免冲突
- **📏 4px体系**: 统一的数值递增体系
- **📱 响应式**: 三种断点的响应式系统

## 🚀 快速导航 🧭

### 📱 **开发入口**
```bash
# 🚀 一键启动 (推荐)
npm run start:pnpm
./scripts/start-pnpm.sh

# 🛠️ 开发工具菜单
./scripts/mms.sh          # Linux/macOS
./scripts/mms.ps1         # Windows
```

### 🎨 **样式开发**
```scss
// 🎯 使用 MMS 样式类
.my-component {
  @apply lay-flex-row lay-items-center sp-p-4;
}
```

### 🧩 **组件开发**
```vue
<!-- 📦 在 src/components/ 下创建组件 -->
<template>
  <div class="lay-flex-row lay-items-center">
    <!-- 组件内容 -->
  </div>
</template>
```

### 📄 **页面开发**
```vue
<!-- 📄 在 src/views/ 下创建页面 -->
<template>
  <div class="resp-container">
    <!-- 页面内容 -->
  </div>
</template>
```

## 🔗 相关链接 📎

- 📖 [项目使用指南](./USAGE_GUIDE.md)
- 🎨 [MMS 样式库指南](./MMS_SCSS_GUIDE.md) 
- 🚀 [启动脚本指南](./START_PNPM_GUIDE.md)
- 📋 [项目配置说明](./README.md)

## 📊 技术规范 📏

### 🎯 **命名规范**
- **📁 目录**: 小写字母 + 连字符
- **📄 文件**: PascalCase (组件) / camelCase (工具)
- **🎨 样式**: 语义化前缀 (lay-, sp-, interact-)
- **🔧 函数**: camelCase 命名

### 📱 **环境要求**
- **Node.js**: ≥ 18.0.0
- **npm**: ≥ 8.0.0
- **pnpm**: 推荐使用
- **操作系统**: Windows / macOS / Linux

### 🛠️ **开发流程**
1. **🔧 环境检查**: 使用开发工具菜单
2. **📦 依赖安装**: `pnpm install`
3. **🚀 启动开发**: `npm run dev`
4. **🔍 代码检查**: `npm run lint`
5. **🏗️ 构建项目**: `npm run build`

---

**📱 版本**: v1.0.8  
**📅 更新时间**: 2024年9月  
**🎯 文件总数**: 100+ 个文件和目录  
**⭐ 完整度**: 100% 覆盖项目架构 ✨