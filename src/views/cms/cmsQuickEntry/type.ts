
export declare interface CmsCmsQuickEntryState {
  tableData: CmsCmsQuickEntryTableData;
}

declare interface CmsCmsQuickEntryTableData extends TableType {
  data: CmsCmsQuickEntryEntity[];
}

/** 快捷入口 */
export declare interface CmsCmsQuickEntryEntity extends BaseEntity {
  [key: string]: any;
}
