<template>
  <div class="login-scan-container">
    <div v-if="succeed" class="flex flex-col f-y-c">
      <div class="fond16 mt-10">
        <el-icon color="#2dac34" :size="80"><ele-CircleCheckFilled /></el-icon>
      </div>
      <div class="fond16">登录成功</div>
    </div>
    <div v-else>
      <div v-if="unCode" class="flex flex-col f-y-c">
        <div class="fond16 mt-10">
          <el-icon color="#f0a71a" :size="80"><ele-WarningFilled /></el-icon>
        </div>
        <div class="fond16">
          {{ unCodeMsg }}
          <span class="fond16 f-c-1 shou" @click="retryLoginScanWithNewKey">刷新</span>
        </div>
      </div>
      <div v-else>
        <div v-loading="!codeUrl && !codeQrBroken" element-loading-text="加载中..." style="height: 250px">
          <div v-if="codeQrBroken" class="login-scan-qr-broken">
            <div class="login-scan-qr-broken__visual" aria-hidden="true">
              <span class="login-scan-qr-broken__crack" />
            </div>
            <span>二维码生成失败或已损坏，请刷新重试</span>
          </div>
          <img
            v-else
            class="grayscale"
            :src="codeUrl"
            @click="initQrcode"
            style="width: 70%"
            alt=""
            @error="codeQrBroken = true"
          />
        </div>
        <div class="font12 mt10 login-msg flex flex-col">
          <div class="fond16 f-c-2">剩余 {{ exitTime + 's' }}</div>
          <div class="mt10">{{ $t('message.scan.text') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="loginScan">
  import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue';
  import { getWxCode, queryWxCodeState } from '/@/views/system/init';
  import { generateUUID, getEnv } from '/@/utils/mms';
  import { ElMessage } from 'element-plus';
  import { useI18n } from 'vue-i18n';
  import Cookies from 'js-cookie';
  import { storeToRefs } from 'pinia';
  import { useThemeConfig } from '/@/stores/themeConfig';
  import { initFrontEndControlRoutes } from '/@/router/frontEnd';
  import { initBackEndControlRoutes } from '/@/router/backEnd';
  import { Session } from '/@/utils/storage';
  import { formatAxis } from '/@/utils/formatTime';
  import { NextLoading } from '/@/utils/loading';
  import { SysEnum } from '/@/enums/SysEnum';

  /** 刷新页面后仍沿用同一会话的 key，避免 SSE/倒计时重来（关闭标签后清空） */
  const WX_LOGIN_SCAN_KEY = 'mms_wx_login_scan_key';

  const loadOrCreateLoginScanKey = (): string => {
    try {
      const s = sessionStorage.getItem(WX_LOGIN_SCAN_KEY);
      if (s && `${s}`.trim().length >= 16) {
        return s;
      }
    } catch {
      /* ignore */
    }
    const n = generateUUID() as string;
    try {
      sessionStorage.setItem(WX_LOGIN_SCAN_KEY, n);
    } catch {
      /* ignore */
    }
    return n;
  };

  const clearLoginScanKey = () => {
    try {
      sessionStorage.removeItem(WX_LOGIN_SCAN_KEY);
    } catch {
      /* ignore */
    }
  };

  const { t } = useI18n();
  const storesThemeConfig = useThemeConfig();
  const { themeConfig } = storeToRefs(storesThemeConfig);
  const route = useRoute();
  const router = useRouter();
  const succeed = ref(false);
  const unCode = ref(false);
  const unCodeMsg = ref('二维码已失效');
  const reqKey = ref(loadOrCreateLoginScanKey());
  const codeUrl = ref('');

  const rotateLoginScanKey = () => {
    const n = generateUUID() as string;
    try {
      sessionStorage.setItem(WX_LOGIN_SCAN_KEY, n);
    } catch {
      /* ignore */
    }
    reqKey.value = n;
  };

  const codeQrBroken = ref(false);
  let intervalId: ReturnType<typeof setInterval> | undefined;
  /** 登录页扫码结果 SSE（终态「扫码成功」后再 POST 一次 queryWxCodeState 落会话 / Cookie） */
  let loginWxEs: EventSource | null = null;
  const exitTime = ref(60);
  const emit = defineEmits<{
    update: [value: any];
  }>();
  const update = () => {
    emit('update', '');
  };

  const buildWxLoginSseUrl = (key: string) => {
    const baseApiPrefix = getEnv().replace(/\/$/, '');
    return `${baseApiPrefix}/common/wxLogin/stream?key=${encodeURIComponent(key)}`;
  };

  const stopLoginWxSse = () => {
    try {
      loginWxEs?.close();
    } catch (e) {
      /* ignore */
    }
    loginWxEs = null;
  };

  const startLoginWxSse = () => {
    stopLoginWxSse();
    if (!(window as unknown as { EventSource?: typeof EventSource }).EventSource) {
      ElMessage.warning('当前浏览器不支持扫码实时推送（SSE）');
      return;
    }
    const url = buildWxLoginSseUrl(reqKey.value);
    const es = new EventSource(url);
    loginWxEs = es;

    const finishEs = () => {
      try {
        es.close();
      } catch (e) {
        /* ignore */
      }
      loginWxEs = null;
    };

    es.addEventListener('done', (evt: MessageEvent) => {
      finishEs();
      try {
        const raw = (evt as MessageEvent).data;
        const d = typeof raw === 'string' ? JSON.parse(raw || '{}') : {};
        if (d.ok === true && d.login === true) {
          /** 扫码已成功：必须在独立 POST 中完成 token / Set-Cookie，与后端约定一致 */
          finalizeLoginViaHttp();
        } else {
          unCodeMsg.value = (d.msg as string) || '操作失败';
          succeed.value = false;
          unCode.value = true;
          exitTime.value = 0;
          if (intervalId !== undefined) {
            clearInterval(intervalId);
            intervalId = undefined;
          }
        }
      } catch (e) {
        /* ignore */
      }
    });

    es.onerror = () => {
      finishEs();
    };
  };

  /** 与原先轮询一致：一次 queryWxCodeState 完成登录态写入 */
  const finalizeLoginViaHttp = () => {
    queryWxCodeState(reqKey.value)
      .then(async (res) => {
        if (res.status == 0) {
          succeed.value = true;
          clearLoginScanKey();
          if (intervalId !== undefined) {
            clearInterval(intervalId);
            intervalId = undefined;
          }
          Session.set(SysEnum.USER_INFO_KEY, res.data.userInfo);
          Session.set(SysEnum.TOKEN_KEY, res.data.token);
          Cookies.set(SysEnum.USER_INFO_NAME, res.data.userInfo.username);
          if (!themeConfig.value.isRequestRoutes) {
            const isNoPower = await initFrontEndControlRoutes();
            setTimeout(() => {
              signInSuccess(isNoPower);
            }, 1500);
          } else {
            const isNoPower = await initBackEndControlRoutes();
            setTimeout(() => {
              signInSuccess(isNoPower);
            }, 1500);
          }
        } else {
          if (intervalId !== undefined) {
            clearInterval(intervalId);
            intervalId = undefined;
          }
          unCodeMsg.value = res.msg as string;
          succeed.value = false;
          unCode.value = true;
          exitTime.value = 0;
        }
      })
      .catch(() => {
        /* 拦截器已提示时可不再弹 */
      });
  };

  /** 失败页「刷新」：换新 key，避免延用已失效会话 */
  const retryLoginScanWithNewKey = () => {
    rotateLoginScanKey();
    initQrcode();
  };

  // 初始化生成二维码（默认沿用 sessionStorage 中的 key，刷新页面可续扫）
  const initQrcode = () => {
    exitTime.value = 60;
    unCode.value = false;
    succeed.value = false;
    codeQrBroken.value = false;
    stopLoginWxSse();
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    nextTick(() => {
      getWxCode(reqKey.value)
        .then((res) => {
          if (res.code == 200) {
            codeUrl.value = res.data as string;
            startLoginWxSse();
            intervalId = setInterval(() => {
              if (exitTime.value <= 0) {
                clearInterval(intervalId);
                intervalId = undefined;
                stopLoginWxSse();
                unCode.value = true;
                return;
              }
              exitTime.value--;
            }, 1000);
          }
        })
        .catch(() => {
          codeQrBroken.value = true;
          ElMessage.error('获取微信二维码失败');
        });
    });
  };

  // 时间获取
  const currentTime = computed(() => {
    return formatAxis(new Date());
  });
  // 登录成功后的跳转
  const signInSuccess = (isNoPower: boolean | undefined) => {
    if (isNoPower) {
      ElMessage.warning('抱歉，您没有登录权限');
      Session.clear();
    } else {
      let currentTimeInfo = currentTime.value;
      if (route.query?.redirect) {
        router.push({
          path: <string>route.query?.redirect,
          query:
            Object.keys(<string>route.query?.params).length > 0
              ? JSON.parse(<string>route.query?.params)
              : '',
        });
      } else {
        router.push('/index');
      }
      const signInText = t('message.signInText');
      ElMessage.success(`${currentTimeInfo}，${signInText}`);
      NextLoading.start();
    }
  };

  onUnmounted(() => {
    stopLoginWxSse();
    if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
  });
  onMounted(() => {
    initQrcode();
  });
</script>

<style scoped lang="scss">
  .login-scan-animation {
    opacity: 0;
    animation-name: error-num;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }
  .login-scan-container {
    padding: 0 20px 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
    @extend .login-scan-animation;
    animation-delay: 0.1s;
    :deep(img) {
      margin: auto;
    }
    .login-msg {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-placeholder);
      @extend .login-scan-animation;
      animation-delay: 0.2s;
    }
  }

  .login-scan-qr-broken {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 200px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
    line-height: 1.4;
  }

  .login-scan-qr-broken__visual {
    width: 140px;
    height: 140px;
    position: relative;
    border: 2px dashed var(--el-color-danger-light-5);
    border-radius: 8px;
    background: var(--el-fill-color);
    box-sizing: border-box;
  }

  .login-scan-qr-broken__crack {
    position: absolute;
    left: 10%;
    top: 50%;
    width: 80%;
    height: 0;
    border-top: 3px solid var(--el-border-color-darker);
    opacity: 0.45;
    transform: rotate(38deg);
    transform-origin: center;
    pointer-events: none;
  }
</style>
