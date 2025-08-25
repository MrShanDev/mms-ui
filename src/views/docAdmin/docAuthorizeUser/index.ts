import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {DocAuthorizeUserBo,DocAuthorizeUserVo,DocAuthorizeUserTable } from '/@/views/docAdmin/docAuthorizeUser/type';
/**
* 文档授权用户-Api
* DocAuthorizeUser
*/
export function docAuthorizeUserApi() {
    return {
        list: (params?: object): AxiosPromise<DocAuthorizeUserVo[]> => {
            return request({
                url: getEnv()+'/docAdmin/docAuthorizeUser/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: DocAuthorizeUserBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/docAdmin/docAuthorizeUser',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<DocAuthorizeUserVo> => {
            return request({
                url: getEnv()+'/docAdmin/docAuthorizeUser/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: DocAuthorizeUserBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/docAdmin/docAuthorizeUser',
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
                url: getEnv()+'/docAdmin/docAuthorizeUser/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
