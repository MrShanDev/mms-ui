import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface StoreMemberVo extends BaseEntity {
      id: string;
      nickname: string;
      account: string;
      sex: number;
      phone: string;
      password: string;
      headPortrait: string;
      birthday: string;
      reputationScore: number;
      invitationCode: string;
      level: number;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface StoreMemberBo extends BaseEntity {
        id: string;
        nickname: string;
        account: string;
        sex: number;
        phone: string;
        password: string;
        headPortrait: string;
        birthday: string;
        reputationScore: number;
        invitationCode: string;
}
