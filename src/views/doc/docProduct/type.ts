
export declare interface DocDocProductState {
  tableData: DocDocProductTableData;
}

declare interface DocDocProductTableData extends TableType {
  data: DocDocProductEntity[];
}

/** 文档商品 */
export declare interface DocDocProductEntity extends BaseEntity {
  [key: string]: any;
}
