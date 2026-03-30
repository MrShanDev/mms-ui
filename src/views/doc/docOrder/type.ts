
export declare interface DocDocOrderState {
  tableData: DocDocOrderTableData;
}

declare interface DocDocOrderTableData extends TableType {
  data: DocDocOrderEntity[];
}

/** 文档订单 */
export declare interface DocDocOrderEntity extends BaseEntity {
  [key: string]: any;
}
