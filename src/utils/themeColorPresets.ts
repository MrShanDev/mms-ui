/**
 * 布局配置「配色快捷方案」
 * 与 `stores/themeConfig`、`setings.vue` 中 onBgColorPickerChange / onColorPickerChange 写入的字段一致。
 */
import { useChangeColor } from '/@/utils/theme';

const { getLightColor } = useChangeColor();

export type ThemeColorPresetId = 'blueWhite' | 'orangeWhite' | 'navyWhite' | 'purpleWhite';

/** 仅覆盖与配色相关的 themeConfig 字段（其余布局项保持用户当前选择） */
export type ThemeColorPresetPatch = Partial<{
  primary: string;
  topBar: string;
  topBarColor: string;
  menuBar: string;
  menuBarColor: string;
  menuBarActiveColor: string;
  logoBar: string;
  /** 空字符串表示沿用顶栏字色（--next-bg-topBarColor） */
  logoBarColor: string;
  columnsMenuBar: string;
  columnsMenuBarColor: string;
  isTopBarColorGradual: boolean;
  isMenuBarColorGradual: boolean;
  isColumnsMenuBarColorGradual: boolean;
  isIsDark: boolean;
}>;

export const THEME_COLOR_PRESET_PATCHES: Record<ThemeColorPresetId, ThemeColorPresetPatch> = {
  /**
   * 主题一 / 蓝 + 白：主色 Ant Design 蓝；侧栏菜单白底 #4d4d4d 字（无渐变）；
   * Logo 条品牌蓝 + 白字；顶栏白底灰字。
   */
  blueWhite: {
    primary: '#1890FF',
    topBar: '#ffffff',
    topBarColor: '#595959',
    menuBar: '#ffffff',
    menuBarColor: '#4d4d4d',
    menuBarActiveColor: 'rgba(24, 144, 255, 0.12)',
    logoBar: '#1890FF',
    logoBarColor: '#ffffff',
    columnsMenuBar: '#ffffff',
    columnsMenuBarColor: '#4d4d4d',
    isTopBarColorGradual: false,
    isMenuBarColorGradual: false,
    isColumnsMenuBarColorGradual: false,
    isIsDark: false,
  },
  /**
   * 主题二 / 橙白活力：与产品约定 JSON 一致（主色 #FA541C、顶栏字/Logo 标题 #fa8c16、
   * 侧栏菜单 #ffa74a 白字 + 纵向渐变、分栏 #D46B08、高亮半透白底）。
   */
  orangeWhite: {
    primary: '#FA541C',
    topBar: '#ffffff',
    topBarColor: '#fa8c16',
    menuBar: '#ffa74a',
    menuBarColor: '#ffffff',
    menuBarActiveColor: 'rgba(255, 255, 255, 0.72)',
    logoBar: '#ffffff',
    logoBarColor: '#fa8c16',
    columnsMenuBar: '#D46B08',
    columnsMenuBarColor: '#ffffff',
    isTopBarColorGradual: false,
    isMenuBarColorGradual: true,
    isColumnsMenuBarColorGradual: true,
    isIsDark: false,
  },
  /**
   * 主题三 / 深蓝灰侧栏：主色 #261c1f；侧栏 #373e5d 浅字（无渐变）；分栏 #12151F；
   * 高亮 rgba(209,189,196,0.42)。
   */
  navyWhite: {
    primary: '#261c1f',
    topBar: '#ffffff',
    topBarColor: '#303133',
    menuBar: '#373e5d',
    menuBarColor: '#F5F5F7',
    menuBarActiveColor: 'rgba(209, 189, 196, 0.42)',
    logoBar: '#373e5d',
    logoBarColor: '#F5F5F7',
    columnsMenuBar: '#12151F',
    columnsMenuBarColor: '#E8E8ED',
    isTopBarColorGradual: false,
    isMenuBarColorGradual: false,
    isColumnsMenuBarColorGradual: false,
    isIsDark: false,
  },
  /**
   * 主题四 / 紫白：侧栏 #7B61FF 白字 + 纵向渐变、高亮 rgba(52,26,189,0.67)、分栏 #6848E8。
   */
  purpleWhite: {
    primary: '#7B61FF',
    topBar: '#ffffff',
    topBarColor: '#303133',
    menuBar: '#7B61FF',
    menuBarColor: '#ffffff',
    menuBarActiveColor: 'rgba(52, 26, 189, 0.67)',
    logoBar: '#7B61FF',
    logoBarColor: '#ffffff',
    columnsMenuBar: '#6848E8',
    columnsMenuBarColor: '#ffffff',
    isTopBarColorGradual: false,
    isMenuBarColorGradual: true,
    isColumnsMenuBarColorGradual: false,
    isIsDark: false,
  },
};

/** 与 setings.vue `setGraduaFun` 一致：menuBar → 变浅 0.5 的纵向渐变 */
function presetMenuBarGridBackground(id: ThemeColorPresetId): string {
  const p = THEME_COLOR_PRESET_PATCHES[id];
  if (!p.isMenuBarColorGradual) return p.menuBar;
  const lighter = getLightColor(p.menuBar, 0.5);
  return lighter ? `linear-gradient(to bottom, ${p.menuBar}, ${lighter})` : p.menuBar;
}

/**
 * 布局抽屉「配色快捷方案」四宫格预览：开启菜单渐变时与运行时侧栏渐变一致。
 */
export const THEME_COLOR_PRESET_GRID_SWATCH: Record<
  ThemeColorPresetId,
  { background: string; color: string }
> = {
  blueWhite: {
    background: presetMenuBarGridBackground('blueWhite'),
    color: THEME_COLOR_PRESET_PATCHES.blueWhite.menuBarColor,
  },
  orangeWhite: {
    background: presetMenuBarGridBackground('orangeWhite'),
    color: THEME_COLOR_PRESET_PATCHES.orangeWhite.menuBarColor,
  },
  navyWhite: {
    background: presetMenuBarGridBackground('navyWhite'),
    color: THEME_COLOR_PRESET_PATCHES.navyWhite.menuBarColor,
  },
  purpleWhite: {
    background: presetMenuBarGridBackground('purpleWhite'),
    color: THEME_COLOR_PRESET_PATCHES.purpleWhite.menuBarColor,
  },
};
