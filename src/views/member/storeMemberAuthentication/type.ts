import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreMemberAuthenticationVo extends BaseEntity {
      id: string;
      memberId: string;
      name: string;
      number: string;
      phone: string;
      imageFront: string;
      imageBack: string;
      businessLicense: string;
      sex: string;
      address: string;
      nationality: string;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreMemberAuthenticationBo extends BaseEntity {
        id: string;
        memberId: string;
        name: string;
        number: string;
        phone: string;
        imageFront: string;
        imageBack: string;
        businessLicense: string;
        sex: string;
        address: string;
        nationality: string;
}
