
export declare interface CmsCmsSearchHistoryState {
  tableData: CmsCmsSearchHistoryTableData;
}

declare interface CmsCmsSearchHistoryTableData extends TableType {
  data: CmsCmsSearchHistoryEntity[];
}

/** 搜索历史 */
export declare interface CmsCmsSearchHistoryEntity extends BaseEntity {
  [key: string]: any;
}
