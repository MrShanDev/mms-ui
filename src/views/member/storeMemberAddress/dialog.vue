<template>
    <div class="member-storeMemberAddress-dialog-container">
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
                        <el-form-item label="会员ID" prop="memberId">
                            <el-input v-model="state.ruleForm.memberId" placeholder="会员ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="收货人" prop="name">
                            <el-input v-model="state.ruleForm.name" placeholder="收货人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="收货手机号" prop="phone">
                            <el-input v-model="state.ruleForm.phone" placeholder="收货手机号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="国家" prop="country">
                            <el-input v-model="state.ruleForm.country" placeholder="国家"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="省" prop="province">
                            <el-input v-model="state.ruleForm.province" placeholder="省"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="市" prop="city">
                            <el-input v-model="state.ruleForm.city" placeholder="市"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="区/县" prop="district">
                            <el-input v-model="state.ruleForm.district" placeholder="区/县"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="详细地址" prop="address">
                            <el-input v-model="state.ruleForm.address" placeholder="详细地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="是否默认" prop="isDef">
                            <el-input v-model="state.ruleForm.isDef" placeholder="是否默认"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                    <el-form-item label="状态" prop="status">
                        <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE" placeholder="状态"></fast-switch>
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
//ModuleName 会员收货地址
<script setup lang="ts" name="memberStoreMemberAddressDialog">
import {nextTick, reactive, ref} from "vue";
import {CURDEnum} from '/@/enums/CURDEnum';
import {StoreMemberAddressBo, StoreMemberAddressVo} from '/@/views/member/storeMemberAddress/type';
import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";

const dialogWidth = ref('50vw');


// 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as StoreMemberAddressBo ,
        threeData: [] as StoreMemberAddressVo[] ,
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
            phone: '',
            country: '',
            province: '',
            city: '',
            district: '',
            address: '',
            isDef: '',
            status: 1,
            sort: 1,
            remark: ''
        }as StoreMemberAddressBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: StoreMemberAddressVo) => {
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
