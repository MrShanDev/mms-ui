import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {StoreAdvertisingLocationBo,StoreAdvertisingLocationVo} from '/@/views/ad/storeAdvertisingLocation/type';
/**
* 广告位-Api
* StoreAdvertisingLocation
*/
export function storeAdvertisingLocationApi() {
    return {
        list: (params?: object): AxiosPromise<Array<StoreAdvertisingLocationVo>> => {
            return request({
                url: getEnv()+'/ad/storeAdvertisingLocation/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: StoreAdvertisingLocationBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/ad/storeAdvertisingLocation',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<StoreAdvertisingLocationVo> => {
            return request({
                url: getEnv()+'/ad/storeAdvertisingLocation/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: StoreAdvertisingLocationBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/ad/storeAdvertisingLocation',
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
                url: getEnv()+'/ad/storeAdvertisingLocation/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
