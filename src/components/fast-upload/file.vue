<template>
  <div class="file-upload-container">
    <div class="upload-btn-wrapper">
      <el-upload
        class="upload-file"
        action="#"
        v-model:file-list="_fileList"
        :http-request="handleHttpUpload"
        :headers="httpFileHeaders"
        :disabled="self_disabled"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="fileSize"
        :on-exceed="handleExceed"
        :show-file-list="false"
      >
        <el-button v-if="_fileList.length == 0" type="primary" class="upload-btn">
          <i class="el-icon-upload"></i>
          <span>点击上传文件</span>
        </el-button>
        <template v-if="isShowMsg" #tip>
          <div class="el-upload__tip">all files with a size less than 100M.</div>
        </template>
      </el-upload>
    </div>

    <!-- 文件列表 -->
    <div v-if="_fileList.length > 0" class="file-list-container mt-3">
      <div v-for="file in _fileList" :key="file.uid" class="file-item">
        <!-- 视频文件 -->
        <div v-if="isVideoFile(file)" class="file-preview-wrapper video-wrapper">
          <div class="video-preview">
            <el-icon class="file-icon"><VideoPlay /></el-icon>
            <span class="file-name" :title="file.name">{{ file.name }}</span>
          </div>
          <div class="file-actions-btn">
            <el-button size="small" type="primary" @click="previewFile(file)">预览</el-button>
            <el-button size="small" type="danger" @click.stop="deleteFile(file)">删除</el-button>
          </div>
        </div>

        <!-- 图片文件 -->
        <div v-else-if="isImageFile(file)" class="file-preview-wrapper image-wrapper">
          <div class="image-container">
            <el-image
              :src="file.url"
              :preview-src-list="[file.url]"
              preview-teleported
              class="image-preview"
              fit="cover"
            />
          </div>
          <div class="file-info-text">
            <span class="file-name" :title="file.name">{{ file.name }}</span>
          </div>
          <div class="file-actions-btn">
            <el-button size="small" type="danger" @click.stop="deleteFile(file)">删除</el-button>
          </div>
        </div>

        <!-- 其他文件类型 -->
        <div v-else class="file-preview-wrapper other-wrapper">
          <div class="file-info">
            <el-icon class="file-icon"><DocumentCopy /></el-icon>
            <span class="file-name" :title="file.name">{{ file.name }}</span>
          </div>
          <div class="file-actions-btn">
            <el-button size="small" type="danger" @click.stop="deleteFile(file)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频播放器 -->
    <VideoPlayer :url="videoUrl" ref="videoPlayer"></VideoPlayer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, inject, onMounted, nextTick, watch } from 'vue';
  import {
    UploadProps,
    UploadRequestOptions,
    formContextKey,
    formItemContextKey,
    ElMessage,
    ElMessageBox,
    UploadFile,
    UploadUserFile,
  } from 'element-plus';
  import { uploadImg } from '/@/views/system/upload';
  import { Session } from '/@/utils/storage';
  import { NextLoading } from '/@/utils/loading';
  import VideoPlayer from '/@/components/video-player/index.vue';
  import { VideoPlay, DocumentCopy } from '@element-plus/icons-vue';

  const videoPlayer = ref();
  const videoUrl = ref<any>();
  const httpFileHeaders = ref({
    Authorization: `${Session.get('token')}`,
  });

  interface UploadFileProps {
    fileUrl: string; // 图片地址 ==> 必传
    drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
    disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
    fileSize?: number; // 图片大小限制 ==> 非必传（默认为 5M）
    fileType?: any[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
    height?: string; // 组件高度 ==> 非必传（默认为 150px）
    width?: string; // 组件宽度 ==> 非必传（默认为 150px）
    borderRadius?: string; // 组件边框圆角 ==> 非必传（默认为 8px）
    isShowMsg?: boolean; // 是否显示提示信息 ==> 非必传（默认为 true）
  }

  // 本地图片列表
  const _fileList = ref<UploadUserFile[]>([]);

  // 接受父组件参数
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    drag: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fileSize: {
      type: Number,
      default: 1,
    },
    fileType: {
      type: Array,
      default: () => ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    },
    height: {
      type: String,
      default: '150px',
    },
    width: {
      type: String,
      default: '150px',
    },
    borderRadius: {
      type: String,
      default: '8px',
    },
    isShowMsg: {
      type: Boolean,
      default: false,
    },
  });

  // 监听外部传值变化
  watch(
    () => props.modelValue,
    (val) => {
      if (val != null && val != '') {
        _fileList.value = [{ url: val, name: val.length + '' }];
      } else {
        _fileList.value = [];
      }
    },
    { deep: true }
  );

  // 在组件挂载后执行一些逻辑
  onMounted(() => {
    if (props.modelValue != null && props.modelValue != '') {
      _fileList.value = [{ url: props.modelValue, name: props.modelValue.length + '' }];
    }
  });

  /**
   * @description 图片上传
   * @param options upload 所有配置项
   * */
  const emit = defineEmits<{
    'update:modelValue': [value: any];
    success: [value: any];
  }>();

  // 获取 el-form 组件上下文
  const formContext = inject(formContextKey, void 0);
  // 获取 el-form-item 组件上下文
  const formItemContext = inject(formItemContextKey, void 0);

  // 判断是否禁用上传和删除
  const self_disabled = computed(() => {
    return props.disabled || formContext?.disabled;
  });

  // 检查是否是视频文件
  const isVideoFile = (file: UploadUserFile): boolean => {
    const videoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    return videoTypes.some(type => file.raw?.type?.includes(type) || file.name?.toLowerCase().endsWith('.mp4'));
  };

  // 检查是否是图片文件
  const isImageFile = (file: UploadUserFile): boolean => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.some(type => file.raw?.type?.includes(type));
  };

  // 预览文件
  const previewFile = (file: UploadUserFile) => {
    if (isVideoFile(file)) {
      videoUrl.value = file.url;
      videoPlayer.value?.openDialog();
    }
  };

  // 删除文件
  const deleteFile = async (file: UploadUserFile) => {
    try {
      await ElMessageBox.confirm(`确定要删除 ${file.name} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const index = _fileList.value.findIndex(f => f.uid === file.uid);
      if (index > -1) {
        _fileList.value.splice(index, 1);
        emit('update:modelValue', '');
        // 调用 el-form 内部的校验方法
        formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
        ElMessage.success('文件已删除');
      }
    } catch (e) {
      // 用户取消删除
    }
  };

  // 上传
  const handleHttpUpload = async (options: UploadRequestOptions) => {
    let formData = new FormData();
    formData.append('file', options.file);
    try {
      NextLoading.open();
      await uploadImg(formData)
        .then((res) => {
          emit('update:modelValue', res.data.url);
          emit('success', res.data);
          videoUrl.value = res.data.url;
          // 调用 el-form 内部的校验方法（可自动校验）
          formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
        })
        .finally(() => {
          NextLoading.close();
        });
    } catch (error) {
      options.onError(error as any);
    }
  };

  // 删除
  const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
    emit('update:modelValue', '');
  };

  // 点击
  const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    if (props.fileType.find((e) => e === 'video/mp4')) {
      if (uploadFile.url != undefined && uploadFile.url.length > 10) {
        videoUrl.value = uploadFile.url;
      }
      videoPlayer.value.openDialog();
    }
  };

  // 超出限制
  const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(`最多可选择 ${files.length} 个文件！`);
  };

  // 删除前
  const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(`确定要删除 ${uploadFile.name} ?`).then(
      () => true,
      () => false
    );
  };
</script>

<style lang="scss" scoped>
.file-upload-container {
  width: 100%;

  .upload-btn-wrapper {
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }

  .upload-file {
    :deep(.el-upload) {
      width: auto;
    }

    :deep(.el-upload__trigger) {
      display: none;
    }
  }

  .upload-btn {
    display: inline-flex !important;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 20px !important;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

    &:not(.is-disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
    }

    &:not(.is-disabled):active {
      transform: translateY(0);
    }

    i {
      font-size: 16px;
    }
  }

  .file-list-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;

    .file-item {
      .file-preview-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        background: linear-gradient(135deg, #f5f7fa 0%, #f9fafb 100%);
        border: 1px solid #d9dcde;
        border-radius: 6px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

        &:hover {
          background: linear-gradient(135deg, #eff2f7 0%, #f9fafb 100%);
          border-color: #409eff;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
        }

        /* 视频文件样式 */
        &.video-wrapper {
          gap: 12px;

          .video-preview {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            min-width: 0;

            .file-icon {
              font-size: 28px;
              color: #409eff;
              flex-shrink: 0;
              transition: color 0.3s ease;
            }

            .file-name {
              color: #303133;
              font-size: 13px;
              font-weight: 500;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        /* 图片文件样式 */
        &.image-wrapper {
          flex-wrap: wrap;
          gap: 8px;

          .image-container {
            width: 100%;
            display: flex;
            justify-content: flex-start;

            .image-preview {
              width: 50px;
              height: 50px;
              border-radius: 4px;
              flex-shrink: 0;
              cursor: pointer;
              border: 1px solid #dcdfe6;
              transition: all 0.3s ease;

              &:hover {
                border-color: #409eff;
                box-shadow: 0 1px 4px rgba(64, 158, 255, 0.2);
              }
            }
          }

          .file-info-text {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 2px;

            .file-name {
              color: #606266;
              font-size: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        /* 其他文件样式 */
        &.other-wrapper {
          gap: 12px;

          .file-info {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            min-width: 0;

            .file-icon {
              font-size: 28px;
              color: #909399;
              flex-shrink: 0;
              transition: color 0.3s ease;
            }

            .file-name {
              color: #606266;
              font-size: 13px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        /* 操作按钮容器 */
        .file-actions-btn {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
          z-index: 10;

          :deep(.el-button) {
            height: 28px;
            padding: 0 12px;
            font-size: 12px;
            font-weight: 500;
            border-radius: 4px;
            transition: all 0.3s ease;

            &:not(.is-text):hover {
              transform: translateY(-1px);
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
    }
  }
}
</style>
