<template>
  <div class="image-preview-container">
    <!-- 图片列表 -->
    <div class="image-grid" v-if="showImg">
      <div
        v-for="(image, index) in imageList"
        :key="index"
        class="image-item"
        @click="openPreview(index)"
      >
        <img :src="image" :alt="`图片 ${index + 1}`" class="thumbnail" loading="lazy" />
        <div class="image-overlay">
          <el-icon class="preview-icon"><View /></el-icon>
        </div>
      </div>
    </div>

    <!-- Element Plus 图片预览 -->
    <el-image-viewer
      v-if="showPreview"
      :url-list="imageList"
      :initial-index="currentIndex"
      :hide-on-click-modal="true"
      @close="closePreview"
    />
  </div>

  <!--
    <ImagePreview :image-list="images" ref="imagePreview" />

    import ImagePreview from "/@/components/fast-upload/img-preview.vue";
    const images = ref([]);
    const imagePreview=ref();

    // 打开
    const openPreview=(images:Array<string>|null)=>{
      if(images==null||images.length<=0){
      return;
      }
      images.value=images;
      imagePreview.value.openPreview(0);
    }
    -->
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { ElImageViewer } from 'element-plus';
  import { View } from '@element-plus/icons-vue';

  // 定义 Props
  interface Props {
    imageList: string[]; // 图片URL数组
    showImg: false; //是否显示图片列表
  }

  const props = withDefaults(defineProps<Props>(), {
    imageList: () => [],
  });

  // 响应式数据
  const showPreview = ref(false);
  const currentIndex = ref(0);

  // 打开预览
  const openPreview = (index: number) => {
    currentIndex.value = index;
    showPreview.value = true;
  };

  // 关闭预览
  const closePreview = () => {
    showPreview.value = false;
  };

  // 暴露方法给父组件（可选）
  defineExpose({
    openPreview,
    closePreview,
  });
</script>

<style scoped>
  .image-preview-container {
    width: 100%;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 16px;
  }

  .image-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .image-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .image-item:hover .image-overlay {
    opacity: 1;
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .image-item:hover .thumbnail {
    transform: scale(1.05);
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .preview-icon {
    color: white;
    font-size: 24px;
  }

  /* 空状态 */
  .image-grid:empty::before {
    content: '暂无图片';
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #909399;
    font-size: 14px;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .image-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
      padding: 12px;
    }
  }

  @media (max-width: 480px) {
    .image-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
<script setup lang="ts"></script>
