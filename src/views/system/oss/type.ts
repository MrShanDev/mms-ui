export declare interface SysOssState {
  tableData: SysOssTableType;
}
export interface SysOssTableType extends TableType {
  data: RowOssType[];
}
export declare interface RowOssType extends BaseEntity {
  ossId: string; // 主键
  fileName: string;
  originalName: string;
  fileSuffix: string;
  url: string;
  contentType: string;
  basePath: string;
  platform: string;
}

export declare interface SysOssConfigBo extends BaseEntity {
  id: string;
  configKey: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  prefix: string;
  endpoint: string;
  domain: string;
  isHttps: string;
  region: string;
  accessPolicy: string;
  ext1: string;
}
