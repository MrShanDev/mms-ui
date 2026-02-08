import {BaseEntity} from "/@/types/global";

/**
* 对象实体Vo
* @extends {BaseEntity}
*/
export declare interface ChatUserConversationVo extends BaseEntity {
      id: string; 
      userId: string; 
      conversationId: string; 
      conversationType: string; 
      isPinned: number; 
      pinnedTime: string; 
      isMuted: number; 
      lastMessageTime: string; 
      lastMessageContent: string; 
      unreadCount: number; 
      createTime: string; 
      updateTime: string; 
      extra: string
}

/**
* 对象实体Bo
* @extends {BaseEntity}
*/
export declare interface ChatUserConversationBo extends BaseEntity {
        id: string; 
        userId: string; 
        conversationId: string; 
        conversationType: string; 
        isPinned: number; 
        pinnedTime: string; 
        isMuted: number; 
        lastMessageTime: string; 
        lastMessageContent: string; 
        unreadCount: number; 
        createTime: string; 
        updateTime: string; 
        extra: string
}
