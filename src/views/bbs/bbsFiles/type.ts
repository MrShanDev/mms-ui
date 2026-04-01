
export declare interface BbsBbsFilesState {
  tableData: BbsBbsFilesTableData;
}

declare interface BbsBbsFilesTableData extends TableType {
  data: BbsBbsFilesEntity[];
}

/** 话题附件 */
export declare interface BbsBbsFilesEntity extends BaseEntity {
  [key: string]: any;
}
