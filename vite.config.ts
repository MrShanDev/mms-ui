import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv, UserConfigFnObject } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import viteCompression from 'vite-plugin-compression';
import { buildConfig } from './src/utils/build';
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

//处理相对路径（./ , ../），生成一个规范化的绝对路径
const pathResolve = (dir: string) => {

    return resolve(__dirname, '.', dir);
};
// 路径解析函数，方便路径别名配置
const alias: Record<string, string> = {
    '/@': pathResolve('./src/'),
    'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const viteConfig: UserConfigFnObject = defineConfig((mode: ConfigEnv) => {
    const env: Record<string, string> = loadEnv(mode.mode, process.cwd());
    // 设置EventEmitter默认最大监听次数
    require('events').EventEmitter.defaultMaxListeners = 20;
    return {
        plugins: [
            vue(),
            WindiCSS(),
            vueSetupExtend(),
            viteCompression(),
            JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,
            lazyImport({
                resolvers: [
                    VxeResolver({
                        libraryName: 'vxe-table'
                    }),
                    VxeResolver({
                        libraryName: 'vxe-pc-ui'
                    })
                ]
            }),
            AutoImport({
                imports: [
                    'vue',
                    'vue-router',
                ],
                resolvers: [
                    ElementPlusResolver({
                        importStyle: false // 禁用自动导入样式，由预构建处理
                    })
                ],
                dts: resolve('./auto-imports.d.ts')
            }),
            Components({
                resolvers: [
                    ElementPlusResolver({
                        importStyle: false // 禁用自动导入样式，由预构建处理
                    })
                ],
                dts: resolve('./components.d.ts')
            }),
        ],
        root: process.cwd(),
        resolve: { alias },
        base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
        optimizeDeps: {
            include: [
                'vue-demi',
                'element-plus/es/locale/lang/zh-cn',
                'element-plus/es/locale/lang/en',
                // Element Plus 组件样式预构建
                'element-plus/es/components/base/style/index',
                'element-plus/es/components/config-provider/style/index',
                'element-plus/es/components/drawer/style/index',
                'element-plus/es/components/scrollbar/style/index',
                'element-plus/es/components/button/style/index',
                'element-plus/es/components/icon/style/index',
                'element-plus/es/components/alert/style/index',
                'element-plus/es/components/select/style/index',
                'element-plus/es/components/option/style/index',
                'element-plus/es/components/input/style/index',
                'element-plus/es/components/input-number/style/index',
                'element-plus/es/components/switch/style/index',
                'element-plus/es/components/color-picker/style/index',
                'element-plus/es/components/divider/style/index',
                'element-plus/es/components/empty/style/index',
                'element-plus/es/components/tabs/style/index',
                'element-plus/es/components/tab-pane/style/index',
                'element-plus/es/components/form/style/index',
                'element-plus/es/components/image/style/index',
                'element-plus/es/components/col/style/index',
                'element-plus/es/components/form-item/style/index',
                'element-plus/es/components/infinite-scroll/style/index',
                'element-plus/es/components/dialog/style/index',
                'element-plus/es/components/row/style/index',
                'element-plus/es/components/image-viewer/style/index',
                'element-plus/es/components/upload/style/index',
                'element-plus/es/components/container/style/index',
                'element-plus/es/components/aside/style/index',
                'element-plus/es/components/header/style/index',
                'element-plus/es/components/main/style/index',
                'element-plus/es/components/backtop/style/index',
                'element-plus/es/components/menu/style/index',
                'element-plus/es/components/menu-item/style/index',
                'element-plus/es/components/sub-menu/style/index',
                'element-plus/es/components/loading/style/index',
                'element-plus/es/components/breadcrumb/style/index',
                'element-plus/es/components/breadcrumb-item/style/index',
                'element-plus/es/components/popover/style/index',
                'element-plus/es/components/badge/style/index',
                'element-plus/es/components/dropdown/style/index',
                'element-plus/es/components/dropdown-menu/style/index',
                'element-plus/es/components/dropdown-item/style/index',
                'element-plus/es/components/autocomplete/style/index',
                // 常用库预构建
                '@element-plus/icons-vue',
                'vue',
                'vue-router',
                'vue-i18n',
                'pinia',
                'axios',
                'mitt',
                '@vueuse/core',
                'js-cookie',
                'nprogress',
                'echarts',
                'element-plus'
            ],
            exclude: [],
            // 强制预构建，避免运行时发现新依赖
            force: false
        },
        server: {
            host: '0.0.0.0',
            port: env.VITE_PORT as unknown as number, // 端口号g
            hostname: env.VITE_APP_API_URL, // 主机名
            open: JSON.parse(env.VITE_OPEN),// 运行自动打开浏览器
            hmr: true,
            // 强制预构建，减少页面重新加载
            force: false,
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_APP_API_URL,
                    ws: true,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
                },
            },
        },
        build: {
            outDir: 'dist',
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? 'vender';
                        }
                    },
                },
                ...(JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}),
            },
        },
        css: {
            preprocessorOptions: {
                css: { charset: false },
                scss: {
                    silenceDeprecations: ["legacy-js-api"], // 解决报错
                }
            }
        },
        define: {
            __VUE_I18N_LEGACY_API__: JSON.stringify(false),
            __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
            __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
            __NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
            __NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
        },
        lintOnSave: false,
    };
});

export default viteConfig;
