<template>
  <section class="scheduler-page" v-loading="checking" element-loading-text="正在检查定时服务">
    <div v-if="error" class="scheduler-error" role="status" aria-live="polite">
      <header class="service-header">
        <div class="service-heading">
          <el-icon><Calendar /></el-icon>
          <div>
            <h1>任务调度服务</h1>
            <p>PowerJob · 定时任务与分布式调度</p>
          </div>
        </div>
        <el-tag type="warning" effect="light" round>
          <el-icon><Warning /></el-icon>
          服务不可用
        </el-tag>
      </header>
      <div class="service-state">
        <div class="service-illustration" aria-hidden="true">
          <el-icon class="server-icon"><SetUp /></el-icon>
          <span class="warning-badge">
            <el-icon><WarningFilled /></el-icon>
          </span>
        </div>
        <h2>定时服务未启动或者地址有误</h2>
        <p class="state-description">{{ error }}</p>
        <div class="connection-details">
          <div>
            <el-icon><Link /></el-icon>
            <span>访问地址</span>
            <code>{{ serviceUrl }}</code>
          </div>
          <div>
            <el-icon><Connection /></el-icon>
            <span>默认端口</span>
            <code>7700</code>
          </div>
        </div>
        <div class="service-actions">
          <el-button type="primary" :icon="RefreshRight" @click="checkService">重新检查</el-button>
          <el-button
            tag="a"
            :icon="TopRight"
            :href="serviceUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            新窗口打开
          </el-button>
        </div>
        <p class="service-hint">
          <el-icon><InfoFilled /></el-icon>
          启动 PowerJob 服务后，点击重新检查。
        </p>
      </div>
    </div>
    <iframe
      v-else-if="ready"
      :key="frameKey"
      :src="serviceUrl"
      title="定时任务调度控制台"
      @error="onFrameError"
    />
  </section>
</template>
<script setup lang="ts" name="toolsPowerjob">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import {
    Calendar,
    Warning,
    WarningFilled,
    SetUp,
    Link,
    Connection,
    RefreshRight,
    TopRight,
    InfoFilled,
  } from '@element-plus/icons-vue';
  const serviceUrl = import.meta.env.VITE_POWERJOB_URL || '/mms-job/';
  const checking = ref(false);
  const ready = ref(false);
  const error = ref('');
  const frameKey = ref(0);
  let controller: AbortController | undefined;
  const onFrameError = () => {
    ready.value = false;
    error.value = '无法加载任务调度控制台，请检查服务状态及反向代理配置。';
  };
  const checkService = async () => {
    controller?.abort();
    const current = new AbortController();
    controller = current;
    checking.value = true;
    ready.value = false;
    error.value = '';
    const timeout = setTimeout(() => current.abort(), 7000);
    try {
      const url = new URL(serviceUrl, location.origin);
      if (
        !['http:', 'https:'].includes(url.protocol) ||
        (url.origin === location.origin && url.pathname === '/')
      ) {
        throw new Error('调度地址配置无效，请配置独立的任务调度地址。');
      }
      const response = await fetch(url, {
        signal: current.signal,
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!response.ok)
        throw new Error(`服务返回 HTTP ${response.status}，请检查定时服务与代理地址。`);
      const html = await response.text();
      if (html.includes('/src/main.ts') || html.includes('<title>模块化管理系统</title>')) {
        throw new Error(
          '该地址返回了管理后台页面，请将 /mms-job/ 代理到 PowerJob 服务 7700 端口。'
        );
      }
      if (current !== controller) return;
      frameKey.value++;
      ready.value = true;
    } catch (cause) {
      if (current !== controller) return;
      error.value =
        cause instanceof Error && cause.name !== 'AbortError' && cause.name !== 'TypeError'
          ? cause.message
          : '连接失败或超时，请检查定时服务是否启动、地址及代理配置；跨域地址需要允许状态检查。';
    } finally {
      clearTimeout(timeout);
      if (current === controller) checking.value = false;
    }
  };
  onMounted(checkService);
  onBeforeUnmount(() => {
    controller?.abort();
    controller = undefined;
  });
</script>
<style scoped lang="scss">
  .scheduler-page {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 480px;
    background: var(--el-bg-color-page);
    overflow: auto;
  }
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 75vh;
    border: 0;
  }
  .scheduler-error {
    margin: 24px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 18px;
    background: var(--el-bg-color);
    overflow: hidden;
  }
  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 24px 30px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    .el-tag {
      flex-shrink: 0;
    }
  }
  .service-heading {
    display: flex;
    align-items: center;
    gap: 14px;
    > .el-icon {
      font-size: 24px;
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
      border-radius: 12px;
      padding: 12px;
      box-sizing: content-box;
    }
    h1 {
      margin: 0 0 5px;
      font-size: 19px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    p {
      margin: 0;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
  .service-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px 38px;
    text-align: center;
    background: radial-gradient(ellipse at top, var(--el-color-primary-light-9), transparent 62%);
    h2 {
      margin: 26px 0 12px;
      font-size: 23px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  .service-illustration {
    position: relative;
    display: grid;
    place-items: center;
    width: 100px;
    height: 100px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-color-primary-light-7);
    border-radius: 28px;
    box-shadow: 0 10px 30px var(--el-color-primary-light-9);
    .server-icon {
      font-size: 48px;
      color: var(--el-color-primary);
    }
  }
  .warning-badge {
    position: absolute;
    right: -8px;
    bottom: -8px;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 4px solid var(--el-bg-color);
    border-radius: 50%;
    background: var(--el-color-warning-light-9);
    color: var(--el-color-warning);
    font-size: 24px;
  }
  .state-description {
    max-width: 580px;
    margin: 0;
    line-height: 1.8;
    font-size: 14px;
    color: var(--el-text-color-secondary);
    overflow-wrap: anywhere;
  }
  .connection-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: min(100%, 520px);
    gap: 12px;
    margin: 28px 0;
    > div {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: var(--el-fill-color-light);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 10px;
      min-width: 0;
    }
    .el-icon {
      color: var(--el-text-color-secondary);
    }
    span {
      color: var(--el-text-color-secondary);
      font-size: 12px;
      white-space: nowrap;
    }
    code {
      margin-left: auto;
      font-size: 13px;
      color: var(--el-text-color-primary);
      overflow-wrap: anywhere;
    }
  }
  .service-actions {
    display: flex;
    gap: 12px;
    .el-button {
      margin: 0;
      border-radius: 8px;
      min-height: 40px;
    }
  }
  .service-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 20px 0 0;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
  }
  @media (max-width: 600px) {
    .scheduler-error {
      margin: 12px;
    }
    .service-header {
      padding: 18px;
      flex-wrap: wrap;
    }
    .service-state {
      padding: 32px 18px;
      h2 {
        font-size: 19px;
      }
    }
    .connection-details {
      grid-template-columns: 1fr;
    }
    .service-actions {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
</style>
