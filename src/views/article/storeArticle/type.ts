import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreArticleVo extends BaseEntity {
      id: string;
      title: string;
      coverImg: string;
      tag: string;
      author: string;
      articleCateId: string;
      content: string;
      memberId: string
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreArticleBo extends BaseEntity {
        id: string;
        title: string;
        coverImg: string;
        tag: string;
        author: string;
        articleCateId: string;
        content: string;
        memberId: string
}
