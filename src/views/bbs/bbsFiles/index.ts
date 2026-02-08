import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {BbsFilesBo,BbsFilesVo} from '/@/views/bbs/bbsFiles/type';
/**
* 话题附件-Api
* BbsFiles
*/
export function bbsFilesApi() {
    return {
        list: (params?: object): AxiosPromise<Array<BbsFilesVo>> => {
            return request({
                url: getEnv()+'/bbs/bbsFiles/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: BbsFilesBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/bbs/bbsFiles',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<BbsFilesVo> => {
            return request({
                url: getEnv()+'/bbs/bbsFiles/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: BbsFilesBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/bbs/bbsFiles',
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
                url: getEnv()+'/bbs/bbsFiles/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
