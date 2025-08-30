import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';
import { DocProductBo, DocProductVo, DocProductTable } from '/@/views/docAdmin/docProduct/type';
/**
 * 文档商品-Api
 * DocProduct
 */
export function docProductApi() {
  return {
    list: (params?: object): AxiosPromise<DocProductVo[]> => {
      return request({
        url: getEnv() + '/docAdmin/docProduct/list',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    edit: (params?: DocProductBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docProduct',
        method: 'put',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    query: (id?: number | string): AxiosPromise<DocProductVo> => {
      return request({
        url: getEnv() + '/docAdmin/docProduct/' + id,
        method: 'get',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    insert: (params?: DocProductBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docProduct',
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
        url: getEnv() + '/docAdmin/docProduct/' + id,
        method: 'delete',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
  };
}
