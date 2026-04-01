
export declare interface CmsCmsSearchHotTagState {
  tableData: CmsCmsSearchHotTagTableData;
}

declare interface CmsCmsSearchHotTagTableData extends TableType {
  data: CmsCmsSearchHotTagEntity[];
}

/** 热门搜索标签表 */
export declare interface CmsCmsSearchHotTagEntity extends BaseEntity {
  [key: string]: any;
}
