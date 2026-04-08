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
  return command === 'serve' ? 'http://localhost:5176/' : './';
}

export default defineConfig(({ command }) => ({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: resolveBase(command),
  plugins: [
    vue(),
    federation({
      name: 'mms_plugin_doc_ui',
      filename: 'remoteEntry.js',
      exposes: {
        './DocConfigPage': './src/pages/DocConfigPage.vue',
        './DocProductPage': './src/pages/DocProductPage.vue',
        './DocOrderPage': './src/pages/DocOrderPage.vue',
        './DocAuthorizeUserPage': './src/pages/DocAuthorizeUserPage.vue',
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
    port: 5176,
    strictPort: true,
    cors: true,
    origin: 'http://localhost:5176',
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
