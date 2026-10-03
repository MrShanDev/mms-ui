import request from '/@/utils/request';
import { getEnv } from '/@/utils/mms';

/**
 * 系统详情
 * @returns
 */
export function sysInfo() {
  return request({
    url: getEnv() + '/system/visitor/sysInfo',
    method: 'post',
  });
}

/**
 * 获取验证码
 * @param code
 * @returns
 */
export function captcha(code: string) {
  return request({
    url: getEnv() + '/system/visitor/' + code,
    method: 'get',
  });
}

/**
 * 登录
 * @param params
 * @returns
 */
export function login(params: object) {
  return request({
    url: getEnv() + '/system/auth/login',
    method: 'post',
    headers: {
      // 登录接口不加密；开启防重复提交（请求拦截器识别 isRepeatSubmit，命中后注入 nonce）
      isRepeatSubmit: 'true',
    },
    data: params,
  });
}

export function loginByPhone(params: object) {
  return request({
    url: getEnv() + '/system/auth/loginByPhone',
    method: 'post',
    headers: {
      // 登录接口不加密；开启防重复提交（请求拦截器识别 isRepeatSubmit，命中后注入 nonce）
      isRepeatSubmit: 'true',
    },
    data: params,
  });
}

/**
 * 退出登录
 * @returns
 */
export function logout() {
  return request({
    url: getEnv() + '/system/auth/logout',
    method: 'post',
  });
}
