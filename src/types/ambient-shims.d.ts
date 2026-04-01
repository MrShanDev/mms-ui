/* 仅模块 shim，无 import/export，避免污染全局类型的可见性 */

declare module 'vue-grid-layout';
declare module 'qrcodejs2-fixes';
declare module 'splitpanes';
declare module 'js-cookie';
declare module '@wangeditor/editor-for-vue';
declare module 'qs';
declare module 'sortablejs';

declare module '*.json';
declare module '*.png';
declare module '*.jpg';
declare module '*.scss';

/** 避免在此文件内 import 'vue'，否则会与 vue 本体类型解析形成环，导致 ref/computed 等全部报缺失 */
declare module '*.vue' {
  const component: any;
  export default component;
}

import '@vue/runtime-core';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $ut: typeof import('/@/utils/mms');
  }
}
