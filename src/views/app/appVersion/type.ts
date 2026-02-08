import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface AppVersionVo extends BaseEntity {
      id: string;
      appCode: string;
      appName: string;
      platform: string;
      versionCode: string;
      versionName: string;
      buildNumber: string;
      downloadUrl: string;
      fileSize: string;
      fileMd5: string;
      releaseNotes: string;
      isForceUpdate: number;
      minRequiredVersion: string;
      publishType: string;
      publishStatus: string;
      publishTime: string;
      publishUser: string;
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface AppVersionBo extends BaseEntity {
        id: string;
        appCode: string;
        appName: string;
        platform: string;
        versionCode: string;
        versionName: string;
        buildNumber: string;
        downloadUrl: string;
        fileSize: string;
        fileMd5: string;
        releaseNotes: string;
        isForceUpdate: number;
        minRequiredVersion: string;
        publishType: string;
        publishStatus: string;
        publishTime: string;
        publishUser: string;
}
