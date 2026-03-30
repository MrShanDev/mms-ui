import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';

/**
 * 话题评论 — Api（bbs/bbsComment）
 */
export function bbsBbsCommentApi() {
  return {
    list: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/bbs/bbsComment/list',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    edit: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/bbs/bbsComment',
        method: 'put',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    query: <T = any>(id?: number | string): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/bbs/bbsComment/' + id,
        method: 'get',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    insert: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/bbs/bbsComment',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    delete: <T = any>(id?: number | string): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/bbs/bbsComment/' + id,
        method: 'delete',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
  };
}
