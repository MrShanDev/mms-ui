<template>
  <div class="layout-footer pb15">
    <div class="layout-footer-warp">
      <div>Copyright © 2018-present ❤️</div>
      <div class="mt5">
        <a class="copyright-link" href="https://mmsadmin.cn" target="_blank" rel="noopener noreferrer">mmsAdmin · 品创网络 版权所有</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="layoutFooter">
  // 此处需有内容（注释也得），否则缓存将失败
</script>

<style scoped lang="scss">
  .layout-footer {
    width: 100%;
    display: flex;
    .copyright-link {
      color: inherit;
      text-decoration: none;
    }
    &-warp {
      margin: auto;
      color: var(--el-text-color-secondary);
      text-align: center;
      animation: error-num 0.3s ease;
    }
  }
</style>
