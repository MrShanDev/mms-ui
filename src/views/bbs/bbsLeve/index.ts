import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {BbsLeveBo,BbsLeveVo} from '/@/views/bbs/bbsLeve/type';
/**
* 话题操作-Api
* BbsLeve
*/
export function bbsLeveApi() {
    return {
        list: (params?: object): AxiosPromise<Array<BbsLeveVo>> => {
            return request({
                url: getEnv()+'/bbs/bbsLeve/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: BbsLeveBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/bbs/bbsLeve',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<BbsLeveVo> => {
            return request({
                url: getEnv()+'/bbs/bbsLeve/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: BbsLeveBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/bbs/bbsLeve',
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
                url: getEnv()+'/bbs/bbsLeve/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
