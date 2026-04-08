<template>
  <div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
    <img :src="logoMini" class="layout-logo-medium-img" />
    <div>{{ themeConfig.globalTitle }}</div>
  </div>
  <div class="layout-logo-size" v-else @click="onThemeConfigChange">
    <img :src="logoMini" class="layout-logo-size-img" />
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
  /* 与右侧顶栏第一行同高：见 --layout-topbar-row-height（窄屏见 media/layout.scss） */
  .layout-logo {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    height: var(--layout-topbar-row-height);
    min-height: var(--layout-topbar-row-height);
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    text-align: left;
    flex-shrink: 0;
    box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
    background: #4487EC;
    color: var(--el-color-white);
    font-size: 14px;
    cursor: pointer;
    animation: logoAnimation 0.3s ease-in-out;
    border-bottom-right-radius: 10px;

    > div {
      line-height: 1.3;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      white-space: nowrap;
      display: inline-block;
    }
    &:hover {
      span {
        color: var(--color-primary-light-2);
      }
    }
    &-medium-img {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      object-fit: contain;
    }
  }
  .layout-logo-size {
    width: 100%;
    height: var(--layout-topbar-row-height);
    min-height: var(--layout-topbar-row-height);
    display: flex;
    cursor: pointer;
    animation: logoAnimation 0.3s ease-in-out;
    &-img {
      width: 20px;
      margin: auto;
    }
    &:hover {
      img {
        animation: logoAnimation 0.3s ease-in-out;
      }
    }
  }
</style>
