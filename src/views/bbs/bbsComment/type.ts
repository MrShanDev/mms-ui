
export declare interface BbsBbsCommentState {
  tableData: BbsBbsCommentTableData;
}

declare interface BbsBbsCommentTableData extends TableType {
  data: BbsBbsCommentEntity[];
}

/** 话题评论 */
export declare interface BbsBbsCommentEntity extends BaseEntity {
  [key: string]: any;
}
