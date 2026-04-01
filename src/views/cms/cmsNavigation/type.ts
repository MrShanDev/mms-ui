
export declare interface CmsCmsNavigationState {
  tableData: CmsCmsNavigationTableData;
}

declare interface CmsCmsNavigationTableData extends TableType {
  data: CmsCmsNavigationEntity[];
}

/** 网站导航菜单表 */
export declare interface CmsCmsNavigationEntity extends BaseEntity {
  [key: string]: any;
}
