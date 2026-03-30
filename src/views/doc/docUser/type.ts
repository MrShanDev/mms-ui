
export declare interface DocDocUserState {
  tableData: DocDocUserTableData;
}

declare interface DocDocUserTableData extends TableType {
  data: DocDocUserEntity[];
}

/** 文档用户 */
export declare interface DocDocUserEntity extends BaseEntity {
  [key: string]: any;
}
