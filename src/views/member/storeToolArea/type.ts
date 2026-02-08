import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreToolAreaVo extends BaseEntity {
      id: string;
      name: string;
      code: string;
      parentCode: string;
      level: string;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreToolAreaBo extends BaseEntity {
        id: string;
        name: string;
        code: string;
        parentCode: string;
        level: string;
}
