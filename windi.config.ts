import { defineConfig } from 'windicss/helpers'

export default defineConfig({
    darkMode: 'class', // 支持暗黑模式
    preflight: false, // 禁用默认样式重置，避免与项目现有样式冲突
    theme: {
        extend: {
            screens: {
                'sm': '640px',   // 移动端断点
                'md': '768px',   // 平板断点 
                'lg': '1024px',  // 桌面断点
                'xl': '1280px',  // 大屏断点
                '2xl': '1536px', // 超大屏断点
            },
            colors: {
                // 主色系 - 与 mms.scss 保持一致
                primary: '#1e97f8',
                success: '#2dac34',
                warning: '#fe6701', 
                danger: '#f56c6c',
                info: '#909399',
                secondary: '#14171A',
                
                // 灰度色系
                'gray-50': '#f9fafb',
                'gray-100': '#f3f4f6',
                'gray-200': '#e5e7eb',
                'gray-300': '#d1d5db',
                'gray-400': '#9ca3af',
                'gray-500': '#6b7280',
                'gray-600': '#4b5563',
                'gray-700': '#374151',
                'gray-800': '#1f2937',
                'gray-900': '#111827',
            },
            // 统一4px递增的间距系统 - 与 mms.scss 对齐
            spacing: {
                '0': '0',
                '1': '1px',   // sp-1
                '2': '2px',   // sp-2
                '3': '3px',  // sp-3
                '4': '4px',  // sp-4
                '5': '5px',  // sp-5
                '6': '6px',  // sp-6
                '7': '7px',
                '8': '8px',
                '9': '9px',
                '10': '10px',
                '12': '12px',
                '14': '14px',
                '16': '16px',
                '18': '18px',
                '20': '20px',
            },
            // 字体大小 - 与 mms.scss 语义化对齐
            fontSize: {
                'xs': '10px',     // font-xs
                'sm': '12px',     // font-sm  
                'base': '14px',   // font-base
                'md': '16px',     // font-md
                'lg': '18px',     // font-lg
                'xl': '20px',     // font-xl
                '2xl': '24px',    // font-2xl
                '3xl': '30px',    // font-3xl
                
                // 数值字体大小（10-37px）
                '10': '10px', '11': '11px', '12': '12px', '13': '13px', '14': '14px',
                '15': '15px', '16': '16px', '17': '17px', '18': '18px', '19': '19px',
                '20': '20px', '21': '21px', '22': '22px', '23': '23px', '24': '24px',
                '25': '25px', '26': '26px', '27': '27px', '28': '28px', '29': '29px',
                '30': '30px', '31': '31px', '32': '32px', '33': '33px', '34': '34px',
                '35': '35px', '36': '36px', '37': '37px',
            },
            // 扩展宽度 - 与 mms.scss 保持一致  
            width: {
                'auto': 'auto',
                'full': '100%',
                'screen': '100vw',
                
                // 百分比宽度
                '5p': '5%', '10p': '10%', '15p': '15%', '20p': '20%', '25p': '25%',
                '30p': '30%', '33p': '33.333%', '35p': '35%', '40p': '40%', '45p': '45%', 
                '50p': '50%', '55p': '55%', '60p': '60%', '65p': '65%', '66p': '66.666%',
                '70p': '70%', '75p': '75%', '80p': '80%', '85p': '85%', '90p': '90%', 
                '95p': '95%', '100p': '100%',
            },
            // 高度扩展
            height: {
                'auto': 'auto',
                'full': '100%', 
                'screen': '100vh',
            },
            // 动画时长
            animationDuration: {
                'fast': '0.15s',
                'normal': '0.3s', 
                'slow': '0.5s',
            },
            // 过渡时长
            transitionDuration: {
                'fast': '0.15s',
                'normal': '0.3s',
                'slow': '0.5s', 
            },
        },
    },
    plugins: [
        require('windicss/plugin/forms'),      // 表单插件
        require('windicss/plugin/typography'), // 排版插件
        require('windicss/plugin/aspect-ratio'), // 宽高比插件
    ],
    shortcuts: {
        // 🎯 布局快捷类 - 与 mms.scss 命名对齐
        'windi-flex-row': 'flex flex-row',
        'windi-flex-col': 'flex flex-col',
        'windi-center-xy': 'flex items-center justify-center',
        'windi-center-x': 'flex justify-center',
        'windi-center-y': 'flex items-center',
        
        // 🎯 按钮快捷类
        'btn-primary': 'bg-primary text-white px-6 py-3 rounded-md font-medium transition-all duration-normal hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50',
        'btn-secondary': 'bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium transition-all duration-normal hover:bg-gray-300',
        'btn-success': 'bg-success text-white px-6 py-3 rounded-md font-medium transition-all duration-normal hover:bg-green-600',
        'btn-warning': 'bg-warning text-white px-6 py-3 rounded-md font-medium transition-all duration-normal hover:bg-orange-600',
        'btn-danger': 'bg-danger text-white px-6 py-3 rounded-md font-medium transition-all duration-normal hover:bg-red-600',
        
        // 🎯 卡片快捷类
        'card-base': 'bg-white rounded-lg shadow-md p-6 transition-all duration-normal',
        'card-hover': 'bg-white rounded-lg shadow-md p-6 transition-all duration-normal hover:shadow-lg hover:-translate-y-1',
        
        // 🎯 文本快捷类
        'text-primary': 'text-primary',
        'text-muted': 'text-gray-500',
        'text-small': 'text-sm text-gray-600',
        
        // 🎯 向后兼容的别名（避免直接冲突）
        'legacy-flex': 'flex flex-row',
        'legacy-flex-col': 'flex flex-col', 
        'legacy-col-center': 'items-center',
        'legacy-row-center': 'justify-center',
        'legacy-w-l': 'float-left',
        'legacy-w-r': 'float-right',
    },
    // 排除与 mms.scss 冲突的类名
    blocklist: [
        // 避免与自定义样式类冲突
        'lay-*',   // 布局类由 mms.scss 处理
        'sp-*',    // 间距类由 mms.scss 处理
        'font-*',  // 字体类由 mms.scss 处理（部分）
        'anim-*',  // 动画类由 mms.scss 处理
        'interact-*', // 交互类由 mms.scss 处理
        'resp-*',  // 响应式类由 mms.scss 处理
    ],
    // 安全列表 - 确保重要的工具类不被清除
    safelist: [
        'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
        'bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-white', 'bg-gray-100',
        'text-primary', 'text-success', 'text-warning', 'text-danger', 'text-white', 'text-gray-500',
        'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6',
        'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6',
        'w-full', 'h-full', 'w-auto', 'h-auto',
    ],
})
