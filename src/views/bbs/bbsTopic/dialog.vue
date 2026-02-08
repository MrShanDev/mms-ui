<template>
    <div class="bbs-bbsTopic-dialog-container">
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
                        <el-form-item label="发布者" prop="memberId">
                            <el-input v-model="state.ruleForm.memberId" placeholder="发布者" :disabled="state.dialog.type === 'edit'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="分类" prop="cateId">
                            <el-select v-model="state.ruleForm.cateId" placeholder="选择分类" style="width: 100%">
                                <el-option v-for="item in state.categories" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="state.ruleForm.title" placeholder="标题"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="内容" prop="contentHtml">
                            <fast-editor v-model:get-html="state.ruleForm.contentHtml" v-bind:content="state.ruleForm.contentHtml"/>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="附件" prop="files">
                            <div v-if="state.ruleForm.files && state.ruleForm.files.length > 0" class="flex-c flex-wrap">
                                <div v-for="(file, index) in state.ruleForm.files" :key="index" class="mr10 mb10 pos-r">
                                    <el-image
                                        v-if="file.type == '1'"
                                        style="width: 100px; height: 100px; border-radius: 4px;"
                                        :src="file.fileUrl || file.url"
                                        :preview-src-list="[file.fileUrl || file.url]"
                                        fit="cover"
                                    />
                                    <div v-else-if="file.type == '2'" class="video-preview">
                                        <el-icon :size="40"><ele-VideoPlay /></el-icon>
                                    </div>
                                    <div v-else class="other-file">
                                        <el-icon :size="40"><ele-Document /></el-icon>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-muted">暂无附件</div>
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
//ModuleName 话题
<script setup lang="ts" name="bbsBbsTopicDialog">
    import {nextTick, reactive, ref} from "vue";
    import {CURDEnum} from '/@/enums/CURDEnum';
    import {ElMessage} from "element-plus";
    import {BbsTopicBo, BbsTopicVo} from '/@/views/bbs/bbsTopic/type';
    import {bbsCateApi} from '/@/views/bbs/bbsCate';
    import FastEditor from "/@/components/fast-editor/src/fast-editor.vue";

    const dialogWidth = ref('70vw');
    const cateApi = bbsCateApi();



    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const dialogFormRef = ref();
    const state = reactive({
        ruleForm: {} as BbsTopicBo ,
        threeData: [] as BbsTopicVo[] ,
        categories: [] as any[],
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
            cateId: '',
            title: '',
            contentHtml: '',
            status: 1,
            sort: 1,
            remark: ''
        }as BbsTopicBo;
    }
    // 打开弹窗
    const openDialog = (type: string, row: BbsTopicVo) => {
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
        cateApi.list({ isAll: true }).then(res => {
            state.categories = res.data;
        });
    }
    // 暴露变量
    defineExpose({
        openDialog, closeDialog, resetLoading
    });
</script>
