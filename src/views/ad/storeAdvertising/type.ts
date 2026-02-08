import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreAdvertisingVo extends BaseEntity {
      id: string;
      advertisingId: string;
      startTime: string;
      endTime: string;
      routeUrl: string;
      routeParameter: string;
      imageUrl: string;
      extendedParameterOne: string;
      extendedParameterTwo: string;
      extendedParameterThree: string;
      extendedParameterFour: string;
      extendedParameterFive: string;
      pushIndex: number;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreAdvertisingBo extends BaseEntity {
        id: string;
        advertisingId: string;
        startTime: string;
        endTime: string;
        routeUrl: string;
        routeParameter: string;
        imageUrl: string;
        extendedParameterOne: string;
        extendedParameterTwo: string;
        extendedParameterThree: string;
        extendedParameterFour: string;
        extendedParameterFive: string;
        pushIndex: number;
}
