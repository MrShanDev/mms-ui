// role

export declare interface SysRoleState {
  tableData: SysRoleTableType;
}
export interface SysRoleTableType extends TableType {
  data: RowRoleType[];
}
export declare interface RowRoleType extends BaseEntity {
  id: string;
  name: string;
  code: string;
  sort: number;
  level: number;
  type: string;
  remark: string;
  defChecked: [];
}
