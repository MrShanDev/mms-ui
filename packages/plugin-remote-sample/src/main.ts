/**
 * 仅用于本包 pnpm dev / preview 本地预览 RemoteApp；联邦 Host 加载时走 remoteEntry 暴露的 ./RemoteApp。
 */
import { createApp } from 'vue';
import RemoteApp from './RemoteApp.vue';

createApp(RemoteApp).mount('#app');
