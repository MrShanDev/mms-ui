import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreArticleCateVo extends BaseEntity {
      id: string;
      parentId: string;
      cateName: string;
      level: number;
      icon: string;
      ids:string;
      children: StoreArticleCateVo[];
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreArticleCateBo extends BaseEntity {
        id: string;
        parentId: string;
        cateName: string;
        level: number;
        icon: string;
    ids:string;
    children: StoreArticleCateVo[];
}
