<template>
  <div class="layout-navbars-breadcrumb-user pr15" :style="{ flex: layoutUserFlexNum }">
    <!-- 与工具图标分开：小屏可仅隐藏 extras，保留搜索框 -->
    <div class="search-section hvr-backward">
      <el-input
        placeholder="搜索"
        :prefix-icon="eleSearchIcon"
        clearable
        class="search-input"
        @click="onSearchClick"
      />
    </div>
    <Search ref="searchRef" class="topbar-search-host" />
    <div class="layout-navbars-breadcrumb-user-extras">
      <el-dropdown
        :show-timeout="70"
        :hide-timeout="50"
        trigger="click"
        @command="onComponentSizeChange"
      >
        <div class="layout-navbars-breadcrumb-user-icon">
          <i class="iconfont icon-ziti" :title="$t('message.user.title0')"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="large" :disabled="state.disabledSize === 'large'">
              {{ $t('message.user.dropdownLarge') }}
            </el-dropdown-item>
            <el-dropdown-item command="default" :disabled="state.disabledSize === 'default'">
              {{ $t('message.user.dropdownDefault') }}
            </el-dropdown-item>
            <el-dropdown-item command="small" :disabled="state.disabledSize === 'small'">
              {{ $t('message.user.dropdownSmall') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown
        :show-timeout="70"
        :hide-timeout="50"
        trigger="click"
        @command="onLanguageChange"
      >
        <div class="layout-navbars-breadcrumb-user-icon">
          <i
            class="iconfont"
            :class="state.disabledI18n === 'en' ? 'icon-yuyanyingwen' : 'icon-zhongwen'"
            :title="$t('message.user.title1')"
          ></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-cn" :disabled="state.disabledI18n === 'zh-cn'">
              简体中文
            </el-dropdown-item>
            <el-dropdown-item command="en" :disabled="state.disabledI18n === 'en'">
              English
            </el-dropdown-item>
            <el-dropdown-item command="zh-tw" :disabled="state.disabledI18n === 'zh-tw'">
              繁體中文
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
        <el-icon :title="$t('message.user.title2')">
          <ele-Search />
        </el-icon>
      </div>
      <div class="layout-navbars-breadcrumb-user-icon" @click="onLayoutSetingClick">
        <i class="iconfont icon-zhutise" :title="$t('message.user.title3')"></i>
      </div>
      <div
        class="layout-navbars-breadcrumb-user-icon"
        ref="userNewsBadgeRef"
        v-click-outside="onUserNewsClick"
      >
        <el-badge :is-dot="true">
          <el-icon :title="$t('message.user.title4')">
            <ele-Bell />
          </el-icon>
        </el-badge>
      </div>
      <el-popover
        ref="userNewsRef"
        :virtual-ref="userNewsBadgeRef"
        placement="bottom"
        trigger="click"
        transition="el-zoom-in-top"
        virtual-triggering
        :width="300"
        :persistent="false"
      >
        <UserNews />
      </el-popover>
      <div class="layout-navbars-breadcrumb-user-icon mr10" @click="onScreenfullClick">
        <i
          class="iconfont"
          :title="state.isScreenfull ? $t('message.user.title6') : $t('message.user.title5')"
          :class="!state.isScreenfull ? 'icon-quanping' : 'icon-quxiaoquanping'"
        ></i>
      </div>
    </div>
    <el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
      <span class="layout-navbars-breadcrumb-user-link">
        <img
          :src="userInfos?.photo || 'https://sxpcwlkj.oss-cn-beijing.aliyuncs.com/defimg.png'"
          class="layout-navbars-breadcrumb-user-link-photo mr5"
        />
        {{ userInfos?.userName || '当前用户' }}
        <el-icon class="el-icon--right">
          <ele-ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="/index">{{ $t('message.user.dropdown1') }}</el-dropdown-item>
          <el-dropdown-item command="/personal">
            {{ $t('message.user.dropdown2') }}
          </el-dropdown-item>
          <el-dropdown-item divided command="logOut">
            {{ $t('message.user.dropdown5') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUser">
  import { defineAsyncComponent, ref, unref, computed, reactive, onMounted } from 'vue';
  import { Search as eleSearchIcon } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  import { ElMessageBox, ElMessage, ClickOutside as vClickOutside } from 'element-plus';
  import screenfull from 'screenfull';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { useUserInfo } from '/@/stores/userInfo';
  import { useThemeConfig } from '/@/stores/themeConfig';
  import other from '/@/utils/other';
  import mittBus from '/@/utils/mitt';
  import { Session, Local } from '/@/utils/storage';
  import { logout } from '/@/views/system/login';
  import { isEmpty, tansParams } from '/@/utils/mms';
  // 引入 api 请求接口

  // 引入组件
  const UserNews = defineAsyncComponent(() => import('/@/layout/navBars/topBar/userNews.vue'));
  const Search = defineAsyncComponent(() => import('/@/layout/navBars/topBar/search.vue'));

  // 定义变量内容
  const userNewsRef = ref();
  const userNewsBadgeRef = ref();
  const { locale, t } = useI18n();
  const router = useRouter();
  const stores = useUserInfo();
  const storesThemeConfig = useThemeConfig();
  const { userInfos } = storeToRefs(stores);
  const { themeConfig } = storeToRefs(storesThemeConfig);
  const searchRef = ref();
  const state = reactive({
    isScreenfull: false,
    disabledI18n: 'zh-cn',
    disabledSize: 'large',
  });

  // 设置分割样式
  const layoutUserFlexNum = computed(() => {
    let num: string | number = '';
    const { layout, isClassicSplitMenu } = themeConfig.value;
    const layoutArr: string[] = ['defaults', 'columns'];
    if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
    else num = '';
    return num;
  });
  // 全屏点击时
  const onScreenfullClick = () => {
    if (!screenfull.isEnabled) {
      ElMessage.warning('暂不不支持全屏');
      return false;
    }
    screenfull.toggle();
    screenfull.on('change', () => {
      if (screenfull.isFullscreen) state.isScreenfull = true;
      else state.isScreenfull = false;
    });
  };
  // 消息通知点击时
  const onUserNewsClick = () => {
    unref(userNewsRef)?.popperRef?.delayHide?.();
  };
  // 布局配置 icon 点击时
  const onLayoutSetingClick = () => {
    mittBus.emit('openSetingsDrawer');
  };
  // 下拉菜单点击时
  const onHandleCommandClick = (path: string) => {
    if (path === 'logOut') {
      ElMessageBox({
        closeOnClickModal: false,
        closeOnPressEscape: false,
        title: t('message.user.logOutTitle'),
        message: t('message.user.logOutMessage'),
        showCancelButton: true,
        confirmButtonText: t('message.user.logOutConfirm'),
        cancelButtonText: t('message.user.logOutCancel'),
        buttonSize: 'default',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = t('message.user.logOutExit');
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 700);
          } else {
            done();
          }
        },
      })
        .then(async () => {
          // 服务不可用时仍释放当前浏览器的登录状态。
          try {
            await logout();
          } catch {
            ElMessage.warning('退出请求未完成，已清除本地登录状态');
          } finally {
            Session.clear();
            window.location.replace(`${window.location.pathname}#/login`);
          }
        })
        .catch(() => {});
    } else if (path === 'wareHouse') {
      window.open('https://www.sxpcwlkj.com/htmls/index.html');
    } else {
      router.push(path);
    }
  };
  // 菜单搜索点击
  const onSearchClick = () => {
    searchRef.value.openSearch();
  };
  // 组件大小改变
  const onComponentSizeChange = (size: string) => {
    Local.remove('themeConfig');
    themeConfig.value.globalComponentSize = size;
    Local.set('themeConfig', themeConfig.value);
    initI18nOrSize('globalComponentSize', 'disabledSize');
    window.location.reload();
  };
  // 语言切换
  const onLanguageChange = (lang: string) => {
    Local.remove('themeConfig');
    themeConfig.value.globalI18n = lang;
    Local.set('themeConfig', themeConfig.value);
    locale.value = lang;
    other.useTitle();
    initI18nOrSize('globalI18n', 'disabledI18n');
  };
  // 初始化组件大小/i18n
  const initI18nOrSize = (value: string, attr: string) => {
    (<any>state)[attr] = Local.get('themeConfig')[value];
  };
  // 页面加载时
  onMounted(() => {
    //alert(JSON.stringify(userInfos.value.authBtnList));

    if (Local.get('themeConfig')) {
      initI18nOrSize('globalComponentSize', 'disabledSize');
      initI18nOrSize('globalI18n', 'disabledI18n');
    }
    // setTimeout(()=>{
    //   alert(JSON.stringify(userInfos));
    // },1500)
  });
</script>

<style scoped lang="scss">
  .search-section {
    margin-right: 15px;

    .search-input {
      width: 200px;

      :deep(.el-input__wrapper) {
        /* 浅底随全局 primary 变浅，与布局配置「全局主题」一致 */
        background-color: var(--el-color-primary-light-9);
        border-radius: 8px;
        box-shadow: none;
        border: none;

        .el-input__inner {
          color: var(--next-bg-topBarColor);
          font-size: 14px;
          background-color: transparent;

          &::placeholder {
            color: var(--next-bg-topBarColor);
            opacity: 0.55;
          }
        }

        .el-input__prefix,
        .el-input__suffix {
          color: var(--next-bg-topBarColor);
        }

        .el-input__prefix .el-icon,
        .el-input__suffix .el-icon {
          color: inherit;
        }
      }

      &:hover :deep(.el-input__wrapper) {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }
  .layout-navbars-breadcrumb-user {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    /* 打包隐藏的扩展区：自身需横向 flex，否则内部 icon/dropdown 会按块级竖排 */
    .layout-navbars-breadcrumb-user-extras {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: nowrap;
    }

    /* 仅挂载搜索弹层，不在顶栏 flex 里占位（弹层 teleport 到 body） */
    .topbar-search-host {
      flex: 0 0 0;
      width: 0;
      height: 0;
      overflow: hidden;
    }

    &-link {
      height: 100%;
      display: flex;
      align-items: center;
      white-space: nowrap;

      &-photo {
        width: 25px;
        height: 25px;
        border-radius: 100%;
      }
    }

    &-icon {
      padding: 0 10px;
      cursor: pointer;
      color: var(--next-bg-topBarColor);
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;

      &:hover {
        background: var(--next-color-user-hover);

        i {
          display: inline-block;
          animation: logoAnimation 0.3s ease-in-out;
        }
      }
    }

    :deep(.el-dropdown) {
      color: var(--next-bg-topBarColor);
    }

    :deep(.el-badge) {
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
    }

    :deep(.el-badge__content.is-fixed) {
      top: 12px;
    }
  }
</style>
