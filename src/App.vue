<template>
  <el-config-provider :size="getGlobalComponentSize" :locale="getGlobalI18n">
    <!--  路由  -->
    <router-view v-show="setLockScreen" />
    <!--  锁屏组件  -->
    <LockScreen v-if="themeConfig.isLockScreen" />
    <!--  主题布局设置  -->
    <Setings ref="setingsRef" v-show="setLockScreen" />
    <!--  tags右键菜单  -->
    <CloseFull v-if="!themeConfig.isLockScreen" />
    <!--  版本升级  -->
    <!--<Upgrade v-if="getVersion" />-->
    <!--  右下角广告弹框  -->
    <!--<Sponsors />-->
  </el-config-provider>
</template>

<script setup lang="ts" name="app">
  import {
    defineAsyncComponent,
    computed,
    ref,
    onBeforeMount,
    onMounted,
    onUnmounted,
    nextTick,
    watch,
  } from 'vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
  import { loadThemePreferences } from '/@/utils/themePreferences';
  import { useThemeConfig } from '/@/stores/themeConfig';
  import other from '/@/utils/other';
  import { Local, Session } from '/@/utils/storage';
  import mittBus from '/@/utils/mitt';
  import setIntroduction from '/@/utils/setIconfont';

  // 引入组件
  const LockScreen = defineAsyncComponent(() => import('/@/layout/lockScreen/index.vue'));
  const Setings = defineAsyncComponent(() => import('/@/layout/navBars/topBar/setings.vue'));
  const CloseFull = defineAsyncComponent(() => import('/@/layout/navBars/topBar/closeFull.vue'));
  // eslint-disable-next-line no-unused-vars
  const Upgrade = defineAsyncComponent(() => import('/@/layout/upgrade/index.vue'));
  // eslint-disable-next-line no-unused-vars
  const Sponsors = defineAsyncComponent(() => import('/@/layout/sponsors/index.vue'));

  // 定义变量内容
  const { messages, locale } = useI18n();
  const setingsRef = ref();
  const route = useRoute();
  const stores = useTagsViewRoutes();
  const storesThemeConfig = useThemeConfig();
  const { themeConfig } = storeToRefs(storesThemeConfig);

  // 设置锁屏时组件显示隐藏
  const setLockScreen = computed(() => {
    return themeConfig.value.isLockScreen
      ? themeConfig.value.lockScreenTime > 1
      : themeConfig.value.lockScreenTime >= 0;
  });
  // 获取版本号
  // eslint-disable-next-line no-unused-vars
  const getVersion = computed(() => {
    let isVersion = false;
    if (route.path !== '/login') {
      // @ts-ignore
      if ((Local.get('version') && Local.get('version')) || !Local.get('version')) isVersion = true;
    }
    return isVersion;
  });
  // 获取全局组件大小
  const getGlobalComponentSize = computed(() => {
    return other.globalComponentSize();
  });
  // 获取全局 i18n
  const getGlobalI18n = computed(() => {
    return messages.value[locale.value];
  });
  // 设置初始化，防止刷新时恢复默认
  onBeforeMount(() => {
    // 设置批量第三方 icon 图标
    setIntroduction.cssCdn();
    // 设置批量第三方 js
    setIntroduction.jsCdn();
  });
  const openSettingsDrawer = () => {
    themeConfig.value.isDrawer = true;
  };
  // 页面加载时：须先读本地缓存再合并进 store，禁止先用默认 store 覆盖写入 Local（否则刷新后配色永远回到默认）
  onMounted(() => {
    nextTick(() => {
      mittBus.on('openSetingsDrawer', openSettingsDrawer);
      const cachedTheme = Local.get('themeConfig');
      if (cachedTheme) {
        storesThemeConfig.setThemeConfig({ themeConfig: cachedTheme });
        const cachedStyle = Local.get('themeConfigStyle');
        if (cachedStyle) {
          document.documentElement.style.cssText = cachedStyle;
        }
      }
      loadThemePreferences();
      if (Session.get('isTagsViewCurrenFull')) {
        stores.setCurrenFullscreen(Session.get('isTagsViewCurrenFull'));
      }
    });
  });
  // 页面销毁时，关闭监听布局配置/i18n监听
  onUnmounted(() => {
    mittBus.off('openSetingsDrawer', openSettingsDrawer);
  });
  watch(
    () => route.path,
    () => {
      loadThemePreferences();
    }
  );
  // 监听路由的变化，设置网站标题
  watch(
    () => route.path,
    () => {
      other.useTitle();
    },
    {
      deep: true,
    }
  );
</script>

<style></style>
