import { defineStore } from 'pinia';
import { Session } from '/@/utils/storage';
import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';
import { SysEnum } from '/@/enums/SysEnum';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
  state: (): UserInfosState => ({
    userInfos: {
      userName: '',
      photo: '',
      time: 0,
      email: '',
      phoneNumber: '',
      sex: '',
      loginIp: '',
      loginRegion: '',
      loginDate: '',
      roleName: '',
      roles: [],
      passwordStrength: '',
      authBtnList: [],
    },
  }),
  actions: {
    async setUserInfos() {
      let cached = Session.get('userInfo');
      if ((!cached || typeof cached !== 'object' || Array.isArray(cached)) && Session.get('token')) {
        try {
          const response: any = await request({ url: getEnv() + '/system/user/getUserInfo', method: 'get', timeout: 5000, headers: { 'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE } });
          if (response.code === 200 && response.data && typeof response.data === 'object') {
            cached = response.data;
            Session.set('userInfo', cached);
          }
        } catch {
          // 信息恢复失败也保留导航及退出入口，鉴权交由接口处理。
        }
      }
      // 没有缓存时保留初始对象，避免登录状态下导航组件读取 null。
      if (cached && typeof cached === 'object' && !Array.isArray(cached)) {
        this.userInfos = {
          ...this.userInfos,
          ...cached,
          userName: typeof cached.userName === 'string' ? cached.userName : '',
          roles: Array.isArray(cached.roles) ? cached.roles : [],
          authBtnList: Array.isArray(cached.authBtnList) ? cached.authBtnList : [],
        };
      }
    },
  },
});
