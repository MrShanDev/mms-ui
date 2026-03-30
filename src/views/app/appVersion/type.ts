
export declare interface AppAppVersionState {
  tableData: AppAppVersionTableData;
}

declare interface AppAppVersionTableData extends TableType {
  data: AppAppVersionEntity[];
}

/** App版本发布表 */
export declare interface AppAppVersionEntity extends BaseEntity {
  [key: string]: any;
}
