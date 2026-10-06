import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const mmsUiRoot = fileURLToPath(new URL('../..', import.meta.url));

function resolveBase(command: string): string {
  if (process.env.MMS_FED_REMOTE_BASE) {
    const raw = process.env.MMS_FED_REMOTE_BASE.trim();
    return raw.endsWith('/') ? raw : raw + '/';
  }
  return command === 'serve' ? 'http://localhost:5177/' : './';
}

export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  envDir: mmsUiRoot,
  base: resolveBase(command),
  plugins: [
    vue(),
    federation({
      name: 'mms_plugin_site_ui',
      filename: 'remoteEntry.js',
      exposes: {
        './WebsiteConfigPage': './src/pages/WebsiteConfigPage.vue',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.5.0', import: false, generate: false },
        'vue-router': { singleton: true, requiredVersion: '^4.3.0', import: false, generate: false },
        pinia: { singleton: true, requiredVersion: '^2.0.0', import: false, generate: false },
        'element-plus': { singleton: true, requiredVersion: '^2.11.0', import: false, generate: false },
      },
    }),
  ],
  resolve: {
    alias: {
      '/@': resolve(mmsUiRoot, 'src'),
      '@mms-ui/plugin-common-kit': resolve(mmsUiRoot, 'packages/plugin-common-kit/src'),
    },
  },
  server: {
    port: 5177,
    strictPort: true,
    cors: true,
    origin: 'http://localhost:5177',
    proxy: {
      '/prod-api': { target: 'http://localhost:81', changeOrigin: true },
    },
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
      onwarn(warning, warn) {
        // 忽略第三方预打包产物中的 #__PURE__ 位置不当警告（无实际影响）
        if (
          warning.code === 'THIS_IS_UNDEFINED' ||
          (warning.message != null && warning.message.includes('contains an annotation that Rollup cannot interpret'))
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
}));
