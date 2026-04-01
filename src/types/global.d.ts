/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 全局类型：须使用 export {} 使本文件成为 module，并在 declare global 内声明，
 * 否则顶层 import 会导致 RouteItem 等无法在 .vue 中作为全局名解析。
 */
export {};

declare global {
  interface Window {
    nextLoading: boolean;
    BMAP_SATELLITE_MAP: any;
    BMap: any;
  }

  type R<T = any> = {
    code: number;
    msg: string;
    data: T;
    state: boolean;
  };

  /** 系统启动基础信息（/common/startBase） */
  interface SystemBaseEntity {
    [key: string]: unknown;
  }

  type RouteItem<T = any> = {
    path: string;
    name?: string | symbol | undefined | null;
    redirect?: string;
    k?: T;
    meta?: {
      title?: string;
      isLink?: string;
      isHide?: boolean;
      isKeepAlive?: boolean;
      isAffix?: boolean;
      isIframe?: boolean;
      roles?: string[];
      icon?: string;
      isDynamic?: boolean;
      isDynamicPath?: string;
      isIframeOpen?: string;
      loading?: boolean;
    };
    children: T[];
    query?: { [key: string]: T };
    params?: { [key: string]: T };
    contextMenuClickId?: string | number;
    commonUrl?: string;
    isFnClick?: boolean;
    url?: string;
    transUrl?: string;
    title?: string;
    id?: string | number;
  };

  interface RouteToFrom<T = any> extends RouteItem {
    path?: string;
    children?: T[];
  }

  type RouteItems<T extends RouteItem = any> = T[];

  type RefType<T = any> = T | null;

  type HtmlType = HTMLElement | string | undefined | null;

  type ChilType<T = any> = {
    children?: T[];
  };

  type EmptyArrayType<T = any> = T[];

  type EmptyObjectType<T = any> = {
    [key: string]: T;
  };

  type SelectOptionType = {
    value: string | number;
    label: string | number;
  };

  interface WheelEventType extends WheelEvent {
    wheelDelta: number;
  }

  interface TableType<T = any> {
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      [key: string]: T;
    };
  }

  /** 表单校验：避免 global.d.ts 顶层 import element-plus 导致失去全局作用域 */
  interface VerifyType<T = any> {
    dialog?: boolean;
    key?: string;
    title?: string;
    form: T;
    rules: any;
  }

  interface BaseEntity<T = any> {
    status: number;
    sort: number;
    remark: string;
    tenantId?: string;
    revision?: number;
    createdBy?: string;
    createdTime?: T;
    updatedBy?: string;
    updatedTime?: T;
    [key: string]: T;
  }

  interface ApiSecurityParam {
    appId: string;
    key: string;
    data: EmptyObjectType;
    sign: string;
    timestamp: number;
    nonce: string;
  }
}
