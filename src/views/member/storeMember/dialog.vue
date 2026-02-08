<template>
    <div class="member-storeMember-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
                <el-row>
                    <el-col v-show="false" class="mt-15" :span="24">
                        <el-form-item v-show="false" label="ID" prop="id">
                            <el-input v-model="state.ruleForm.id" placeholder="ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="昵称" prop="nickname">
                            <el-input v-model="state.ruleForm.nickname" placeholder="昵称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="账号" prop="account">
                            <el-input v-model="state.ruleForm.account" placeholder="账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                    <el-form-item label="性别" prop="sex">
                        <fast-select v-model="state.ruleForm.sex" dict-type="SYS_SEX" placeholder="性别"></fast-select>
                    </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="state.ruleForm.phone" placeholder="手机号"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col class="mt-15" :span="24">
                        <el-form-item label="头像" prop="headPortrait">
                            <fast-img v-model="state.ruleForm.headPortrait" :fileUrl="state.ruleForm.headPortrait" />
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="生日" prop="birthday">
                            <el-date-picker type="date" value-format="YYYY-MM-DD" placeholder="生日" v-model="state.ruleForm.birthday"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="信用分" prop="reputationScore">
                            <el-input v-model="state.ruleForm.reputationScore" placeholder="信用分"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="邀请码" prop="invitationCode">
                            <el-input v-model="state.ruleForm.invitationCode" placeholder="邀请码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                    <el-form-item label="状态" prop="status">
                        <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE" placeholder="状态"></fast-switch>
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
//ModuleName 会员列表
<script setup lang="ts" name="memberStoreMemberDialog">
import {nextTick, reactive, ref} from "vue";
import {CURDEnum} from '/@/enums/CURDEnum';
import {StoreMemberBo, StoreMemberVo} from '/@/views/member/storeMember/type';
import FastSelect from '/@/components/fast-select/src/fast-select.vue';
import FastImg from "/@/components/fast-upload/img.vue"
import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";

const dialogWidth = ref('50vw');


// 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as StoreMemberBo ,
        threeData: [] as StoreMemberVo[] ,
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
            nickname: '',
            account: '',
            sex: 0,
            phone: '',
            password: '',
            headPortrait: '',
            birthday: '',
            reputationScore: 0,
            level: 0,
            invitationCode: '',
            privateKey: '',
            wxOpenid: '',
            alipayOpenid: '',
            douyinOpenid: '',
            lastLoginIp: '',
            payPassword: '',
            status: 1,
            sort: 1,
            remark: ''
        }as StoreMemberBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: StoreMemberVo) => {
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
