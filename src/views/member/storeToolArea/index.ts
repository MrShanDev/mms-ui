import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {StoreToolAreaBo,StoreToolAreaVo} from '/@/views/member/storeToolArea/type';
/**
* 行政区域-Api
* StoreToolArea
*/
export function storeToolAreaApi() {
    return {
        list: (params?: object): AxiosPromise<Array<StoreToolAreaVo>> => {
            return request({
                url: getEnv()+'/member/storeToolArea/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: StoreToolAreaBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/member/storeToolArea',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<StoreToolAreaVo> => {
            return request({
                url: getEnv()+'/member/storeToolArea/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: StoreToolAreaBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/member/storeToolArea',
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
                url: getEnv()+'/member/storeToolArea/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
