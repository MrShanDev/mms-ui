
export declare interface BbsBbsLeveState {
  tableData: BbsBbsLeveTableData;
}

declare interface BbsBbsLeveTableData extends TableType {
  data: BbsBbsLeveEntity[];
}

/** 话题操作 */
export declare interface BbsBbsLeveEntity extends BaseEntity {
  [key: string]: any;
}
