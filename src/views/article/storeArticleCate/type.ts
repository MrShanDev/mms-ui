
export declare interface ArticleStoreArticleCateState {
  tableData: ArticleStoreArticleCateTableData;
}

declare interface ArticleStoreArticleCateTableData extends TableType {
  data: ArticleStoreArticleCateEntity[];
}

/** 店铺文章分类 */
export declare interface ArticleStoreArticleCateEntity extends BaseEntity {
  [key: string]: any;
}
