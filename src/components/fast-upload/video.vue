<template>
    <div class="upload-box">
        <!-- 上传区域 -->
        <div v-if="!currentVideoUrl && !uploading" class="upload-area">
            <el-upload
                ref="uploadVideo"
                action="#"
                list-type="text"
                :class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
                :multiple="false"
                :disabled="self_disabled"
                :limit="1"
                :http-request="handleHttpUpload"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :drag="drag"
                :accept="fileType.join(',')"
            >
                <div class="upload-empty">
                    <slot name="empty">
                        <el-icon><UploadFilled /></el-icon>
                        <span>上传视频</span>
                    </slot>
                </div>
            </el-upload>
            <div class="el-upload__tip">
                <slot name="tip"></slot>
            </div>
        </div>

        <!-- 上传进度区域 -->
        <div v-else-if="uploading" class="upload-progress">
            <el-progress
                type="circle"
                :percentage="uploadProgress"
                :status="uploadStatus"
                style="margin: 20px auto;"
            />
            <p style="text-align: center; margin-top: 10px;">视频上传中，请稍候...</p>
        </div>

        <!-- 视频预览区域 -->
        <div v-else class="video-preview">
            <video
                :src="currentVideoUrl"
                controls
                style="width: 100%; height: auto; max-height: 400px;"
            >
                您的浏览器不支持视频播放。
            </video>
            <div class="video-actions">
                <el-button
                    type="primary"
                    @click="playVideo"
                >
                    全屏播放
                </el-button>
                <el-button
                    type="danger"
                    @click="deleteVideo"
                    :disabled="self_disabled"
                >
                    删除视频
                </el-button>
            </div>
        </div>

        <!-- 视频播放器弹窗 -->
        <el-dialog
            v-model="videoVisible"
            title="视频播放"
            width="60%"
            destroy-on-close
        >
            <video
                v-if="videoVisible && currentVideoUrl"
                :src="currentVideoUrl"
                controls
                autoplay
                style="width: 100%; height: auto; max-height: 70vh;"
            >
                您的浏览器不支持视频播放。
            </video>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="UploadVideo">
import { ref, computed, inject, watch, onMounted } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { uploadImg } from '/@/views/system/upload';
import {
    UploadProps,
    UploadFile,
    UploadRequestOptions,
    ElMessage,
    ElNotification,
} from 'element-plus';
import { formContextKey, formItemContextKey } from 'element-plus';

interface UploadFileProps {
    drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
    disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
    fileSize?: number; // 文件大小限制 ==> 非必传（默认为 100M）
    fileType?: any[]; // 文件类型限制 ==> 非必传（默认为视频格式）
}
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
        default: 100, // 视频文件默认100M
    },
    fileType: {
        type: Array,
        default: () => ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/mkv'],
    },
});
const emit = defineEmits<{
    'update:modelValue': [value: string];
    success: [value: string];
}>();
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
    const disabled = props.disabled || formContext?.disabled;
    return disabled;
});
// 当前视频URL
const currentVideoUrl = ref('');
// 上传状态
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref<'success' | 'exception' | 'warning' | ''>('');
// 当前上传的文件
const currentFile = ref<File | null>(null);

// 在组件挂载后执行一些逻辑
onMounted(() => {
    if (props.modelValue && props.modelValue.length > 0) {
        currentVideoUrl.value = props.modelValue;
    }
});

watch(
    () => props.modelValue,
    (n: string) => {
        if (n && n.length > 0) {
            currentVideoUrl.value = n;
        } else {
            currentVideoUrl.value = '';
        }
    }
);

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const fileSize = rawFile.size / 1024 / 1024 < props.fileSize;
    const fileType = props.fileType.includes(rawFile.type);
    if (!fileType) {
        ElNotification({
            title: '温馨提示',
            message: '上传文件不符合所需的格式！',
            type: 'warning',
        });
    }
    if (!fileSize) {
        setTimeout(() => {
            ElNotification({
                title: '温馨提示',
                message: `上传文件大小不能超过 ${props.fileSize}M！`,
                type: 'warning',
            });
        }, 0);
    }

    // 开始上传，设置状态
    if (fileType && fileSize) {
        uploading.value = true;
        uploadProgress.value = 0;
        uploadStatus.value = '';
        currentFile.value = rawFile;
        // 模拟进度增加
        simulateProgress();
    }

    return fileType && fileSize;
};

