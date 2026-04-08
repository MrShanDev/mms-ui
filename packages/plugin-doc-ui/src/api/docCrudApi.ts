import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import type { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';

const secureHeaders = {
  'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
  'Encrypt-Type': EncryptTypeEnum.AES,
};

/** 与后端 {@code doc/docXxx} 控制器路径一致（不含前导斜杠段外的 doc） */
export function docCrudApi(segment: string) {
  const prefix = `${getEnv()}/doc/${segment}`;
  return {
    list: <T = any>(params?: object): AxiosPromise<T> =>
      request({
        url: `${prefix}/list`,
        method: 'post',
        data: params,
        headers: secureHeaders,
      }),
    edit: <T = any>(params?: object): AxiosPromise<T> =>
      request({
        url: prefix,
        method: 'put',
        data: params,
        headers: secureHeaders,
      }),
    query: <T = any>(id?: number | string): AxiosPromise<T> =>
      request({
        url: `${prefix}/${id}`,
        method: 'get',
        headers: secureHeaders,
      }),
    insert: <T = any>(params?: object): AxiosPromise<T> =>
      request({
        url: prefix,
        method: 'post',
        data: params,
        headers: secureHeaders,
      }),
    delete: <T = any>(id?: number | string): AxiosPromise<T> =>
      request({
        url: `${prefix}/${id}`,
        method: 'delete',
        headers: secureHeaders,
      }),
  };
}
