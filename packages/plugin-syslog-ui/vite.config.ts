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
    rollupOptions: {
      output: {
        minifyInternalExports: false,
      },
    },
  },
}));
