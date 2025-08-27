import { BaseEntity } from '/@/types/global';

/**
 * 对象实体Vo
 * @extends {BaseEntity}
 */
export declare interface DocProductVo extends BaseEntity {
  prodId: string | number;
  prodName: string;
  unitPrice: number;
  markPrice: number;
  type: string | number;
  ctime: string | number;
  mtime: string | number;
}

/**
 * 对象实体Bo
 * @extends {BaseEntity}
 */
export declare interface DocProductBo extends BaseEntity {
  prodId: string | number;
  prodName: string | number;
  unitPrice: string | number;
  markPrice: string | number;
  type: string | number;
  ctime: string | number;
  mtime: string | number;
}
