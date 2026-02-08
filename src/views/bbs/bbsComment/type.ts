import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface BbsCommentVo extends BaseEntity {
      id: string;
      fatherId: string;
      bbsId: string;
      level: number;
      memberId: string;
      comment: string;
      memberNickName?: string;
      memberHeadImg?: string;
      likeCount?: number;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface BbsCommentBo extends BaseEntity {
        id: string;
        fatherId: string;
        bbsId: string;
        level: number;
        memberId: string;
        comment: string;
}
