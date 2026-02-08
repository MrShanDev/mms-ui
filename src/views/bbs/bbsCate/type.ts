import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface BbsCateVo extends BaseEntity {
      id: string;
      fatherId: string;
      name: string;
      icon: string;
      ids:string;
      children: BbsCateVo[];
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface BbsCateBo extends BaseEntity {
        id: string;
        fatherId: string;
        name: string;
        icon: string;
    ids:string;
    children: BbsCateVo[];
}
