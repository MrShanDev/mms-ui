/**
 * 对象实体Vo
 * @extends {BaseEntity}
 */
export declare interface SysLogVo extends BaseEntity {
  operId: string;
  module: string;
  operType: number;
  description: string;
  requestMethod: string;
  method: string;
  operUrl: string;
  userId: string;
  userName: string;
  userRoles: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  beforeData: string;
  jsonResult: string;
  errorMsg: string;
  operTime: string;
  costTime: string;
  userAgent: string;
  browser: string;
  os: string;
}

/**
 * 对象实体Bo
 * @extends {BaseEntity}
 */
export declare interface SysLogBo extends BaseEntity {
  operId: string;
  module: string;
  operType: number;
  description: string;
  requestMethod: string;
  method: string;
  operUrl: string;
  userId: string;
  userName: string;
  userRoles: string;
  operIp: string;
  operLocation: string;
  operParam: string;
  beforeData: string;
  jsonResult: string;
  errorMsg: string;
  operTime: string;
  costTime: string;
  userAgent: string;
  browser: string;
  os: string;
}
