import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';
import type { SysAreaVo } from './type';

/**
 * 区域树（省市区），后端路径可按项目实际调整。
 * 约定：GET/POST 返回 R，业务数据在 data，为 SysAreaVo[]。
 */
export function sysAreaApi() {
  return {
    list: <T = SysAreaVo[]>(): AxiosPromise<{ data: T }> => {
      return request({
        url: getEnv() + '/system/area/list',
        method: 'get',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
  };
}
