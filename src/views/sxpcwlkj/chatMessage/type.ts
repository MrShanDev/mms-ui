import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface ChatMessageVo extends BaseEntity {
      id: string; 
      senderId: string; 
      receiverId: string; 
      chatRoomId: string; 
      messageType: string; 
      content: string; 
      contentType: string; 
      createTime: string; 
      updateTime: string; 
      extra: string; 
      contentLength: number
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface ChatMessageBo extends BaseEntity {
        id: string; 
        senderId: string; 
        receiverId: string; 
        chatRoomId: string; 
        messageType: string; 
        content: string; 
        contentType: string; 
        createTime: string; 
        updateTime: string; 
        extra: string; 
        contentLength: number
}
