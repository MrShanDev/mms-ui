<template>
  <div class="login-container flex">
    <div class="login-left">
      <!-- <div class="login-left-logo">
        <Animate>
          <img :src="getThemeConfig.logo" alt="logo" />
        </Animate>
        <div class="login-left-logo-text">
          <Animate>
            <span>{{ getThemeConfig.globalTitle }}</span>
          </Animate>
          <Animate>
            <span class="login-left-logo-text-msg">{{ getThemeConfig.globalDescription }}</span>
          </Animate>
        </div>
      </div> -->
      <div class="login-left-img">
        <Animate class="flex flex-center">
        <img src="https://sxpcwlkj-test.oss-accelerate.aliyuncs.com/mmsMall/upload/69649624f176d6c9a798a18d.png" alt="loginMain" />
        </Animate>
      </div>
      <!-- <img :src="loginBg" class="login-left-waves " alt="bg" /> -->
    </div>
    <div class="login-right flex">
      <div class="login-right-warp flex-margin">
        <div class="login-right-warp-mian">
          <div class="login-right-warp-main-title flex">
            <Animate>
              <img :src="getThemeConfig.logo" alt="logo" />
            </Animate>
            <Animate>
              <span class="ml10 shou">mmsAdmin</span>
            </Animate>
          </div>
          <div class="login-right-warp-main-form" v-if="getThemeConfig.loginType.length>0" >
            <!-- 显示当前选中的登录表单 -->
            <component :is="currentLoginFormComponent" 
                      :captchaState="getThemeConfig.captchaState" 
                      :demoMode="getThemeConfig.demoMode" 
                      :demoAccount="getThemeConfig.demoAccount" 
                      :demoPassword="getThemeConfig.demoPassword" 
                      class="login-form-component"/>

            <div class="other-login">
              <div class="other-login-title">其他登录方式</div>
              <div class="other-login-content flex">
                <!-- 渲染非当前选中的其他两种登录方式 -->
                <div v-for="loginMethod in availableLoginMethods.filter(method => method.key !== state.currentLoginMethod && getThemeConfig.loginType.includes(method.key))" 
                     :key="loginMethod.key" 
                     class="other-login-content-item w-50" 
                     @click="switchLoginMethod(loginMethod.key)">
                  <div class="other-login-content-item-icon">
                    <i :class="loginMethod.icon"></i>
                  </div>
                  <div class="mt20 other-login-content-item-title">{{ loginMethod.title }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="error mx-auto mt-20" v-else>
            <el-empty :description="state.msg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="loginIndex">
  import { defineAsyncComponent, onMounted, reactive, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useThemeConfig } from '/@/stores/themeConfig';
  import { NextLoading } from '/@/utils/loading';
  import logoMini from '/@/assets/image.svg';
  import loginMain from '/@/assets/login_main01.svg';
  import loginBg from '/@/assets/login-bg.svg';
  import { startBase } from '/@/api/system/init';

  // 引入组件
  const Animate = defineAsyncComponent(() => import('/@/components/animate/index.vue'));
  // 账号登录
  const Account = defineAsyncComponent(() => import('/@/views/system/login/component/account.vue'));
  const Mobile = defineAsyncComponent(() => import('/@/views/system/login/component/mobile.vue'));
  const Scan = defineAsyncComponent(() => import('/@/views/system/login/component/scan.vue'));

  // 定义变量内容

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
  tabsActiveName: "account",
  isScan: false,
  msg:"~ 后端接口异常！",
  currentLoginMethod: "1" // 当前选中的登录方式，默认为账号密码登录
});

// 定义所有可能的登录方式
const availableLoginMethods = [
  { key: "1", value: "account", title: "账号密码登录", icon: "fa fa-user", component: Account },
  { key: "2", value: "mobile", title: "手机验证码登录", icon: "fa fa-mobile", component: Mobile },
  { key: "3", value: "scan", title: "微信二维码登录", icon: "fa fa-qrcode", component: Scan }
];

// 获取当前登录表单组件
const currentLoginFormComponent = computed(() => {
  // 根据数值匹配登录方式
  const currentMethod = availableLoginMethods.find(method => method.key === state.currentLoginMethod);
  if (!currentMethod) return null;
  
  // 返回对应的组件
  switch(currentMethod.value) {
    case 'account':
      return Account;
    case 'mobile':
      return Mobile;
    case 'scan':
      return Scan;
    default:
      return Account;
  }
});

// 切换登录方式
const switchLoginMethod = (method: string) => {
  state.currentLoginMethod = method;
};

