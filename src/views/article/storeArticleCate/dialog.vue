<template>
    <div class="article-storeArticleCate-dialog-container">
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
                        <el-form-item label="选择上级">
                                <el-cascader :options="state.threeData"
                                             :props="{ checkStrictly: true, value: 'id', label: 'cateName' }" placeholder="请选择"
                                             @change="change" clearable class="w100" v-model="state.ruleForm.ids">
                                    <template #default="{ node, data }">
                                        <span>{{ data.cateName }}</span>
                                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                    </template>
                                </el-cascader>
                            </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="分类名称" prop="cateName">
                            <el-input v-model="state.ruleForm.cateName" placeholder="分类名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="级别" prop="level">
                            <el-input v-model="state.ruleForm.level" placeholder="级别"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="图标" prop="icon">
                            <el-input v-model="state.ruleForm.icon" placeholder="图标"></el-input>
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
//ModuleName 店铺文章分类
<script setup lang="ts" name="articleStoreArticleCateDialog">
    import {nextTick, reactive, ref} from "vue";
    import {CURDEnum} from '/@/enums/CURDEnum';
    import {ElMessage} from "element-plus";
    import {StoreArticleCateBo, StoreArticleCateVo} from '/@/views/article/storeArticleCate/type';
    import {storeArticleCateApi} from '/@/views/article/storeArticleCate';
    const baseApi = storeArticleCateApi();

    const dialogWidth = ref('50vw');
    import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";



    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as StoreArticleCateBo ,
        threeData: [] as StoreArticleCateVo[] ,
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
            parentId: '',
            cateName: '',
            level: 0,
            icon: '',
            status: 1,
            sort: 1,
            remark: ''
        }as StoreArticleCateBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: StoreArticleCateVo) => {
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
            state.ruleForm.parentId=row.id;
            state.ruleForm.ids=[...row.ids];
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
        baseApi.list({isAll:true}).then(res => {
            state.threeData = res.data;
        }).catch(async err => { ElMessage.warning(err); }).finally(() => { })
    }
    // 选择监听
    const change = (arr: string[]) => {
        state.ruleForm.parentId = arr.length > 0 ? arr[arr.length - 1] : undefined;
    };
    // 暴露变量
    defineExpose({
        openDialog, closeDialog, resetLoading
    });
</script>
