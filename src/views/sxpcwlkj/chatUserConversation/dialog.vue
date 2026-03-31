<template>
    <div class="sxpcwlkj-chatUserConversation-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
                <el-row>
                    <el-col v-show="false" class="mt-15" :span="24">
                        <el-form-item v-show="false" label="主键ID" prop="id">
                            <el-input v-model="state.ruleForm.id" placeholder="主键ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="用户ID" prop="userId">
                            <el-input v-model="state.ruleForm.userId" placeholder="用户ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="会话ID（私聊是对方用户ID，群聊是群组ID）" prop="conversationId">
                            <el-input v-model="state.ruleForm.conversationId" placeholder="会话ID（私聊是对方用户ID，群聊是群组ID）"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="会话类型：private私聊、group群聊" prop="conversationType">
                            <el-input v-model="state.ruleForm.conversationType" placeholder="会话类型：private私聊、group群聊"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="是否置顶：0否 1是" prop="isPinned">
                            <el-input v-model="state.ruleForm.isPinned" placeholder="是否置顶：0否 1是"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="置顶时间" prop="pinnedTime">
                            <el-input v-model="state.ruleForm.pinnedTime" placeholder="置顶时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="是否免打扰：0否 1是" prop="isMuted">
                            <el-input v-model="state.ruleForm.isMuted" placeholder="是否免打扰：0否 1是"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="最后一条消息时间" prop="lastMessageTime">
                            <el-input v-model="state.ruleForm.lastMessageTime" placeholder="最后一条消息时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="最后一条消息内容" prop="lastMessageContent">
                            <el-input v-model="state.ruleForm.lastMessageContent" placeholder="最后一条消息内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="未读消息数" prop="unreadCount">
                            <el-input v-model="state.ruleForm.unreadCount" placeholder="未读消息数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="创建时间" prop="createTime">
                            <el-input v-model="state.ruleForm.createTime" placeholder="创建时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="更新时间" prop="updateTime">
                            <el-input v-model="state.ruleForm.updateTime" placeholder="更新时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="扩展字段JSON" prop="extra">
                            <el-input v-model="state.ruleForm.extra" placeholder="扩展字段JSON"></el-input>
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
//ModuleName 用户会话表
<script setup lang="ts" name="sxpcwlkjChatUserConversationDialog">
    import {nextTick, reactive, ref} from "vue";
    import {CURDEnum} from '/@/enums/CURDEnum';
    import {ElMessage} from "element-plus";
    import {ChatUserConversationBo, ChatUserConversationVo} from '/@/views/sxpcwlkj/chatUserConversation/type';

    const dialogWidth = ref('50vw');



    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as ChatUserConversationBo ,
        threeData: [] as ChatUserConversationVo[] ,
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
            userId: '',
            conversationId: '',
            conversationType: '',
            isPinned: '',
            pinnedTime: '',
            isMuted: '',
            lastMessageTime: '',
            lastMessageContent: '',
            unreadCount: 0,
            createTime: '',
            updateTime: '',
            extra: ''
        }as ChatUserConversationBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: ChatUserConversationVo) => {
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
