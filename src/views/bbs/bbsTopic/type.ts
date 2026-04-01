
export declare interface BbsBbsTopicState {
  tableData: BbsBbsTopicTableData;
}

declare interface BbsBbsTopicTableData extends TableType {
  data: BbsBbsTopicEntity[];
}

/** 话题 */
export declare interface BbsBbsTopicEntity extends BaseEntity {
  [key: string]: any;
}