// 获取布局配置信息
const getThemeConfig = reactive({
  globalTitle: themeConfig.value.globalTitle,
  globalDescription: themeConfig.value.globalViceTitleMsg,
  logo: logoMini,
  loginType: [] as Array<string>,
  loginBg: loginMain,
  captchaState: false,
  codeUrl: '',
  demoMode: false,
  demoAccount: '',
  demoPassword: ''
});


  const baseStart = () => {
    startBase()
      .then((res) => {
        if (res.code == 200) {
          getThemeConfig.globalTitle = res.data.globalTitle;
          getThemeConfig.globalDescription = res.data.globalDescription;
          getThemeConfig.logo = res.data.logo;
          getThemeConfig.loginType = res.data.loginType;
          getThemeConfig.captchaState = res.data.captchaState;
          getThemeConfig.demoMode = res.data.demoMode;
          getThemeConfig.demoAccount = res.data.demoAccount;
          getThemeConfig.demoPassword = res.data.demoPassword;
          if (res.data.loginBg != null && res.data.loginBg.length > 0) {
            getThemeConfig.loginBg = res.data.loginBg;
          }
          if (res.data.codeUrl != null && res.data.codeUrl.length > 0) {
            getThemeConfig.codeUrl = res.data.codeUrl;
          }
        }
      })
      .catch((err) => {
        state.msg = '后端接口异常: ' + err;
      });
  };

  const changeTab = (e: string) => {
    if (e === 'code') {
      state.isScan = true;
    } else {
      state.isScan = false;
    }
  };
  // 页面加载时
  onMounted(() => {
    baseStart();
    NextLoading.done();
  });
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  background: url("https://sxpcwlkj-test.oss-accelerate.aliyuncs.com/mmsMall/upload/696495e4f176d6c9a798a18c.png") no-repeat;
  background-size: 100% 100%;
  box-shadow: 20px 20px 39px #DEE1FF;
  justify-content: flex-end;
  .login-left {
    flex: 1;
    position: relative;
    .login-left-logo {
      display: flex;
      align-items: center;
      position: absolute;
      top: 50px;
      left: 80px;
      z-index: 1;
      animation: logoAnimation 0.3s ease;
      img {
        width: 52px;
        height: 52px;
      }
      .login-left-logo-text {
        display: flex;
        flex-direction: column;
        span {
          margin-left: 10px;
          font-size: 24px;
          color: #26a59a;
          margin-bottom: 5px;
        }
        .login-left-logo-text-msg {
          font-size: 12px;
          color: #32a99e;
        }
      }
    }
    .login-left-img {
      position: absolute;
      top: 30%;
      left: 40%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 52%;
      img {
        width: 50%;
        height: 100%;
        animation: error-num 0.6s ease;
        text-align: center;
      }
    }
    .login-left-waves {
      position: absolute;
      top: 0;
      right: -100px;
    }
  }
  .login-right {
    width: 900px;
    .login-right-warp {
      border-radius: 16px;
      width: 550px;
      height: auto;
      position: relative;
      overflow: hidden;
      // background-color: var(--el-color-white);
      background-color: rgba(255, 255, 255, 0.5);
      .login-right-warp-mian {
        display: flex;
        flex-direction: column;
        height: 100%;
        .login-right-warp-main-title {
          align-items: center;
          padding: 50px 80px 20px;
          font-size: 27px;
          letter-spacing: 3px;
          animation: logoAnimation 0.3s ease;
          animation-delay: 0.3s;
          color: #4487EC;
          img{
            width: 60px;
            height: 60px;
          }
        }
        .login-right-warp-main-form {
          flex: 1;
          padding: 0 80px 50px;
          .login-content-main-sacn {
            position: absolute;
            top: 0;
            right: 0;
            width: 50px;
            height: 50px;
            overflow: hidden;
            cursor: pointer;
            transition: all ease 0.3s;
            color: var(--el-color-primary);
            &-delta {
              position: absolute;
              top: 0;
              right: 0;
              width: 50px;
              height: 50px;
              overflow: hidden;
              cursor: pointer;
              transition: all ease 0.3s;
              color: var(--el-color-primary);
              &-delta {
                position: absolute;
                width: 35px;
                height: 70px;
                z-index: 2;
                top: 2px;
                right: 21px;
                background: var(--el-color-white);
                transform: rotate(-45deg);
              }
              &:hover {
                opacity: 1;
                transition: all ease 0.3s;
                color: var(--el-color-primary) !important;
              }
              i {
                width: 47px;
                height: 50px;
                display: inline-block;
                font-size: 48px;
                position: absolute;
                right: 1px;
                top: 0px;
              }
            }
          }
        }
      }
    }
    .other-login{
      .other-login-title{
        text-align: center;
        margin: 50px 0 30px;
      }
      .other-login-content{
        .other-login-content-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-5px);
          }
          
          .other-login-content-item-icon{
            padding: 10px 50px;
            border-radius: 20px;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            
            &:hover {
              background-color: #f0f9ff;
              border-color: #409eff;
            }
          }
          .other-login-content-item-title{
            font-size: 14px;
            color: #838383;
            transition: all 0.3s ease;
            
            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }
  }
  .login-msg {
    color: var(--el-text-color-placeholder);
  }
  .error{
    font-size: 20px;
  }
  .fa{
    font-size: 30px;
    margin-right: 10px;
  }
  
  .login-form-component {
    min-height: 300px;
    height: auto;
  }
}
</style>
