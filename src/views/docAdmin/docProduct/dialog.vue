<template>
    <div class="docAdmin-docProduct-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
                <el-row>
                    <el-col v-show="false" class="mt-5" :span="24">
                        <el-form-item v-show="false" label="产品编号" prop="prodId">
                            <el-input v-model="state.ruleForm.prodId" placeholder="产品编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
                        <el-form-item label="产品名称" prop="prodName">
                            <el-input v-model="state.ruleForm.prodName" placeholder="产品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
                        <el-form-item label="销售单价" prop="unitPrice">
                            <el-input v-model="state.ruleForm.unitPrice" placeholder="销售单价"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
                        <el-form-item label="市场价格" prop="markPrice">
                            <el-input v-model="state.ruleForm.markPrice" placeholder="市场价格"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
                        <el-form-item label="产品类型" prop="type">
                            <el-input v-model="state.ruleForm.type" placeholder="产品类型"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
                        <el-form-item label="创建时间" prop="ctime">
                            <el-input v-model="state.ruleForm.ctime" placeholder="创建时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
                        <el-form-item label="更新时间" prop="mtime">
                            <el-input v-model="state.ruleForm.mtime" placeholder="更新时间"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
                    <el-form-item label="商品状态" prop="status">
                        <!--up：上架 un：下降 rm：删除-->
                        <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE" placeholder="状态"></fast-switch>
                    </el-form-item>
                    </el-col>
                    <el-col class="mt-5" :span="24">
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
//ModuleName 文档商品
<script setup lang="ts" name="docAdminDocProductDialog">
    import { reactive, ref, nextTick } from "vue";
    import { CURDEnum } from '/@/enums/CURDEnum';
    import {DocProductBo,DocProductVo } from '/@/views/docAdmin/docProduct/type';
    const dialogWidth = ref('50vw');
    import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as DocProductBo ,
        threeData: [] as DocProductVo[] ,
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
            prodId: '',
            prodName: '',
            unitPrice: '',
            markPrice: '',
            type: '',
            ctime: '',
            mtime: '',
            status: 0,
            sort: 1,
            remark: ''
        }as DocProductBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: DocProductVo) => {
        resetForm();
        if (type === CURDEnum.EDIT) {
            state.ruleForm = row;
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
                dialogFormRef.value.resetFields();
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
