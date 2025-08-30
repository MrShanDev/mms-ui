import { BaseEntity } from '/@/types/global';

/**
 * 对象实体Vo
 * @extends {BaseEntity}
 */
export declare interface DocConfigVo extends BaseEntity {
  id: string | number;
  key: string | number;
  value: string | number;
  ctime: string | number;
  mtime: string | number;
}

/**
 * 对象实体Bo
 * @extends {BaseEntity}
 */
export declare interface DocConfigBo extends BaseEntity {
  id: string | number;
  key: string | number;
  value: string | number;
  ctime: string | number;
  mtime: string | number;
}
