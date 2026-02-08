import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {StoreMemberAuthenticationBo,StoreMemberAuthenticationVo} from '/@/views/member/storeMemberAuthentication/type';
/**
* 会员认证-Api
* StoreMemberAuthentication
*/
export function storeMemberAuthenticationApi() {
    return {
        list: (params?: object): AxiosPromise<Array<StoreMemberAuthenticationVo>> => {
            return request({
                url: getEnv()+'/member/storeMemberAuthentication/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: StoreMemberAuthenticationBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/member/storeMemberAuthentication',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<StoreMemberAuthenticationVo> => {
            return request({
                url: getEnv()+'/member/storeMemberAuthentication/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: StoreMemberAuthenticationBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/member/storeMemberAuthentication',
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
                url: getEnv()+'/member/storeMemberAuthentication/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
