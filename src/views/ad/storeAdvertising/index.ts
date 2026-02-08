import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {StoreAdvertisingBo,StoreAdvertisingVo} from '/@/views/ad/storeAdvertising/type';
/**
* 广告-Api
* StoreAdvertising
*/
export function storeAdvertisingApi() {
    return {
        list: (params?: object): AxiosPromise<Array<StoreAdvertisingVo>> => {
            return request({
                url: getEnv()+'/ad/storeAdvertising/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: StoreAdvertisingBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/ad/storeAdvertising',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<StoreAdvertisingVo> => {
            return request({
                url: getEnv()+'/ad/storeAdvertising/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: StoreAdvertisingBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/ad/storeAdvertising',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        delete: (id?: number | string): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/ad/storeAdvertising/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
