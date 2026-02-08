import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface BbsFilesVo extends BaseEntity {
      id: string;
      bbsId: string;
      type: string;
      height: number;
      width: number;
      size: number;
      url: string;
      fileUrl?: string;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface BbsFilesBo extends BaseEntity {
        id: string;
        bbsId: string;
        type: string;
        height: number;
        width: number;
        size: number;
        url: string;
}
