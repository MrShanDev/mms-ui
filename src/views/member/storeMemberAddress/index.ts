import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {StoreMemberAddressBo, StoreMemberAddressVo} from '/@/views/member/storeMemberAddress/type';

/**
* 会员收货地址-Api
* StoreMemberAddress
*/
export function storeMemberAddressApi() {
    return {
        list: (params?: object): AxiosPromise<Array<StoreMemberAddressVo>> => {
            return request({
                url: getEnv()+'/member/storeMemberAddress/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: StoreMemberAddressBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/member/storeMemberAddress',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<StoreMemberAddressVo> => {
            return request({
                url: getEnv()+'/member/storeMemberAddress/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: StoreMemberAddressBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/member/storeMemberAddress',
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
                url: getEnv()+'/member/storeMemberAddress/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
