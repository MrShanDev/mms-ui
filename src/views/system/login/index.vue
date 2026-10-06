<template>
  <main class="login-page" :class="{ 'has-brand-background': config.loginBg && !backgroundFailed }">
    <img
      v-if="config.loginBg && !backgroundFailed"
      class="brand-background"
      :src="config.loginBg"
      alt=""
      aria-hidden="true"
      @error="backgroundFailed = true"
    />
    <section class="login-panel" aria-label="登录">
      <div class="login-card">
        <div class="card-brand">
          <img :src="displayLogo" :alt="config.globalTitle" @error="logoFailed = true" />
        </div>
        <h1>{{ config.globalTitle }}</h1>
        <p class="card-subtitle" :title="config.globalDescription">
          {{ config.globalDescription }}
        </p>
        <nav v-if="enabledMethods.length > 1" class="login-tabs" aria-label="登录方式">
          <button
            v-for="method in enabledMethods"
            :key="method.key"
            type="button"
            :aria-pressed="current === method.key"
            :class="{ active: current === method.key }"
            @click="current = method.key"
          >
            {{ method.title }}
          </button>
        </nav>
        <div v-if="loading" class="loading-state" role="status">正在连接服务…</div>
        <div v-else-if="error || !enabledMethods.length" class="error-state" role="alert">
          <p>{{ error || '当前未开放登录方式，请联系管理员。' }}</p>
          <el-button @click="loadConfig">重新连接</el-button>
        </div>
        <component
          v-else
          :is="activeComponent"
          :key="current"
          :captchaState="config.captchaState"
          :demoMode="config.demoMode"
          :demoAccount="config.demoAccount"
          :demoPassword="config.demoPassword"
        />
        <div class="login-security">
          <el-icon><ele-Lock /></el-icon>
          <span>请使用本人账号登录，勿向他人提供验证码</span>
        </div>
      </div>
      <footer>登录遇到问题？请联系管理员</footer>
    </section>
  </main>
</template>
<script setup lang="ts" name="loginIndex">
  import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue';
  import { startBase } from '/@/views/system/init';
  import { NextLoading } from '/@/utils/loading';
  import logo from '/@/assets/image.svg';
  import { fallbackBrand, normalizeBrand } from './branding';
  const logoFailed = ref(false),
    backgroundFailed = ref(false);
  const displayLogo = computed(() => (logoFailed.value ? logo : config.logo));
  const methods = [
    {
      key: '1',
      title: '账号密码',
      component: defineAsyncComponent(() => import('./component/account.vue')),
    },
    {
      key: '2',
      title: '手机验证码',
      component: defineAsyncComponent(() => import('./component/mobile.vue')),
    },
    {
      key: '3',
      title: '微信扫码',
      component: defineAsyncComponent(() => import('./component/scan.vue')),
    },
  ];
  const current = ref('1'),
    loading = ref(true),
    error = ref('');
  const config = reactive({
    ...fallbackBrand,
    logo,
    loginType: [] as string[],
    captchaState: true,
    demoMode: false,
    demoAccount: '',
    demoPassword: '',
  });
  const enabledMethods = computed(() => methods.filter((m) => config.loginType.includes(m.key)));
  const activeComponent = computed(
    () => enabledMethods.value.find((m) => m.key === current.value)?.component
  );
  async function loadConfig() {
    loading.value = true;
    error.value = '';
    try {
      const res = await startBase();
      if (res.code !== 200 || !res.data) throw new Error();
      const d = res.data;
      Object.assign(config, normalizeBrand(d, logo));
      logoFailed.value = false;
      backgroundFailed.value = false;
      config.loginType = Array.isArray(d.loginType) ? d.loginType.map(String) : [];
      config.captchaState = d.captchaState !== false;
      config.demoMode = d.demoMode === true;
      config.demoAccount = typeof d.demoAccount === 'string' ? d.demoAccount : '';
      config.demoPassword = typeof d.demoPassword === 'string' ? d.demoPassword : '';
      if (!config.loginType.includes(current.value))
        current.value = enabledMethods.value[0]?.key || '';
    } catch {
      Object.assign(config, fallbackBrand, { logo });
      error.value = '暂时无法连接登录服务，请稍后重试。';
    } finally {
      loading.value = false;
    }
  }
  onMounted(() => {
    loadConfig();
    NextLoading.done();
  });
