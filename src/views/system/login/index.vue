<template>
  <main class="login-page">
    <img
      v-if="config.loginBg && !backgroundFailed"
      class="brand-background"
      :src="config.loginBg"
      alt=""
      @error="backgroundFailed = true"
    />
    <section class="login-shell" aria-label="登录">
      <header class="brand-header">
        <div class="brand-name">
          <img
            v-if="config.globalTitle !== 'MMS'"
            :src="displayLogo"
            alt=""
            @error="logoFailed = true"
          />
          <strong>{{ config.globalTitle }}</strong>
          <span>{{ config.globalDescription }}</span>
        </div>
        <span class="brand-motto">连接组织 · 管理模块 · 创造更大价值</span>
      </header>
      <div class="login-layout">
        <aside class="login-hero" aria-label="MMS 平台介绍">
          <h1>连接团队，高效协作</h1>
          <p class="hero-subtitle">以模块化能力，构建更灵活的数字化工作方式</p>
          <div class="hero-features">
            <div>
              <el-icon><ele-Box /></el-icon>
              <strong>模块化架构</strong>
              <span>灵活组合，快速搭建</span>
            </div>
            <div>
              <el-icon><ele-User /></el-icon>
              <strong>高效协同</strong>
              <span>组织在线，信息同步</span>
            </div>
            <div>
              <el-icon><ele-TrendCharts /></el-icon>
              <strong>持续成长</strong>
              <span>数据驱动，不断进化</span>
            </div>
          </div>
          <img class="hero-art" :src="hero" alt="蓝色玻璃模块与协作轨道插画" />
          <div class="hero-footnote">
            <i></i>
            <p>让优秀的团队，成就更大的可能</p>
            <span>MMS MODULAR MANAGEMENT SYSTEM</span>
          </div>
        </aside>
        <div class="login-card">
          <h2>欢迎登录</h2>
          <p class="card-subtitle">登录 {{ config.globalTitle }} {{ config.globalDescription }}</p>
          <div v-if="loading" class="loading-state" role="status">正在连接服务…</div>
          <div v-else-if="error || !enabledMethods.length" class="error-state" role="alert">
            <p>{{ error || '当前未开放登录方式，请联系管理员。' }}</p>
            <el-button @click="loadConfig">重新连接</el-button>
          </div>
          <template v-else>
            <div v-if="multiTenant" class="tenant-context">
              <div class="entry-switch" role="group" aria-label="登录身份">
                <button
                  :class="{ active: loginMode === 'platform' }"
                  :aria-pressed="loginMode === 'platform'"
                  @click="loginMode = 'platform'"
                >
                  平台登录
                </button>
                <button
                  :class="{ active: loginMode === 'tenant' }"
                  :aria-pressed="loginMode === 'tenant'"
                  @click="loginMode = 'tenant'"
                >
                  租户登录
                </button>
              </div>
              <label v-if="loginMode === 'tenant'" class="tenant-field">
                <span>租户编号</span>
                <el-input
                  v-model="tenantId"
                  placeholder="请输入平台分配的租户编号"
                  maxlength="32"
                  autocomplete="organization"
                >
                  <template #prefix>
                    <el-icon><ele-OfficeBuilding /></el-icon>
                  </template>
                </el-input>
              </label>
            </div>
            <nav class="login-tabs" aria-label="登录方式">
              <button
                v-for="method in methods"
                :key="method.key"
                type="button"
                :aria-pressed="current === method.key"
                :class="{ 'is-selected': current === method.key }"
                @click="current = method.key"
              >
                {{ method.title }}
              </button>
            </nav>
            <component
              :is="activeComponent"
              :key="
                current === '3'
                  ? `${current}:${loginContext.loginMode}:${loginContext.tenantId}`
                  : current
              "
              :login-context="loginContext"
              :service-enabled="current !== '2' && config.loginType.includes(current)"
              :captcha-state="config.captchaState"
              :demo-mode="config.demoMode"
              :demo-account="config.demoAccount"
              :demo-password="config.demoPassword"
            />
          </template>
          <div class="login-security">
            <span></span>
            <el-icon><ele-InfoFilled /></el-icon>
            <button @click="helpVisible = true">如需帮助，请联系管理员</button>
            <span></span>
          </div>
        </div>
      </div>
    </section>
    <footer class="page-footer">更灵活的组织管理方式 · 让团队协作更简单</footer>
    <el-dialog v-model="helpVisible" title="登录帮助" width="360px" class="login-help">
      <p>忘记密码或无法登录，请联系本平台或所属租户管理员重置账号密码。</p>
    </el-dialog>
  </main>
