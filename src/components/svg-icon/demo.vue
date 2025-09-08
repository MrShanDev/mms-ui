<template>
  <div class="icon-demo-page">
    <el-card class="mb-4">
      <template #header>
        <h2>SvgIcon 多图标库支持演示</h2>
      </template>
      
      <!-- Element Plus Icons -->
      <el-divider content-position="left">
        <h3>Element Plus Icons</h3>
      </el-divider>
      <div class="icon-section">
        <div class="icon-item" v-for="icon in elementIcons" :key="icon.name">
          <SvgIcon :name="icon.name" :size="24" />
          <span class="icon-name">{{ icon.name }}</span>
        </div>
      </div>

      <!-- Iconify Icons -->
      <el-divider content-position="left">
        <h3>Iconify Icons</h3>
      </el-divider>
      <div class="icon-section">
        <div class="icon-item" v-for="icon in iconifyIcons" :key="icon.name">
          <SvgIcon :name="icon.name" :size="24" />
          <span class="icon-name">{{ icon.name }}</span>
        </div>
      </div>

      <!-- FontAwesome Icons -->
      <el-divider content-position="left">
        <h3>FontAwesome Icons</h3>
      </el-divider>
      <div class="icon-section">
        <div class="icon-item" v-for="icon in fontAwesomeIcons" :key="icon.name">
          <SvgIcon :name="icon.name" :size="24" />
          <span class="icon-name">{{ icon.name }}</span>
        </div>
      </div>

      <!-- Iconfont Icons -->
      <el-divider content-position="left">
        <h3>Iconfont Icons (阿里图标库)</h3>
      </el-divider>
      <div class="icon-section">
        <div class="icon-item" v-for="icon in iconfontIcons" :key="icon.name">
          <SvgIcon :name="icon.name" :size="24" />
          <span class="icon-name">{{ icon.name }}</span>
        </div>
      </div>

      <!-- 尺寸一致性测试 -->
      <el-divider content-position="left">
        <h3>尺寸一致性测试 (24px)</h3>
      </el-divider>
      <div class="size-test-section">
        <div class="size-test-item">
          <SvgIcon name="ele-Search" :size="24" />
          <span class="test-label">Element Plus (ele-Search)</span>
        </div>
        <div class="size-test-item">
          <SvgIcon name="mdi:home" :size="24" />
          <span class="test-label">Iconify (mdi:home)</span>
        </div>
        <div class="size-test-item">
          <SvgIcon name="fa-user" :size="24" />
          <span class="test-label">FontAwesome (fa-user)</span>
        </div>
        <div class="size-test-item">
          <SvgIcon name="iconfont icon-search1" :size="24" />
          <span class="test-label">Iconfont (icon-search1)</span>
        </div>
        <div class="size-test-item">
          <SvgIcon name="icon-xinzeng" :size="24" />
          <span class="test-label">SVG Sprite (icon-xinzeng)</span>
        </div>
      </div>

      <!-- 不同尺寸对比 -->
      <el-divider content-position="left">
        <h3>不同尺寸对比测试</h3>
      </el-divider>
      <div class="size-comparison-section">
        <div class="size-group" v-for="size in testSizes" :key="size">
          <h4>{{ size }}px</h4>
          <div class="icon-row">
            <SvgIcon name="ele-Search" :size="size" />
            <SvgIcon name="mdi:home" :size="size" />
            <SvgIcon name="fa-user" :size="size" />
            <SvgIcon name="iconfont icon-search1" :size="size" />
          </div>
        </div>
      </div>
      <el-divider content-position="left">
        <h3>自定义样式演示</h3>
      </el-divider>
      <div class="custom-demo">
        <div class="demo-item">
          <SvgIcon name="ele-Search" color="#409EFF" :size="32" />
          <p>蓝色搜索图标 (32px)</p>
        </div>
        <div class="demo-item">
          <SvgIcon name="mdi:heart" color="#ff6b6b" :size="28" />
          <p>红色爱心图标 (28px)</p>
        </div>
        <div class="demo-item">
          <SvgIcon name="fa-star" color="#ffd700" :size="30" className="rotating-icon" />
          <p>旋转星星图标 (30px)</p>
        </div>
      </div>

      <!-- 兼容性演示 -->
      <el-divider content-position="left">
        <h3>兼容性演示 (name vs icon 属性)</h3>
      </el-divider>
      <div class="compatibility-demo">
        <div class="demo-row">
          <SvgIcon name="ele-User" :size="24" />
          <span>使用 name 属性：name="ele-User"</span>
        </div>
        <div class="demo-row">
          <SvgIcon icon="ele-User" :size="24" />
          <span>使用 icon 属性：icon="ele-User"</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  // Element Plus 图标示例
  const elementIcons = ref([
    { name: 'ele-Search' },
    { name: 'ele-User' },
    { name: 'ele-Setting' },
    { name: 'ele-Home' },
    { name: 'ele-Edit' },
    { name: 'ele-Delete' },
    { name: 'ele-Plus' },
    { name: 'ele-Close' },
  ]);

  // Iconify 图标示例
  const iconifyIcons = ref([
    { name: 'mdi:home' },
    { name: 'mdi:account' },
    { name: 'mdi:heart' },
    { name: 'heroicons:user-solid' },
    { name: 'tabler:search' },
    { name: 'carbon:user' },
    { name: 'lucide:star' },
    { name: 'ph:house' },
  ]);

  // FontAwesome 图标示例
  const fontAwesomeIcons = ref([
    { name: 'fa-home' },
    { name: 'fa-user' },
    { name: 'fa-star' },
    { name: 'fas fa-heart' },
    { name: 'far fa-heart' },
    { name: 'fab fa-github' },
    { name: 'fa-search' },
    { name: 'fa-cog' },
  ]);

  // Iconfont 图标示例
  const iconfontIcons = ref([
    { name: 'iconfont icon-search1' },
    { name: 'icon-xinzeng' },
    { name: 'iconfont icon-daoru' },
    { name: 'iconfont icon-daochu' },
    { name: 'icon-weibiaoti544' },
    { name: 'iconfont icon-shuaxin' },
    { name: 'icon-dayin' },
    { name: 'iconfont icon-shezhi' },
  ]);

  // 尺寸测试数据
  const testSizes = ref([16, 20, 24, 32, 48]);