</script>
<style scoped lang="scss">
  .login-page {
    position: relative;
    isolation: isolate;
    min-height: 100vh;
    min-height: 100dvh;
    background: #f6f9fd url('/login-background.svg') center / cover no-repeat;
    color: #24334c;
    overflow: auto;
  }
  .brand-background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    pointer-events: none;
  }
  .has-brand-background::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #f6f9fd99;
    z-index: -1;
  }
  .login-panel {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    box-sizing: border-box;
  }
  .login-card {
    width: 100%;
    max-width: 420px;
    padding: 36px 40px 28px;
    box-sizing: border-box;
    background: #ffffffed;
    border: 1px solid #fff;
    border-radius: 20px;
    box-shadow:
      0 16px 60px #27476c0c,
      0 2px 8px #27476c04;
    animation: card-enter 0.4s ease-out;
  }
  .card-brand {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }
  .card-brand img {
    width: 44px;
    height: 44px;
    object-fit: contain;
  }
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .card-subtitle {
    margin: 10px 0 30px;
    color: #8b96a7;
    font-size: 12px;
    line-height: 1.7;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: anywhere;
  }
  .login-tabs {
    display: flex;
    gap: 6px;
    border-bottom: 1px solid #edf1f6;
    margin-bottom: 24px;
  }
  .login-tabs button {
    flex: 1;
    padding: 12px 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    font: inherit;
    font-size: 12px;
    color: #8b96a7;
    cursor: pointer;
    transition: color 0.2s;
  }
  .login-tabs button:hover,
  .login-tabs button.active {
    color: #1688ed;
  }
  .login-tabs button.active {
    border-bottom-color: #1688ed;
    font-weight: 600;
  }
  .login-tabs button:focus-visible {
    outline: 2px solid #1688ed;
    outline-offset: 2px;
  }
  .login-security {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 6px;
    margin-top: 24px;
    font-size: 11px;
    color: #9aa5b5;
    line-height: 1.6;
  }
  .login-security .el-icon {
    margin-top: 3px;
    flex-shrink: 0;
  }
  .login-panel footer {
    margin-top: 24px;
    font-size: 12px;
    color: #9aa5b5;
    text-align: center;
  }
  .loading-state,
  .error-state {
    padding: 30px 0;
    text-align: center;
    font-size: 13px;
    color: #687b96;
  }
  .error-state p {
    margin-bottom: 18px;
  }
  :deep(.login-content-form) {
    margin-top: 0;
  }
  :deep(.login-content-title) {
    color: #637087 !important;
    font-size: 13px;
    margin-bottom: 8px;
    width: 100%;
  }
  :deep(.el-input__wrapper) {
    min-height: 44px;
    background: #fbfcfe;
    border-radius: 8px;
  }
  :deep(.login-content-submit) {
    height: 46px;
    border-radius: 8px;
    letter-spacing: 2px !important;
    background: #1688ed;
    border-color: #1688ed;
    transition:
      background 0.2s,
      box-shadow 0.2s;
  }
  :deep(.login-content-submit:hover) {
    background: #0879dd;
    box-shadow: 0 5px 14px #1688ed26;
  }
  :deep(.el-form-item) {
    margin-bottom: 22px;
  }
  @keyframes card-enter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (max-width: 480px) {
    .login-panel {
      padding: 28px 18px;
    }
    .login-card {
      padding: 30px 24px 24px;
      border-radius: 16px;
    }
    h1 {
      font-size: 22px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .login-card {
      animation: none;
    }
    :deep(.login-content-submit),
    .login-tabs button {
      transition: none;
    }
  }
</style>
