/** 省市区树节点（与 city 组件约定一致） */
export interface SysAreaVo {
  code: string;
  name: string;
  children?: SysAreaVo[];
}

export interface SysAreaBo {
  parentCode?: string;
}
