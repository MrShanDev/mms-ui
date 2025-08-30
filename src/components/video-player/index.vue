<template>
    <el-dialog
        :title="state.dialog.title"
        v-model="state.dialog.isShowDialog"
        height="500px"
        width="750px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
         draggable>
        <video
            ref="videoElement"
            class="video-js vjs-default-skin"
            controls
            preload="auto"
            :width="width"
            :height="height"
        >
            <source :src="url" :type="type" />
            您的浏览器不支持 HTML5 视频标签。
        </video>
    </el-dialog>
</template>

<script setup lang="ts">
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Player from "video.js/dist/types/player";
interface PropsType {
    width?: string;
    height?: string;
    url: string;
    type:string;
}
// Prop 组件传过来的值
withDefaults(defineProps<PropsType>(), {
    width: () => "700px",
    height: () =>"400px",
    url: "",
    type:"video/mp4",
});
// emit 通信
const emit = defineEmits<{
    insert: [value: any];
    success: [value: any];
    close: [value: any];
    print: [value: any];
    deletes: [value: any];
}>();
const state = reactive({
    dialog: {
        isShowDialog: false,
        type: "",
        title: "",
        submitTxt: "",
    },
    importMsg: "",
});
const videoElement = ref<HTMLVideoElement | null>(null);
const player = ref<Player | null>(null);
const openDialog = async (type: string) => {

    state.dialog.isShowDialog = true;
    state.dialog.type = type; // 假设需要设置类型
    state.dialog.title = "视频播放"; // 假设需要设置标题

    // 等待 DOM 更新完成
    await nextTick();

    if (videoElement.value) {
        // 初始化 Video.js 播放器
        player.value = videojs(videoElement.value, {
            autoplay: false,
            controls: true,
            preload: 'auto',
            // 其他配置选项可以在这里添加
        });

        // 监听事件（可选）
        player.value.on('play', () => {
            //console.log('视频开始播放');
        });

        player.value.on('pause', () => {
            //console.log('视频暂停');
        });
    }
};
// 关闭弹窗
const closeDialog = () => {
    emit("close", "");
    state.dialog.isShowDialog = false;
    // 在组件销毁前销毁 Video.js 播放器实例
    if (player.value) {
        player.value.dispose();
        player.value = null;
    }
};
onBeforeUnmount(() => {
    if (player.value) {
        player.value.dispose();
    }
});
// 暴露变量
defineExpose({
    openDialog, closeDialog
});
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
</style>
