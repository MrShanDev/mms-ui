import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const mmsUiRoot = fileURLToPath(new URL('../..', import.meta.url));

/**
 * - dev（vite serve）：默认 http://localhost:5175/，与主站 .env.development 的联邦 Remote 联调一致。
 * - build（打 JAR）：默认 ./ ，chunk 与 remoteEntry 同目录树发布，由 /plugin-assets/{pluginId}/{version}/ 提供，避免把 localhost 打进产物。
 * - 任一阶段均可覆盖：MMS_FED_REMOTE_BASE=/plugin-assets/mms.plugin.syslog/1.0.1/
 */
function resolveBase(command: string): string {
  if (process.env.MMS_FED_REMOTE_BASE) {
    const raw = process.env.MMS_FED_REMOTE_BASE.trim();
    return raw.endsWith('/') ? raw : raw + '/';
  }
  return command === 'serve' ? 'http://localhost:5175/' : './';
}

export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: resolveBase(command),
  plugins: [
    vue(),
    federation({
      name: 'mms_plugin_syslog_ui',
      filename: 'remoteEntry.js',
      exposes: {
        './SyslogPage': './src/SyslogPage.vue',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.5.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.3.0' },
        pinia: { singleton: true, requiredVersion: '^2.0.0' },
        'element-plus': { singleton: true, requiredVersion: '^2.11.0' },
      },
    }),
  ],
  resolve: {
    alias: {
      '/@': resolve(mmsUiRoot, 'src'),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
    cors: true,
    origin: 'http://localhost:5175',
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    /**
     * 联邦 `shared.element-plus` 单独成 chunk 约 1MB 属常态，提高阈值避免构建成功仍刷黄条。
     * 真要减体积应在业务侧按需引入 EP 组件，而非压低该阈值。
     */
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        minifyInternalExports: false,
      },
      onwarn(warning, defaultHandler) {
        // Element Plus 依赖的 @vueuse 中部分 #__PURE__ 注释位置会触发 Rollup 提示，与产物无关
        if (warning.message?.includes('annotation that Rollup cannot interpret')) {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
}));
