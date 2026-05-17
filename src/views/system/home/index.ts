import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { AxiosPromise } from 'axios';
import { SysEnum } from '/@/enums/SysEnum';
import { EncryptTypeEnum } from '/@/enums/EncryptTypeEnum';
/**
 * 控制台
 * @param code
 * @returns
 */
export function homeApi() {
  return {
    /** @deprecated 与 memberList 相同，保留兼容；文档用户已合并至 store_member */
    list: (params?: object): AxiosPromise<{ rows: any[]; total: number }> => {
      return request({
        url: getEnv() + '/member/storeMember/list',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    /** 首页「最新会员」表格，与 member/storeMember 列表接口一致 */
    memberList: (params?: object): AxiosPromise<{ rows: any[]; total: number }> => {
      return request({
        url: getEnv() + '/member/storeMember/list',
        method: 'post',
        data: params,
        headers: {
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        },
      });
    },
    homeInit: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/homeInit',
        method: 'get',
        params,
      });
    },
    /** 系统运行信息（实时）：OS/CPU/内存/磁盘/JDK/JVM/数据库等 */
    runtimeInfo: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/runtimeInfo',
        method: 'get',
        params,
      });
    },
    /** 系统运行趋势（实时采样）：CPU/内存/JVM 内存 */
    runtimeTrend: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/runtimeTrend',
        method: 'get',
        params,
      });
    },
    info: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/info',
        method: 'get',
        params,
      });
    },
    menu: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/menu',
        method: 'get',
        params,
      });
    },
    orderNum: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/orderNum',
        method: 'get',
        params,
      });
    },
    orderPrice: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/orderPrice',
        method: 'get',
        params,
      });
    },
    memberSex: <T = any>(params?: object): AxiosPromise<T> => {
      return request({
        url: getEnv() + '/system/home/memberSex',
        method: 'get',
        params,
      });
    },
  };
}
