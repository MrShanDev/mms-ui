import request from '/@/utils/request';
import {getEnv} from "/@/utils/mms";
import {AxiosPromise} from "axios";
import {SysEnum} from "/@/enums/SysEnum";
import {EncryptTypeEnum} from "/@/enums/EncryptTypeEnum";
import {ChatMessageBo,ChatMessageVo} from '/@/views/sxpcwlkj/chatMessage/type';
/**
* 聊天消息表-Api
* ChatMessage
*/
export function chatMessageApi() {
    return {
        list: (params?: object): AxiosPromise<Array<ChatMessageVo>> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatMessage/list',
                method: 'post',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        edit: (params?: ChatMessageBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatMessage',
                method: 'put',
                data: params,
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        query: (id?: number | string): AxiosPromise<ChatMessageVo> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatMessage/'+id,
                method: 'get',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
        insert: (params?: ChatMessageBo): AxiosPromise<boolean> => {
            return request({
                url: getEnv()+'/sxpcwlkj/chatMessage',
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
                url: getEnv()+'/sxpcwlkj/chatMessage/' + id,
                method: 'delete',
                headers: {
                    'Encrypt-State':SysEnum.SYS_COMMON_STATE_CLOSE,
                    'Encrypt-Type': EncryptTypeEnum.AES
                },
            });
        },
    };
}
