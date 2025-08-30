import { BaseEntity } from '/@/types/global';

/**
 * 对象实体Vo
 * @extends {BaseEntity}
 */
export declare interface DocAuthorizeUserVo extends BaseEntity {
  id: string | number;
  uid: string | number;
  chan: string | number;
  appid: string | number;
  openid: string | number;
  ctime: string | number;
  mtime: string | number;
}

/**
 * 对象实体Bo
 * @extends {BaseEntity}
 */
export declare interface DocAuthorizeUserBo extends BaseEntity {
  id: string | number;
  uid: string | number;
  chan: string | number;
  appid: string | number;
  openid: string | number;
  ctime: string | number;
  mtime: string | number;
}
