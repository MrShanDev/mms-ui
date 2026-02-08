<template>
  <div class="test-page">
    <h2>SvgIcon 图标尺寸统一性测试</h2>
    
    <!-- 基准线测试 -->
    <div class="baseline-test">
      <h3>基准线对齐测试 (24px)</h3>
      <div class="baseline-row">
        <span class="baseline-text">文字基准</span>
        <SvgIcon name="ele-Search" :size="24" />
        <SvgIcon name="mdi:home" :size="24" />
        <SvgIcon name="fa-user" :size="24" />
        <SvgIcon name="iconfont icon-search1" :size="24" />
        <span class="baseline-text">对齐检查</span>
      </div>
    </div>

    <!-- 相同尺寸对比 -->
    <div class="size-test">
      <h3>相同尺寸对比 (32px)</h3>
      <div class="size-row">
        <div class="icon-box">
          <SvgIcon name="ele-User" :size="32" />
          <span>Element Plus</span>
        </div>
        <div class="icon-box">
          <SvgIcon name="mdi:account" :size="32" />
          <span>Iconify</span>
        </div>
        <div class="icon-box">
          <SvgIcon name="fa-user" :size="32" />
          <span>FontAwesome</span>
        </div>
        <div class="icon-box">
          <SvgIcon name="icon-xinzeng" :size="32" />
          <span>Iconfont</span>
        </div>
      </div>
    </div>

    <!-- 渐进尺寸测试 -->
    <div class="progressive-test">
      <h3>渐进尺寸测试 (16px → 48px)</h3>
      <div class="progressive-row" v-for="size in [16, 20, 24, 28, 32, 40, 48]" :key="size">
        <span class="size-label">{{ size }}px:</span>
        <SvgIcon name="ele-Search" :size="size" />
        <SvgIcon name="mdi:home" :size="size" />
        <SvgIcon name="fa-heart" :size="size" />
        <SvgIcon name="iconfont icon-search1" :size="size" />
      </div>
    </div>
  </div>
</template>

<script setup>
  // 简单的测试页面
</script>

<style scoped>
  .test-page {
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  h2 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 8px;
  }

  h3 {
    color: #34495e;
    margin: 24px 0 12px 0;
  }

  /* 基准线测试 */
  .baseline-test {
    margin: 20px 0;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .baseline-row {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 24px;
    line-height: 1;
  }

  .baseline-text {
    color: #666;
    font-weight: 500;
  }

  /* 尺寸测试 */
  .size-test {
    margin: 20px 0;
    padding: 16px;
    background: #f0f8ff;
    border-radius: 8px;
  }

  .size-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }

  .icon-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: white;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    min-width: 80px;
  }

  .icon-box span {
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  /* 渐进尺寸测试 */
  .progressive-test {
    margin: 20px 0;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
  }

  .progressive-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 0;
    padding: 8px 12px;
    background: white;
    border-radius: 4px;
    border-left: 3px solid #3498db;
  }

  .size-label {
    min-width: 50px;
    font-weight: 600;
    color: #2c3e50;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  /* 为图标添加轻微的边框，方便观察尺寸 */
  .progressive-row :deep(.svg-icon-container) {
    border: 1px dashed #ddd;
    border-radius: 2px;
  }
</style>