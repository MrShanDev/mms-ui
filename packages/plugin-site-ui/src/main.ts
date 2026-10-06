import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import WebsiteConfigPage from './pages/WebsiteConfigPage.vue';

createApp(WebsiteConfigPage).use(createPinia()).use(ElementPlus).mount('#app');
