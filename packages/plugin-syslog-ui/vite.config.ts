import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const mmsUiRoot = fileURLToPath(new URL('../..', import.meta.url));

/** 本地联调默认与 Host .env.development 的 VITE_SYSLOG_REMOTE_ENTRY 一致（5175 + /assets/remoteEntry.js） */
const remoteBase =
  process.env.MMS_FED_REMOTE_BASE ?? 'http://localhost:5175/';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: remoteBase,
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
});
