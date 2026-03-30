import { createI18n } from 'vue-i18n';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';

// 定义语言国际化内容

/**
 * 说明：
 * 须在 pages 下新建文件夹（建议 `要国际化界面目录` 与 `i18n 目录` 相同，方便查找），
 * 注意国际化定义的字段，不要与原有的定义字段相同。
 * 1、/src/i18n/lang 下的 ts 为框架的国际化内容
 * 2、/src/i18n/pages 下的各界面的国际化内容
 */

// element plus 自带国际化
import enLocale from 'element-plus/es/locale/lang/en';
import zhtwLocale from 'element-plus/es/locale/lang/zh-tw';
import zhcnLocale from 'element-plus/es/locale/lang/zh-cn';

type LangKey = 'en' | 'zh-cn' | 'zh-tw';

const element: Record<LangKey, typeof enLocale> = {
  en: enLocale,
  'zh-cn': zhcnLocale,
  'zh-tw': zhtwLocale,
};

const itemize: Record<LangKey, unknown[]> = {
  en: [],
  'zh-cn': [],
  'zh-tw': [],
};

const modules: Record<string, { default?: Record<string, unknown> }> = import.meta.glob(
  './**/*.ts',
  { eager: true }
);

for (const path in modules) {
  const key = path.match(/(\S+)\/(\S+)\.ts$/);
  if (!key) continue;
  const langKey = key[2] as LangKey;
  if (langKey in itemize) {
    const def = modules[path].default;
    if (def) itemize[langKey].push(def);
  }
}

function mergeArrObj(list: Record<LangKey, unknown[]>, key: LangKey): Record<string, unknown> {
  let obj: Record<string, unknown> = {};
  for (const i of list[key] ?? []) {
    if (i && typeof i === 'object') obj = Object.assign({}, obj, i as object);
  }
  return obj;
}

const messages: Record<
  string,
  { name: string; el: (typeof enLocale)['el']; message: Record<string, unknown> }
> = {};

for (const key of Object.keys(itemize) as LangKey[]) {
  messages[key] = {
    name: key,
    el: element[key].el,
    message: mergeArrObj(itemize, key),
  };
}

// 读取 pinia 默认语言
const stores = useThemeConfig(pinia);
const { themeConfig } = storeToRefs(stores);

// 导出语言国际化
// https://vue-i18n.intlify.dev/guide/essentials/fallback.html#explicit-fallback-with-one-locale
export const i18n = createI18n({
  legacy: false,
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
  fallbackWarn: false,
  locale: themeConfig.value.globalI18n,
  fallbackLocale: zhcnLocale.name,
  messages: messages as any,
});
