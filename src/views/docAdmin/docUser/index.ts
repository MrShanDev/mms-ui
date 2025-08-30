import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';
import { DocUserBo, DocUserVo, DocUserTable } from './type';
/**
 * 文档用户-Api
 * DocUser
 */
export function docUserApi() {
  return {
    list: (params?: object): AxiosPromise<DocUserVo[]> => {
      return request({
        url: getEnv() + '/docAdmin/docUser/list',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    edit: (params?: DocUserBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docUser',
        method: 'put',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    query: (id?: number | string): AxiosPromise<DocUserVo> => {
      return request({
        url: getEnv() + '/docAdmin/docUser/' + id,
        method: 'get',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    insert: (params?: DocUserBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docUser',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    delete: (id?: number | string): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docUser/' + id,
        method: 'delete',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
  };
}
