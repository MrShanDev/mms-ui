import { defineStore } from 'pinia';

/**
 * 布局配置
 * 修改配置时：
 * 1、需要每次都清理 `window.localStorage` 浏览器永久缓存
 * 2、或者点击布局配置最底部 `一键恢复默认` 按钮即可看到效果
 */
export const useThemeConfig = defineStore('themeConfig', {
  state: (): ThemeConfigState => ({
    themeConfig: {
      // 是否开启布局配置抽屉
      isDrawer: false,
      dashboardScene: 'base',

      /**
       * 全局主题
       */
      // 默认 primary 主题颜色（与布局默认配色一致）
      primary: '#1890FF',
      // 是否开启深色模式
      isIsDark: false,

      /**
       * 顶栏设置
       */
      // 默认顶栏导航背景颜色
      topBar: '#ffffff',
      // 默认顶栏导航字体颜色
      topBarColor: '#4f4f4f',
      // 是否开启顶栏背景颜色渐变
      isTopBarColorGradual: false,

      /**
       * 菜单设置
       */
      // 默认菜单导航背景颜色
      menuBar: '#ffffff',
      // 默认菜单导航字体颜色（与主题一 / blueWhite 预设一致）
      menuBarColor: '#4d4d4d',
      // 默认菜单高亮背景色（白底侧栏上用淡主色底）
      menuBarActiveColor: 'rgba(24, 144, 255, 0.12)',
      // 是否开启菜单背景颜色渐变
      isMenuBarColorGradual: false,

      /**
       * 分栏设置
       */
      // 默认分栏菜单背景颜色
      columnsMenuBar: '#ffffff',
      // 默认分栏菜单字体颜色
      columnsMenuBarColor: '#4d4d4d',
      // 是否开启分栏菜单背景颜色渐变
      isColumnsMenuBarColorGradual: false,
      // 是否开启分栏菜单鼠标悬停预加载(预览菜单)
      isColumnsMenuHoverPreload: false,

      /**
       * 界面设置
       */
      // 是否开启菜单水平折叠效果
      isCollapse: false,
      // 是否开启菜单手风琴效果
      isUniqueOpened: true,
      // 是否开启固定 Header
      isFixedHeader: false,
      // 初始化变量，用于更新菜单 el-scrollbar 的高度，请勿删除
      isFixedHeaderChange: false,
      // 是否开启经典布局分割菜单（仅经典布局生效）
      isClassicSplitMenu: false,
      // 是否开启自动锁屏
      isLockScreen: false,
      // 开启自动锁屏倒计时(s/秒)
      lockScreenTime: 30,

      /**
       * 界面显示
       */
      // 是否开启侧边栏 Logo
      isShowLogo: true,
      // 初始化变量，用于 el-scrollbar 的高度更新，请勿删除
      isShowLogoChange: false,
      // Logo 区背景（侧栏顶部 Logo 条、经典/横向顶栏内 Logo 条），对应 CSS --next-bg-logoBar
      logoBar: '#1890FF',
      // Logo 区标题字色，空则同顶栏字色（--next-bg-topBarColor）
      logoBarColor: '#ffffff',
      // 是否开启 Breadcrumb，强制经典、横向布局不显示
      isBreadcrumb: false,
      // 是否开启 Tagsview
      isTagsview: false,
      // 是否开启 Breadcrumb 图标
      isBreadcrumbIcon: false,
      // 是否开启 Tagsview 图标
      isTagsviewIcon: false,
      // 是否开启 TagsView 缓存
      isCacheTagsView: false,
      // 是否开启 TagsView 拖拽
      isSortableTagsView: true,
      // 是否开启 TagsView 共用
      isShareTagsView: false,
      // 是否开启 Footer 底部版权信息
      isFooter: true,
      // 是否开启灰色模式
      isGrayscale: false,
      // 是否开启色弱模式
      isInvert: false,
      // 是否开启水印
      isWartermark: false,
      // 水印文案
      wartermarkText: 'mmsAdmin',

      /**
       * 其它设置
       */
      // Tagsview 风格：可选值"<tags-style-one|tags-style-four|tags-style-five>"，默认 tags-style-five
      // 定义的值与 `/src/layout/navBars/tagsView/tagsView.vue` 中的 class 同名
      tagsStyle: 'tags-style-four',
      // 主页面切换动画：可选值"<none|slide-right|slide-left|opacitys>"；none 映射 transition name router-none，默认 slide-right
      animation: 'slide-right',
      // 分栏高亮风格：可选值"<columns-round|columns-card>"，默认 columns-round
      columnsAsideStyle: 'columns-round',
      // 分栏布局风格：可选值"<columns-horizontal|columns-vertical>"，默认 columns-horizontal
      columnsAsideLayout: 'columns-vertical',

      /**
       * 布局切换
       * 注意：为了演示，切换布局时，颜色会被还原成默认，代码位置：/@/layout/navBars/topBar/setings.vue
       * 中的 `initSetLayoutChange(设置布局切换，重置主题样式)` 方法
       */
      // 布局切换：可选值"<defaults|classic|transverse|columns>"，默认 defaults
      layout: 'defaults',

      /**
       * 后端控制路由
       */
      // 是否开启后端控制路由
      isRequestRoutes: true,

      /**
       * 全局网站标题 / 副标题
       */
      // 网站主标题（菜单导航、浏览器当前网页标题）；默认与产品约定文案一致，仍可由 env 覆盖构建
      globalTitle: import.meta.env.VITE_APP_TITLE || '模块化管理系统',
      globalViceTitle:
        import.meta.env.VITE_APP_VICE_TITLE ||
        '模块化管理系统（Modular management system），简称：MMS。',
      // 登录页等长说明
      globalViceTitleMsg:
        import.meta.env.VITE_APP_VICE_TITLE_MSG ||
        'MMS（模块化管理系统，Modular Management System）基于Spring Boot 3.x构建，采用前后端分离的现代化架构设计。该系统集成了用户管理、商品管理、支付系统、订单处理、分销体系、日志监控、定时任务、通信服务、直播支持、广告管理与内容发布等多个功能模块，致力于为开发者提供高效、稳定且可扩展的开发脚手架，显著提升项目开发效率，助力各类应用快速落地与迭代。!',
      // 默认初始语言，可选值"<zh-cn|en|zh-tw>"，默认 zh-cn
      globalI18n: 'zh-cn',
      // 默认全局组件大小，可选值"<large|'default'|small>"，默认 'large'
      globalComponentSize: 'large',
    },
  }),
  actions: {
    setThemeConfig(data: ThemeConfigState) {
      // 与本地缓存合并，避免新增字段缺失导致 undefined
      this.themeConfig = { ...this.themeConfig, ...data.themeConfig };
    },
  },
});
