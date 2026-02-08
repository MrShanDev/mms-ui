import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreAdvertisingLocationVo extends BaseEntity {
      id: string;
      name: string;
      height: string;
      width: string;
      code: string;
      maxNum: number;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreAdvertisingLocationBo extends BaseEntity {
        id: string;
        name: string;
        height: string;
        width: string;
        code: string;
        maxNum: number;
}
