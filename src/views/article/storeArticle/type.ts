
export declare interface ArticleStoreArticleState {
  tableData: ArticleStoreArticleTableData;
}

declare interface ArticleStoreArticleTableData extends TableType {
  data: ArticleStoreArticleEntity[];
}

/** 店铺文章 */
export declare interface ArticleStoreArticleEntity extends BaseEntity {
  [key: string]: any;
}
