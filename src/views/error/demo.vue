<template>
  <div class="test-page">
    <el-card class="mb-4">
      <template #header>
        <h2>FontAwesome 图标获取测试</h2>
      </template>

      <div class="test-section">
        <div class="test-controls">
          <el-button @click="testGetAwesomeIcons" type="primary">
            测试获取 FontAwesome 图标
          </el-button>
          <el-button @click="testGetAliIcons" type="success">
            测试获取阿里图标
          </el-button>
          <el-button @click="testGetElementIcons" type="info">
            测试获取 Element Plus 图标
          </el-button>
        </div>

        <div class="test-results">
          <el-alert
            v-if="testResult.type"
            :title="testResult.title"
            :type="testResult.type"
            :description="testResult.message"
            show-icon
            :closable="false"
          />

          <div v-if="iconList.length > 0" class="icon-list">
            <h4>获取到的图标列表 ({{ iconList.length }} 个)：</h4>
            <div class="icon-grid">
              <div v-for="(icon, index) in displayedIcons" :key="index" class="icon-item">
                <SvgIcon :name="icon" :size="20" />
                <span class="icon-name">{{ icon }}</span>
              </div>
            </div>

            <div v-if="iconList.length > 20" class="show-more">
              <el-button @click="showAll = !showAll" size="small" type="text">
                {{ showAll ? '收起' : `显示全部 (${iconList.length} 个)` }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import initIconfont from '/@/utils/getStyleSheets';

  const testResult = ref<{
    type?: 'success' | 'warning' | 'info' | 'error';
    title?: string;
    message?: string;
  }>({});

  const iconList = ref<string[]>([]);
  const showAll = ref(false);

  const displayedIcons = computed(() => {
    if (showAll.value || iconList.value.length <= 20) {
      return iconList.value;
    }
    return iconList.value.slice(0, 20);
  });

  const testGetAwesomeIcons = async () => {
    testResult.value = { type: 'info', title: '测试中...', message: '正在获取 FontAwesome 图标列表' };
    iconList.value = [];

    try {
      const icons = (await initIconfont.awe()) as string[];
      iconList.value = icons;
      testResult.value = {
        type: 'success',
        title: '获取成功',
        message: `成功获取到 ${icons.length} 个 FontAwesome 图标`,
      };
    } catch (error) {
      testResult.value = {
        type: 'error',
        title: '获取失败',
        message: `错误信息: ${error}`,
      };
    }
  };

  const testGetAliIcons = async () => {
    testResult.value = { type: 'info', title: '测试中...', message: '正在获取阿里图标列表' };
    iconList.value = [];

    try {
      const icons = (await initIconfont.ali()) as string[];
      iconList.value = icons;
      testResult.value = {
        type: 'success',
        title: '获取成功',
        message: `成功获取到 ${icons.length} 个阿里图标`,
      };
    } catch (error) {
      testResult.value = {
        type: 'error',
        title: '获取失败',
        message: `错误信息: ${error}`,
      };
    }
  };

  const testGetElementIcons = async () => {
    testResult.value = { type: 'info', title: '测试中...', message: '正在获取 Element Plus 图标列表' };
    iconList.value = [];

    try {
      const icons = (await initIconfont.ele()) as string[];
      iconList.value = icons;
      testResult.value = {
        type: 'success',
        title: '获取成功',
        message: `成功获取到 ${icons.length} 个 Element Plus 图标`,
      };
    } catch (error) {
      testResult.value = {
        type: 'error',
        title: '获取失败',
        message: `错误信息: ${error}`,
      };
    }
  };
</script>

<style scoped>
  .test-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .test-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .test-controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .test-results {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .icon-list {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
  }

  .icon-list h4 {
    margin: 0 0 16px 0;
    color: #2c3e50;
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .icon-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: white;
    border-radius: 4px;
    border: 1px solid #e1e8ed;
    transition: all 0.3s ease;
  }

  .icon-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  }

  .icon-name {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 12px;
    color: #666;
    word-break: break-all;
  }

  .show-more {
    text-align: center;
    margin-top: 16px;
  }

  @media (max-width: 768px) {
    .test-controls {
      flex-direction: column;
    }

    .icon-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
