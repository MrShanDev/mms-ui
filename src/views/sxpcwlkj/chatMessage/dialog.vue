<template>
    <div class="sxpcwlkj-chatMessage-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
                <el-row>
                    <el-col v-show="false" class="mt-15" :span="24">
                        <el-form-item v-show="false" label="消息ID" prop="id">
                            <el-input v-model="state.ruleForm.id" placeholder="消息ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="发送者ID" prop="senderId">
                            <el-input v-model="state.ruleForm.senderId" placeholder="发送者ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="接收者ID（私聊时使用）" prop="receiverId">
                            <el-input v-model="state.ruleForm.receiverId" placeholder="接收者ID（私聊时使用）"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="聊天室ID（群聊时使用）" prop="chatRoomId">
                            <el-input v-model="state.ruleForm.chatRoomId" placeholder="聊天室ID（群聊时使用）"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="消息类型：private私聊、group群聊、broadcast广播" prop="messageType">
                            <el-input v-model="state.ruleForm.messageType" placeholder="消息类型：private私聊、group群聊、broadcast广播"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="消息内容" prop="content">
                            <el-input v-model="state.ruleForm.content" placeholder="消息内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="内容类型：text文本、image图片、video视频、file文件、recall撤回" prop="contentType">
                            <el-input v-model="state.ruleForm.contentType" placeholder="内容类型：text文本、image图片、video视频、file文件、recall撤回"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                    <el-form-item label="消息状态：normal正常、recall撤回、delete删除" prop="status">
                        <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE" placeholder="字典状态"></fast-switch>
                    </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="消息发送时间" prop="createTime">
                            <el-input v-model="state.ruleForm.createTime" placeholder="消息发送时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="消息更新时间" prop="updateTime">
                            <el-input v-model="state.ruleForm.updateTime" placeholder="消息更新时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="扩展字段JSON格式" prop="extra">
                            <el-input v-model="state.ruleForm.extra" placeholder="扩展字段JSON格式"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="消息长度" prop="contentLength">
                            <el-input v-model="state.ruleForm.contentLength" placeholder="消息长度"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="closeDialog" size="default">取 消</el-button>
                <el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
//ModuleName 聊天消息表
<script setup lang="ts" name="sxpcwlkjChatMessageDialog">
    import {nextTick, reactive, ref} from "vue";
    import {CURDEnum} from '/@/enums/CURDEnum';
    import {ElMessage} from "element-plus";
    import {ChatMessageBo, ChatMessageVo} from '/@/views/sxpcwlkj/chatMessage/type';

    const dialogWidth = ref('50vw');
    import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";



    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as ChatMessageBo ,
        threeData: [] as ChatMessageVo[] ,
        dialog: {
            loading: false,
            isShowDialog: false,
            type: "",
            title: "",
            submitTxt: "",
        },
    });

    // 重置
    const resetForm = () => {
        state.dialog.loading = false;
        state.ruleForm = {
            id: '',
            senderId: '',
            receiverId: '',
            chatRoomId: '',
            messageType: '',
            content: '',
            contentType: '',
            status: '',
            createTime: '',
            updateTime: '',
            extra: '',
            contentLength: 0        }as ChatMessageBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: ChatMessageVo) => {
        resetForm();
        if (type === CURDEnum.EDIT) {
            state.ruleForm = Object.assign({}, row);
            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';
            state.dialog.type = CURDEnum.EDIT;
        }
        if (type === CURDEnum.INSERT) {
            state.dialog.title = '新增';
            state.dialog.submitTxt = '新 增';
            state.dialog.type = CURDEnum.INSERT;
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                dialogFormRef.value.clearValidate();
            });
        }
        getMenuData();
        state.dialog.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
        state.dialog.loading = false;
        state.dialog.isShowDialog = false;
    };
    // 重置Loading
    const resetLoading = () => {
        state.dialog.loading = false;
    };
    // 提交
    const onSubmit = () => {
        state.dialog.loading = true;
        emit('refresh', state.ruleForm);
    };
    // 初始化菜单数据
    const getMenuData = () => {
    }
    // 暴露变量
    defineExpose({
        openDialog, closeDialog, resetLoading
    });
</script>
