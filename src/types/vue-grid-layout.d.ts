declare module 'vue-grid-layout' {
  import { DefineComponent } from 'vue';

  // 布局项接口定义
  export interface LayoutItem {
    /** 网格项的唯一标识符 */
    i: string;
    /** 网格项的 X 坐标 */
    x: number;
    /** 网格项的 Y 坐标 */
    y: number;
    /** 网格项的宽度 */
    w: number;
    /** 网格项的高度 */
    h: number;
    /** 最小宽度 */
    minW?: number;
    /** 最大宽度 */
    maxW?: number;
    /** 最小高度 */
    minH?: number;
    /** 最大高度 */
    maxH?: number;
    /** 是否静态（不可拖拽和调整大小） */
    static?: boolean;
    /** 是否可拖拽 */
    isDraggable?: boolean;
    /** 是否可调整大小 */
    isResizable?: boolean;
  }

  // 组件Props接口定义
  export interface GridLayoutProps {
    /** 布局配置数组 */
    layout: LayoutItem[];
    /** 列数 */
    colNum?: number;
    /** 行高 */
    rowHeight?: number;
    /** 是否可拖拽 */
    isDraggable?: boolean;
    /** 是否可调整大小 */
    isResizable?: boolean;
    /** 是否镜像布局 */
    isMirrored?: boolean;
    /** 是否自动调整大小 */
    autoSize?: boolean;
    /** 垂直紧凑模式 */
    verticalCompact?: boolean;
    /** 防止碰撞 */
    preventCollision?: boolean;
    /** 间距 */
    margin?: [number, number];
    /** 容器填充 */
    containerPadding?: [number, number];
    /** 使用CSS变换 */
    useCssTransforms?: boolean;
    /** 响应式 */
    responsive?: boolean;
    /** 响应式布局 */
    responsiveLayouts?: Record<string, LayoutItem[]>;
    /** 断点 */
    breakpoints?: Record<string, number>;
    /** 列数映射 */
    cols?: Record<string, number>;
  }

  export interface GridItemProps {
    /** 网格项标识符 */
    i: string;
    /** X 坐标 */
    x: number;
    /** Y 坐标 */
    y: number;
    /** 宽度 */
    w: number;
    /** 高度 */
    h: number;
    /** 最小宽度 */
    minW?: number;
    /** 最大宽度 */
    maxW?: number;
    /** 最小高度 */
    minH?: number;
    /** 最大高度 */
    maxH?: number;
    /** 是否静态 */
    static?: boolean;
    /** 是否可拖拽 */
    isDraggable?: boolean;
    /** 是否可调整大小 */
    isResizable?: boolean;
    /** 拖拽手柄选择器 */
    dragAllowFrom?: string;
    /** 拖拽忽略选择器 */
    dragIgnoreFrom?: string;
    /** 调整大小手柄选择器 */
    resizeIgnoreFrom?: string;
    /** 保持宽高比 */
    preserveAspectRatio?: boolean;
  }

  // Vue 3 组件定义
  export const GridLayout: DefineComponent<GridLayoutProps>;
  export const GridItem: DefineComponent<GridItemProps>;

  // 事件回调类型
  export type LayoutUpdatedCallback = (layout: LayoutItem[]) => void;
  export type BreakpointChangedCallback = (newBreakpoint: string, newLayout: LayoutItem[]) => void;
  export type ItemCallback = (layout: LayoutItem[], oldItem: LayoutItem, newItem: LayoutItem, placeholder: LayoutItem, event: MouseEvent, element: HTMLElement) => void;

  // 导出所有类型
  export {
    GridLayout,
    GridItem,
    LayoutItem,
    GridLayoutProps,
    GridItemProps,
    LayoutUpdatedCallback,
    BreakpointChangedCallback,
    ItemCallback
  };
}
