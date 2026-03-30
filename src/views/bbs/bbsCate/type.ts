
export declare interface BbsBbsCateState {
  tableData: BbsBbsCateTableData;
}

declare interface BbsBbsCateTableData extends TableType {
  data: BbsBbsCateEntity[];
}

/** 话题分类 */
export declare interface BbsBbsCateEntity extends BaseEntity {
  [key: string]: any;
}
