<template>
    <div class="member-storeMemberAuthentication-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
                <el-row>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="ID" prop="id">
                            <el-input v-model="state.ruleForm.id" placeholder="ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="会员ID" prop="memberId">
                            <el-input v-model="state.ruleForm.memberId" placeholder="会员ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="state.ruleForm.name" placeholder="姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="身份证号" prop="number">
                            <el-input v-model="state.ruleForm.number" placeholder="身份证号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="state.ruleForm.phone" placeholder="手机号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="身份证正面" prop="imageFront">
                            <el-input v-model="state.ruleForm.imageFront" placeholder="身份证正面"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="身份证背面" prop="imageBack">
                            <el-input v-model="state.ruleForm.imageBack" placeholder="身份证背面"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="营业执照" prop="businessLicense">
                            <el-input v-model="state.ruleForm.businessLicense" placeholder="营业执照"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="性别" prop="sex">
                            <el-input v-model="state.ruleForm.sex" placeholder="性别"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="state.ruleForm.address" placeholder="地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="生日" prop="nationality">
                            <el-input v-model="state.ruleForm.nationality" placeholder="生日"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                    <el-form-item label="状态" prop="status">
                        <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE" placeholder="字典状态"></fast-switch>
                    </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="state.ruleForm.sort" :min="1" label="排序"></el-input-number>
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
//ModuleName 会员认证
<script setup lang="ts" name="memberStoreMemberAuthenticationDialog">
    import {nextTick, reactive, ref} from "vue";
    import {CURDEnum} from '/@/enums/CURDEnum';
    import {ElMessage} from "element-plus";
    import {StoreMemberAuthenticationBo, StoreMemberAuthenticationVo} from '/@/views/member/storeMemberAuthentication/type';

    const dialogWidth = ref('50vw');
    import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";



    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as StoreMemberAuthenticationBo ,
        threeData: [] as StoreMemberAuthenticationVo[] ,
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
            memberId: '',
            name: '',
            number: '',
            phone: '',
            imageFront: '',
            imageBack: '',
            businessLicense: '',
            sex: '',
            address: '',
            nationality: '',
            status: 1,
            sort: 1,
            remark: ''
        }as StoreMemberAuthenticationBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: StoreMemberAuthenticationVo) => {
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
