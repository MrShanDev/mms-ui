import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {StoreArticleCateBo,StoreArticleCateVo} from '/@/views/article/storeArticleCate/type';
/**
* 店铺文章分类-Api
* StoreArticleCate
*/
export function storeArticleCateApi() {
    return {
        list: (params?: object): AxiosPromise<Array<StoreArticleCateVo>> => {
            return request({
                url: getEnv()+'/article/storeArticleCate/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: StoreArticleCateBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/article/storeArticleCate',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<StoreArticleCateVo> => {
            return request({
                url: getEnv()+'/article/storeArticleCate/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: StoreArticleCateBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/article/storeArticleCate',
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
                url: getEnv()+'/article/storeArticleCate/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
