<template>
  <span
    v-if="isIconifyIcon"
    class="svg-icon-container iconify-container"
    :style="iconStyle"
    :class="className"
    v-bind="$attrs"
  >
    <IconifyIcon
      :icon="iconName"
      :style="{ width: '1em', height: '1em' }"
    />
  </span>
  <span
    v-else-if="isElementIcon"
    class="svg-icon-container element-container"
    :style="iconStyle"
    :class="className"
    v-bind="$attrs"
  >
    <component
      :is="elementIconComponent"
      :style="{ width: '1em', height: '1em' }"
    />
  </span>
  <span
    v-else-if="isFontIcon"
    class="svg-icon-container font-container"
    :style="iconStyle"
    :class="className"
    v-bind="$attrs"
  >
    <i
      :class="iconName"
      :style="{ width: '1em', height: '1em', fontSize: '1em' }"
    />
  </span>
  <span
    v-else-if="isSvgIcon"
    class="svg-icon-container svg-container"
    :style="iconStyle"
    :class="className"
    v-bind="$attrs"
  >
    <svg
      :style="{ width: '1em', height: '1em' }"
      aria-hidden="true"
    >
      <use :xlink:href="iconName" />
    </svg>
  </span>
  <span
    v-else
    class="svg-icon-container fallback-container"
    :style="iconStyle"
    :class="className"
    v-bind="$attrs"
  >
    {{ iconName }}
  </span>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent } from 'vue';
  import { Icon as IconifyIcon } from '@iconify/vue';
  import * as ElIcons from '@element-plus/icons-vue';

  // 定义组件选项，确保事件和属性正确传递
  defineOptions({
    inheritAttrs: false
  });

  interface Props {
    /** 图标名称或图标代码（主要属性名） */
    name?: string;
    /** 图标名称（兼容旧版本） */
    icon?: string;
    /** 图标颜色 */
    color?: string;
    /** 图标大小，支持数字(px)或字符串 */
    size?: string | number;
    /** 自定义class */
    className?: string;
    /** 自定义样式，支持对象或字符串格式 */
    customStyle?: Record<string, any> | string;
    /** 图标类型，auto自动识别 */
    type?: 'auto' | 'element' | 'iconify' | 'iconfont' | 'svg' | 'font';
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    icon: '',
    color: '',
    size: '',
    className: '',
    customStyle: undefined,
    type: 'auto'
  });

  // 获取实际的图标名称（兼容 name 和 icon 两种属性）
  const actualIconName = computed(() => props.name || props.icon || '');

  // 计算图标样式
  const iconStyle = computed(() => {
    const style: Record<string, any> = {};
    if (props.color) style.color = props.color;
    if (props.size) {
      const size = typeof props.size === 'number' ? `${props.size}px` : props.size;
      style.fontSize = size;
      style.width = size;
      style.height = size;
      // 确保所有图标类型都有统一的行高
      style.lineHeight = '1';
    }
    
    // 合并自定义样式
    if (props.customStyle) {
      if (typeof props.customStyle === 'string') {
        // 如果是字符串格式，通过 cssText 属性应用
        return { ...style, cssText: props.customStyle };
      } else {
        // 如果是对象格式，直接合并
        Object.assign(style, props.customStyle);
      }
    }
    
    return style;
  });

  // 判断是否为 Iconify 图标（包含 : 分隔符）
  const isIconifyIcon = computed(() => {
    if (props.type === 'iconify') return true;
    if (props.type !== 'auto') return false;
    return actualIconName.value.includes(':');
  });

  // 判断是否为 Element Plus 图标（ele- 前缀）
  const isElementIcon = computed(() => {
    if (props.type === 'element') return true;
    if (props.type !== 'auto') return false;
    return actualIconName.value.startsWith('ele-');
  });

  // 判断是否为字体图标（fa-, iconfont 等前缀）
  const isFontIcon = computed(() => {
    if (props.type === 'font' || props.type === 'iconfont') return true;
    if (props.type !== 'auto') return false;
    return (
      actualIconName.value.startsWith('fa') ||
      actualIconName.value.startsWith('fa-') ||
      actualIconName.value.startsWith('fas ') ||
      actualIconName.value.startsWith('far ') ||
      actualIconName.value.startsWith('fab ') ||
      actualIconName.value.startsWith('fal ') ||
      actualIconName.value.startsWith('fad ') ||
      actualIconName.value.includes('iconfont')
    );
  });

  // 判断是否为 SVG sprite 图标（使用 # 前缀）
  const isSvgIcon = computed(() => {
    if (props.type === 'svg') return true;
    if (props.type !== 'auto') return false;
    return (
      !isIconifyIcon.value &&
      !isElementIcon.value &&
      !isFontIcon.value &&
      (actualIconName.value.startsWith('#') || actualIconName.value.startsWith('icon-'))
    );
  });

  // Element Plus 图标组件
  const elementIconComponent = computed(() => {
    const iconName = actualIconName.value.replace('ele-', '');
    return (ElIcons as any)[iconName] || null;
  });

  // 计算最终的图标名称
  const iconName = computed(() => {
    if (isIconifyIcon.value) {
      return actualIconName.value; // Iconify 图标保持原样
    }
    
    if (isElementIcon.value) {
      return actualIconName.value; // Element 图标保持原样，由组件处理
    }
    
    if (isFontIcon.value) {
      return actualIconName.value; // 字体图标保持原样
    }
    
    if (isSvgIcon.value) {
      // SVG sprite 图标处理
      if (actualIconName.value.startsWith('#')) {
        return actualIconName.value;
      }
      // iconfont 图标添加前缀
      return `#icon-${actualIconName.value.replace('icon-', '')}`;
    }
    
    return actualIconName.value;
  });
</script>

<style scoped>
  /* 统一所有图标容器的基础样式 */
  .svg-icon-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 1;
    flex-shrink: 0;
  }

  /* SVG 图标容器特定样式 */
  .svg-container svg {
    display: block;
    fill: currentColor;
    overflow: hidden;
  }

  /* 字体图标容器特定样式 */
  .font-container i {
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: normal;
    text-align: center;
  }

  /* Element Plus 图标容器样式 */
  .element-container :deep(.el-icon) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Iconify 图标容器样式 */
  .iconify-container :deep(.iconify) {
    display: block;
  }

  /* 确保所有类型的图标都有相同的基础尺寸 */
  .svg-icon-container svg,
  .svg-icon-container i,
  .svg-icon-container :deep(.el-icon),
  .svg-icon-container :deep(.iconify) {
    width: 1em !important;
    height: 1em !important;
    font-size: inherit;
  }

  /* 统一字体图标的对齐方式 */
  :deep([class*="fa-"]),
  :deep([class*="icon-"]),
  :deep([class*="iconfont"]) {
    line-height: 1;
    vertical-align: baseline;
  }

  /* 处理特殊情况下的尺寸问题 */
  .fallback-container {
    font-family: monospace;
    font-size: 0.8em;
    color: #999;
  }
</style>