/**
 * @description 模拟上传进度
 * */
const simulateProgress = () => {
    const timer = setInterval(() => {
        if (uploadProgress.value < 90) {
            uploadProgress.value += 10;
        } else {
            clearInterval(timer);
        }
    }, 200);
};

/**
 * @description 文件上传
 * @param options upload 所有配置项
 * */
const handleHttpUpload = async (options: UploadRequestOptions) => {
    let formData = new FormData();
    formData.append('file', options.file);
    try {
        const { data } = await uploadImg(formData);
        options.onSuccess(data);
    } catch (error) {
        options.onError(error as any);
    }
};

/**
 * @description 文件上传成功
 * @param response 上传响应结果
 * @param uploadFile 上传的文件
 * */
const uploadSuccess = (response: { url: string } | undefined, uploadFile: UploadFile) => {
    if (!response) {
        return;
    }

    // 完成进度条
    uploadProgress.value = 100;
    uploadStatus.value = 'success';

    // 延迟一下再显示视频，让用户看到100%的进度
    setTimeout(() => {
        // 设置当前视频URL
        currentVideoUrl.value = response.url;
        uploading.value = false;

        // 发送更新后的URL
        emit('update:modelValue', response.url);
        emit('success', response.url);

        // 调用 el-form 内部的校验方法（可自动校验）
        formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);

        ElNotification({
            title: '温馨提示',
            message: '视频上传成功！',
            type: 'success',
        });
    }, 500);
};

/**
 * @description 文件上传错误
 * */
const uploadError = (error: any, uploadFile: UploadFile, uploadFiles: UploadFile[]) => {
    uploading.value = false;
    uploadStatus.value = 'exception';
    uploadProgress.value = 0;

    ElNotification({
        title: '温馨提示',
        message: '视频上传失败，请您重新上传！',
        type: 'error',
    });
};

/**
 * @description 文件数超出
 * */
const handleExceed = () => {
    ElNotification({
        title: '温馨提示',
        message: '当前只能上传一个视频文件！',
        type: 'warning',
    });
};

// ====================== 视频操作 ======================
const videoVisible = ref(false);

/**
 * 删除视频
 */
const deleteVideo = () => {
    if (self_disabled.value) return;

    currentVideoUrl.value = '';
    emit('update:modelValue', '');
    ElMessage.success('视频已删除');
};

/**
 * 播放视频（全屏）
 */
const playVideo = () => {
    videoVisible.value = true;
};
</script>

<style scoped lang="scss">
.is-error {
    .upload {
        :deep(.el-upload--text),
        :deep(.el-upload-dragger) {
            border: 1px dashed var(--el-color-danger) !important;
            &:hover {
                border-color: var(--el-color-primary) !important;
            }
        }
    }
}
:deep(.disabled) {
    .el-upload--text,
    .el-upload-dragger {
        cursor: not-allowed;
        background: var(--el-disabled-bg-color) !important;
        border: 1px dashed var(--el-border-color-darker);
        &:hover {
            border-color: var(--el-border-color-darker) !important;
        }
    }
}
.upload-box {
    .upload-area {
        .no-border {
            :deep(.el-upload--text) {
                border: none !important;
            }
        }
        :deep(.upload) {
            .el-upload-dragger {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 150px;
                padding: 20px;
                overflow: hidden;
                border: 1px dashed var(--el-border-color-darker);
                border-radius: 8px;
                &:hover {
                    border: 1px dashed var(--el-color-primary);
                }
            }
            .el-upload-dragger.is-dragover {
                background-color: var(--el-color-primary-light-9);
                border: 2px dashed var(--el-color-primary) !important;
            }
            .el-upload-list__item,
            .el-upload--text {
                width: 100%;
                background-color: transparent;
                border-radius: 8px;
            }
            .upload-empty {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 14px;
                line-height: 30px;
                color: var(--el-color-info);
                .el-icon {
                    font-size: 28px;
                    color: var(--el-text-color-secondary);
                    margin-bottom: 8px;
                }
            }
        }
        .el-upload__tip {
            line-height: 15px;
            text-align: center;
            margin-top: 10px;
        }
    }

    .upload-progress {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        border: 1px dashed var(--el-border-color-darker);
        border-radius: 8px;
    }

    .video-preview {
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 8px;
        padding: 10px;

        .video-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }
    }
}
</style>