</template>
<script setup lang="ts" name="loginIndex">
  import { ref, reactive, computed, onMounted, defineAsyncComponent } from 'vue';
  import { startBase } from '/@/views/system/init';
  import { NextLoading } from '/@/utils/loading';
  import hero from '/@/assets/login-modules.png';
  import { tenantMode } from './index';
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
      title: '手机短信',
      component: defineAsyncComponent(() => import('./component/mobile.vue')),
    },
    {
      key: '3',
      title: '二维码',
      component: defineAsyncComponent(() => import('./component/scan.vue')),
    },
  ];
  const helpVisible = ref(false);
  const multiTenant = ref(false);
  const loginMode = ref('platform');
  const tenantId = ref('');
  const loginContext = computed(() => ({
    tenantId: multiTenant.value && loginMode.value === 'tenant' ? tenantId.value.trim() : '000000',
    loginMode: multiTenant.value ? loginMode.value : 'application',
  }));
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
  const activeComponent = computed(() => methods.find((m) => m.key === current.value)?.component);
  async function loadConfig() {
    loading.value = true;
    error.value = '';
    try {
      const [res, mode] = await Promise.all([startBase(), tenantMode()]);
      multiTenant.value = mode.data.enabled === true;
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
    min-height: 100vh;
    min-height: 100dvh;
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 40px 26px;
    background:
      radial-gradient(ellipse at 23% 30%, #e2efff 0, transparent 58%),
      linear-gradient(135deg, #f8fbff, #edf5ff);
    color: #132340;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  .brand-background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.18;
    z-index: -1;
    pointer-events: none;
  }
  .login-shell {
    width: 100%;
    max-width: 1240px;
    margin: auto;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    padding: 28px 40px 34px;
    box-sizing: border-box;
  }
  .brand-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 36px;
  }
  .brand-name {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .brand-name img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
  .brand-name strong {
    font-size: 30px;
    line-height: 1.2;
    color: #147dff;
    letter-spacing: -1px;
  }
  .brand-name span {
    font-size: 13px;
    color: #526889;
  }
  .brand-motto {
    font-size: 12px;
    color: #6b7f9d;
    letter-spacing: 1px;
  }
  .login-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 400px;
    gap: 48px;
    align-items: center;
  }
  .login-hero {
    position: relative;
    align-self: stretch;
    min-height: 500px;
    padding: 30px 0 0;
    overflow: hidden;
  }
  .login-hero h1 {
    position: relative;
    z-index: 1;
    font-size: 36px;
    line-height: 1.4;
    font-weight: 700;
    margin: 0 0 8px;
    letter-spacing: 1px;
  }
  .hero-subtitle {
    position: relative;
    z-index: 1;
    font-size: 15px;
    color: #576f98;
    margin: 0;
  }
  .hero-features {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 36px;
    margin-top: 30px;
  }
  .hero-features div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .hero-features .el-icon {
    font-size: 25px;
    color: #1687ff;
  }
  .hero-features strong {
    font-size: 13px;
  }
  .hero-features span {
    font-size: 11px;
    color: #8498b7;
  }
  .hero-art {
    display: block;
    width: 100%;
    max-width: 620px;
    margin: -8px 0 -26px;
    mix-blend-mode: multiply;
    mask-image: radial-gradient(ellipse at center, black 48%, transparent 73%);
    pointer-events: none;
  }
  .hero-footnote {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #859dbe;
    font-size: 11px;
    z-index: 1;
  }
  .hero-footnote i {
    display: block;
    width: 30px;
    height: 1px;
    background: #9dbce6;
  }
  .hero-footnote p {
    margin: 12px 0 6px;
    letter-spacing: 1px;
  }
  .hero-footnote span {
    font-size: 9px;
    letter-spacing: 1.5px;
  }
  .login-card {
    background: #ffffffed;
    border: 1px solid #e1ebfa;
    border-radius: 12px;
    padding: 30px 32px;
    box-shadow: 0 8px 30px #558ad009;
    min-width: 0;
  }
  .login-card h2 {
    font-size: 25px;
    line-height: 1.4;
    margin: 0 0 4px;
    font-weight: 700;
  }
  .card-subtitle {
    font-size: 12px;
    color: #7c8da7;
    line-height: 1.6;
    margin: 0 0 22px;
  }
  .entry-switch {
    display: flex;
    gap: 4px;
    margin-bottom: 18px;
  }
  .entry-switch button {
    flex: 1;
    height: 36px;
    border: 1px solid #e3ebf7;
    background: #f2f6fc;
    color: #778baa;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
  }
  .entry-switch button.active {
    color: white;
    background: linear-gradient(135deg, #20a0ff, #1677ff);
    border-color: #1687ff;
    font-weight: 600;
  }
  .tenant-field {
    display: block;
    margin-bottom: 12px;
  }
  .tenant-field > span {
    display: block;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 7px;
  }
  .login-tabs {
    display: flex;
    border-bottom: 1px solid #e6edf7;
    margin-bottom: 20px;
  }
  .login-tabs button {
    flex: 1;
    padding: 13px 0 11px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #7a8dab;
    font-size: 13px;
    cursor: pointer;
  }
  .login-tabs button.is-selected {
    color: #1687ff;
    border-bottom-color: #1687ff;
    font-weight: 600;
  }
  .entry-switch button:focus-visible,
  .login-tabs button:focus-visible {
    outline: 2px solid #1687ff;
    outline-offset: 3px;
  }
  .login-security {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    color: #788ead;
    font-size: 12px;
  }
  .login-security span {
    height: 1px;
    background: #e2eafa;
    flex: 1;
  }
  .login-security button {
    border: 0;
    background: none;
    font-size: 12px;
    color: inherit;
    padding: 0;
    cursor: pointer;
  }
  .page-footer {
    text-align: center;
    font-size: 11px;
    color: #8da0bb;
    padding-top: 24px;
    letter-spacing: 1px;
  }
  .loading-state,
  .error-state {
    padding: 40px 0;
    text-align: center;
    color: #7c8da7;
  }
  .error-state p {
    margin-bottom: 15px;
  }
  :deep(.login-content-form) {
    margin-top: 0 !important;
  }
  :deep(.login-content-title) {
    line-height: 18px;
    font-size: 12px;
    color: #687c9c;
    margin-bottom: 7px;
    width: 100%;
  }
  :deep(.el-input__wrapper) {
    min-height: 42px;
    border-radius: 6px;
    background: #f8faff;
    box-shadow: 0 0 0 1px #dde6f4 inset;
    padding: 0 12px;
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px #1687ff inset;
  }
  :deep(.el-input__inner) {
    font-size: 13px;
  }
  :deep(.el-input__prefix) {
    color: #7d91b0;
  }
  :deep(.el-form-item) {
    margin-bottom: 14px;
  }
  :deep(.login-content-submit) {
    width: 100%;
    height: 44px;
    margin-top: 7px !important;
    background: linear-gradient(125deg, #159aff, #1677ff);
    border: 0;
    border-radius: 6px;
    font-size: 15px;
    letter-spacing: 2px;
  }
  :deep(.login-content-submit:hover) {
    filter: brightness(1.04);
  }
  :deep(.login-help) {
    max-width: calc(100vw - 32px);
  }
  @media (min-width: 1440px) {
    .login-layout {
      grid-template-columns: minmax(0, 1fr) 420px;
      gap: 64px;
    }
    .login-shell {
      padding: 30px 44px 40px;
    }
    .login-card {
      padding: 34px 36px;
    }
    .login-hero h1 {
      font-size: 40px;
    }
  }
  @media (max-width: 1000px) {
    .login-page {
      padding: 30px 24px 24px;
    }
    .login-shell {
      padding: 26px;
    }
    .login-layout {
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 24px;
    }
    .login-hero h1 {
      font-size: 28px;
    }
    .hero-subtitle {
      font-size: 12px;
    }
    .hero-features {
      gap: 18px;
    }
    .hero-features span {
      display: none;
    }
    .brand-motto {
      display: none;
    }
    .login-card {
      padding: 26px;
    }
    .hero-art {
      margin-top: 40px;
    }
  }
  @media (max-width: 760px) {
    .login-page {
      padding: 28px 18px;
      background: linear-gradient(150deg, #f1f7ff, #eaf3ff);
    }
    .login-shell {
      max-width: 440px;
      border: 0;
      background: transparent;
      box-shadow: none;
      padding: 0;
    }
    .brand-header {
      margin-bottom: 24px;
      align-items: flex-start;
    }
    .brand-name {
      flex-wrap: wrap;
      gap: 6px;
    }
    .brand-name strong {
      font-size: 28px;
    }
    .brand-name span {
      flex-basis: 100%;
      font-size: 12px;
    }
    .brand-motto {
      display: block;
      font-size: 11px;
      max-width: 80px;
      line-height: 1.8;
      text-align: right;
      letter-spacing: 0;
    }
    .login-layout {
      display: block;
    }
    .login-hero {
      display: none;
    }
    .login-card {
      padding: 28px 24px;
      box-shadow: 0 12px 36px #7fa8df0a;
    }
    .entry-switch button {
      height: 40px;
    }
    .login-tabs button {
      min-height: 44px;
    }
    :deep(.el-input__wrapper) {
      min-height: 44px;
    }
    :deep(.login-content-submit) {
      height: 46px;
    }
    .page-footer {
      font-size: 10px;
      letter-spacing: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :deep(*) {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
