import { BaseEntity } from '/@/types/global';

/**
 * 对象实体Vo
 * @extends {BaseEntity}
 */
export declare interface DocOrderVo extends BaseEntity {
  orderId: string | number;
  uid: string | number;
  txnAmt: string | number;
  payMchid: string | number;
  payNo: string | number;
  payTimeout: string | number;
  prodId: string | number;
  prodName: string | number;
  prodPrice: string | number;
  prodType: string | number;
  ctime: string | number;
  mtime: string | number;
}

/**
 * 对象实体Bo
 * @extends {BaseEntity}
 */
export declare interface DocOrderBo extends BaseEntity {
  orderId: string | number;
  uid: string | number;
  txnAmt: string | number;
  payMchid: string | number;
  payNo: string | number;
  payTimeout: string | number;
  prodId: string | number;
  prodName: string | number;
  prodPrice: string | number;
  prodType: string | number;
  ctime: string | number;
  mtime: string | number;
}
