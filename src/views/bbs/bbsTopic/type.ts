import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface BbsTopicVo extends BaseEntity {
      id: string;
      memberId: string;
      cateId: string;
      title: string;
      contentHtml: string;
      memberNickName?: string;
      memberHeadImg?: string;
      commentCount?: number;
      likeCount?: number;
      favoriteCount?: number;
      attentionCount?: number;
      files?: any[];
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface BbsTopicBo extends BaseEntity {
        id: string;
        memberId: string;
        cateId: string;
        title: string;
        contentHtml: string;
        files?: any[];
}
