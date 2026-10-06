<template>
  <div
    class="layout-logo"
    v-if="setShowLogo"
    @click="onThemeConfigChange"
    role="button"
    tabindex="0"
    :aria-label="themeConfig.globalTitle"
    @keydown.enter.prevent="onThemeConfigChange"
    @keydown.space.prevent="onThemeConfigChange"
  >
    <span class="brand-mark"><img :src="logoMini" class="layout-logo-medium-img" alt="" /></span>
    <div class="brand-name" :title="themeConfig.globalTitle">{{ themeConfig.globalTitle }}</div>
  </div>
  <div
    class="layout-logo-size"
    v-else
    @click="onThemeConfigChange"
    role="button"
    tabindex="0"
    :aria-label="themeConfig.globalTitle"
    @keydown.enter.prevent="onThemeConfigChange"
    @keydown.space.prevent="onThemeConfigChange"
  >
    <span class="brand-mark"><img :src="logoMini" class="layout-logo-size-img" alt="" /></span>
  </div>
</template>

<script setup lang="ts" name="layoutLogo">
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useThemeConfig } from '/@/stores/themeConfig';
  import logoMini from '/@/assets/logo-mini.png';

  // 定义变量内容
  const storesThemeConfig = useThemeConfig();
  const { themeConfig } = storeToRefs(storesThemeConfig);

  // 设置 logo 的显示。classic 经典布局默认显示 logo
  const setShowLogo = computed(() => {
    let { isCollapse, layout } = themeConfig.value;
    return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
  });
  // logo 点击实现菜单展开/收起
  const onThemeConfigChange = () => {
    if (themeConfig.value.layout === 'transverse') return false;
    themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
  };
</script>

<style scoped lang="scss">
  .layout-logo,
  .layout-logo-size {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    height: var(--layout-topbar-row-height);
    min-height: var(--layout-topbar-row-height);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 14px;
    flex-shrink: 0;
    background: var(--next-bg-logoBar);
    background: var(--next-bg-logoBar);
    color: var(--next-bg-logoBarColor, #fff);
    border-bottom: 1px solid var(--el-border-color-light);
    cursor: pointer;
    transition: background-color 180ms ease;
    &:hover {
      background: color-mix(in srgb, var(--next-bg-logoBar) 94%, #fff);
      .brand-mark {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgb(0 21 41 / 10%);
      }
    }
    &:focus-visible {
      outline: 2px solid var(--el-color-primary);
      outline-offset: -3px;
    }
  }
  .brand-mark {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: #fff;
    border: 1px solid rgb(0 21 41 / 6%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease;
    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }
  }
  .brand-name {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .layout-logo-size {
    padding: 0 6px;
    .brand-mark {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .layout-logo,
    .layout-logo-size,
    .brand-mark {
      transition: none;
    }
    .layout-logo:hover .brand-mark,
    .layout-logo-size:hover .brand-mark {
      transform: none;
    }
  }
</style>
