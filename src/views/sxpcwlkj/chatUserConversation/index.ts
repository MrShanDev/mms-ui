import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {ChatUserConversationBo,ChatUserConversationVo} from '/@/views/sxpcwlkj/chatUserConversation/type';
/**
* 用户会话表-Api
* ChatUserConversation
*/
export function chatUserConversationApi() {
    return {
        list: (params?: object): AxiosPromise<Array<ChatUserConversationVo>> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatUserConversation/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: ChatUserConversationBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatUserConversation',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<ChatUserConversationVo> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatUserConversation/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: ChatUserConversationBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatUserConversation',
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
                url: getEnv()+'/sxpcwlkj/chatUserConversation/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
