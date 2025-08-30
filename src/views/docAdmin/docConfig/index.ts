import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';
import { DocConfigBo, DocConfigVo, DocConfigTable } from '/@/views/docAdmin/docConfig/type';
/**
 * 文档配置-Api
 * DocConfig
 */
export function docConfigApi() {
  return {
    list: (params?: object): AxiosPromise<DocConfigVo[]> => {
      return request({
        url: getEnv() + '/docAdmin/docConfig/list',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    edit: (params?: DocConfigBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docConfig',
        method: 'put',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    query: (id?: number | string): AxiosPromise<DocConfigVo> => {
      return request({
        url: getEnv() + '/docAdmin/docConfig/' + id,
        method: 'get',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    insert: (params?: DocConfigBo): AxiosPromise<boolean> => {
      return request({
        url: getEnv() + '/docAdmin/docConfig',
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
        url: getEnv() + '/docAdmin/docConfig/' + id,
        method: 'delete',
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
  };
}
