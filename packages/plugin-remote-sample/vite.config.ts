import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

/** mms-ui 仓库根（含 src/、node_modules/） */
const mmsUiRoot = fileURLToPath(new URL('../..', import.meta.url));

/**
 * 生产构建的 publicPath 需与后端 /plugin-assets/{pluginId}/{version}/ 一致（见 version/v2.0.4）。
 * 本地联调可改为 http://localhost:5174/（与本包 dev 端口一致）。
 */
const remoteBase =
  process.env.MMS_FED_REMOTE_BASE ?? '/plugin-assets/com.sxpcwlkj.plugin.remote.sample/1.0.0/';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: remoteBase,
  plugins: [
    vue(),
    federation({
      name: 'mms_plugin_remote_sample',
      filename: 'remoteEntry.js',
      exposes: {
        // Host 菜单 component 约定 federation:RemoteApp@mms_plugin_remote_sample 时可映射到此
        './RemoteApp': './src/RemoteApp.vue',
      },
      // 与 Host 对齐；若 Remote 内使用 Element 组件，请取消注释 element-plus，避免双实例
      shared: {
        vue: { singleton: true, requiredVersion: '^3.5.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.3.0' },
        pinia: { singleton: true, requiredVersion: '^2.0.0' },
        // 'element-plus': { singleton: true, requiredVersion: '^2.11.0' },
      },
    }),
  ],
  resolve: {
    alias: {
      '/@': resolve(mmsUiRoot, 'src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    cors: true,
    origin: `http://localhost:5174`,
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
