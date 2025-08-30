import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';
import { DocOrderBo, DocOrderVo, DocOrderTable } from '/@/views/docAdmin/docOrder/type';
/**
 * 文档订单-Api
 * DocOrder
 */
export function docOrderApi() {
  return {
    list: (params?: object): AxiosPromise<DocOrderVo[]> => {
      return request({
        url: getEnv() + '/docAdmin/docOrder/list',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    edit: (params?: DocOrderBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docOrder',
        method: 'put',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    query: (id?: number | string): AxiosPromise<DocOrderVo> => {
      return request({
        url: getEnv() + '/docAdmin/docOrder/' + id,
        method: 'get',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    insert: (params?: DocOrderBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docOrder',
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
        url: getEnv() + '/docAdmin/docOrder/' + id,
        method: 'delete',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
  };
}