</script>

<style scoped>
  .icon-demo-page {
    padding: 20px;
  }

  .icon-section {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    min-width: 120px;
    transition: all 0.3s;
    cursor: pointer;
  }

  .icon-item:hover {
    border-color: #409EFF;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    transform: translateY(-2px);
  }

  .icon-name {
    font-size: 12px;
    color: #666;
    text-align: center;
    margin-top: 8px;
    word-break: break-all;
  }

  .custom-demo {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .demo-item {
    text-align: center;
    padding: 16px;
    border: 1px dashed #ddd;
    border-radius: 8px;
  }

  .demo-item p {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }

  .compatibility-demo {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .demo-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .demo-row span {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 14px;
    color: #333;
  }

  /* 尺寸一致性测试区域 */
  .size-test-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px solid #e9ecef;
  }

  .size-test-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 12px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }

  .test-label {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 14px;
    color: #495057;
    min-width: 200px;
  }

  /* 尺寸对比测试区域 */
  .size-comparison-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .size-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  }

  .size-group h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #495057;
  }

  .icon-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon-row > * {
    /* 为每个图标添加背景，更容易看出尺寸差异 */
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 4px;
  }
  :deep(.rotating-icon) {
    animation: rotate 2s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .icon-section {
      justify-content: center;
    }
    
    .custom-demo {
      flex-direction: column;
      align-items: center;
    }
  }
</style>