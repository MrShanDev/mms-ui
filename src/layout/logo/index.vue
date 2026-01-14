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
  .layout-logo {
<<<<<<< HEAD
    width: 185px;
    height: 50px;
=======
    width: 200px;
    height: 130px;
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
    background: #4487EC;
    color: var(--el-color-white);
    font-size: 16px;
    cursor: pointer;
    animation: logoAnimation 0.3s ease-in-out;
    border-bottom-right-radius: 10px;
    
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
      width: 50px;
      margin-bottom: 10px;
    }
  }
  .layout-logo-size {
    width: 100%;
    height: 50px;
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
