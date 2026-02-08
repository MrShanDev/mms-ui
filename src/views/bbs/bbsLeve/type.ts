import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface BbsLeveVo extends BaseEntity {
      id: string;
      bbsId: string;
      memberId: string;
      type: number;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface BbsLeveBo extends BaseEntity {
        id: string;
        bbsId: string;
        memberId: string;
        type: number;
}
