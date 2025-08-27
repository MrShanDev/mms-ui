import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface DocUserVo extends BaseEntity {
      uid: string|number; 
      nickname: string|number; 
      avatar: string|number; 
      type: string|number; 
      ctime: string|number; 
      mtime: string|number;
      vipDate:string;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface DocUserBo extends BaseEntity {
        uid: string|number; 
        nickname: string|number; 
        avatar: string|number; 
        type: string|number; 
        ctime: string|number; 
        mtime: string|number;
        vipDate:string;
}
