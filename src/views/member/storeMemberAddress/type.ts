import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreMemberAddressVo extends BaseEntity {
      id: string; 
      memberId: string; 
      name: string; 
      phone: string; 
      country: string; 
      province: string; 
      city: string; 
      district: string; 
      address: string; 
      isDef: string; 
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreMemberAddressBo extends BaseEntity {
        id: string; 
        memberId: string; 
        name: string; 
        phone: string; 
        country: string; 
        province: string; 
        city: string; 
        district: string; 
        address: string; 
        isDef: string; 
}
