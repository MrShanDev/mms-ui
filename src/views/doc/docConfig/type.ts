
export declare interface DocDocConfigState {
  tableData: DocDocConfigTableData;
}

declare interface DocDocConfigTableData extends TableType {
  data: DocDocConfigEntity[];
}

/** 文档配置 */
export declare interface DocDocConfigEntity extends BaseEntity {
  [key: string]: any;
}
