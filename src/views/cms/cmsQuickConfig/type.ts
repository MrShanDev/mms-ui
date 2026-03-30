
export declare interface CmsCmsQuickConfigState {
  tableData: CmsCmsQuickConfigTableData;
}

declare interface CmsCmsQuickConfigTableData extends TableType {
  data: CmsCmsQuickConfigEntity[];
}

/** 快捷入口配置表 */
export declare interface CmsCmsQuickConfigEntity extends BaseEntity {
  [key: string]: any;
}
