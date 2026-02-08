import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {BbsTopicBo,BbsTopicVo} from '/@/views/bbs/bbsTopic/type';
/**
* 话题-Api
* BbsTopic
*/
export function bbsTopicApi() {
    return {
        list: (params?: object): AxiosPromise<Array<BbsTopicVo>> => {
            return request({
                url: getEnv()+'/bbs/bbsTopic/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: BbsTopicBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/bbs/bbsTopic',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<BbsTopicVo> => {
            return request({
                url: getEnv()+'/bbs/bbsTopic/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: BbsTopicBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/bbs/bbsTopic',
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
                url: getEnv()+'/bbs/bbsTopic/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
