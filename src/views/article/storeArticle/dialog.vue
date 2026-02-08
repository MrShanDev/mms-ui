<template>
    <div class="article-storeArticle-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
                <el-row :gutter="20">
                    <el-col v-show="false" class="mt-15" :span="24">
                        <el-form-item v-show="false" label="ID" prop="id">
                            <el-input v-model="state.ruleForm.id" placeholder="ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="文章标题" prop="title">
                            <el-input v-model="state.ruleForm.title" placeholder="请输入文章标题"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="12">
                        <el-form-item label="文章分类" prop="articleCateId">
                            <el-tree-select
                                v-model="state.ruleForm.articleCateId"
                                :data="state.threeData"
                                :props="{ label: 'cateName', children: 'children', value: 'id' }"
                                node-key="id"
                                placeholder="请选择文章分类"
                                check-strictly
                                default-expand-all
                                class="w100"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="12">
                        <el-form-item label="作者" prop="author">
                            <el-input v-model="state.ruleForm.author" placeholder="请输入作者"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="12">
                        <el-form-item label="文章标签" prop="tag">
                            <div class="flex-warp w100 p-5">
                                <el-tag
                                    v-for="tag in state.dynamicTags"
                                    :key="tag"
                                    class="mr5 mb5"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleTagClose(tag)"
                                >
                                    {{ tag }}
                                </el-tag>
                                <el-input
                                    v-if="state.inputVisible"
                                    ref="saveTagInput"
                                    v-model="state.inputValue"
                                    class="input-new-tag mb5"
                                    size="small"
                                    style="width: 100px"
                                    @keyup.enter="handleInputConfirm"
                                    @blur="handleInputConfirm"
                                />
                                <el-button v-else class="button-new-tag mb5" size="small" @click="showTagInput">
                                    + 新增标签
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="12">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="state.ruleForm.sort" :min="1" class="w100" />
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="12">
                        <el-form-item label="封面图片" prop="coverImg">
                            <fast-img v-model="state.ruleForm.coverImg" :fileUrl="state.ruleForm.coverImg" />
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="12">
                        <el-form-item label="状态" prop="status">
                            <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE"></fast-switch>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="内容" prop="content">
                            <div class="editor-container" style="width: 100%">
                                <fast-editor v-model:get-html="state.ruleForm.content" v-bind:content="state.ruleForm.content"/>
                            </div>
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
//ModuleName 店铺文章
<script setup lang="ts" name="articleStoreArticleDialog">
import {nextTick, reactive, ref} from "vue";
import {CURDEnum} from '/@/enums/CURDEnum';
import {ElMessage} from "element-plus";
import {StoreArticleBo, StoreArticleVo} from '/@/views/article/storeArticle/type';
import {storeArticleCateApi} from '/@/views/article/storeArticleCate';
import {StoreArticleCateVo} from '/@/views/article/storeArticleCate/type';
import { useUserInfo } from '/@/stores/userInfo';
const cateApi = storeArticleCateApi();
const userStore = useUserInfo();

const dialogWidth = ref('50vw');
import FastImg from "/@/components/fast-upload/img.vue"
import FastSelect from '/@/components/fast-select/src/fast-select.vue';
dialogWidth.value = '75vw';
import FastEditor from '/@/components/fast-editor/src/fast-editor.vue';
import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";



// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const dialogFormRef = ref();
const state = reactive({
    ruleForm: {} as StoreArticleBo ,
    threeData: [] as StoreArticleVo[] ,
    dynamicTags: [] as string[],
    inputVisible: false,
    inputValue: '',
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
    state.dynamicTags = [];
    state.inputVisible = false;
    state.inputValue = '';
    state.dialog.loading = false;
    state.ruleForm = {
        id: '',
        title: '',
        coverImg: '',
        tag: '',
        author: '',
        articleCateId: '',
        content: '',
        status: 1,
        sort: 1,
        remark: '',
        memberId: ''
    }as StoreArticleBo;
}
// 打开弹窗
const openDialog = (type: string, row: StoreArticleVo) => {
    resetForm();
    if (type === CURDEnum.EDIT) {
        state.ruleForm = Object.assign({}, row);
        if (state.ruleForm.tag) {
            state.dynamicTags = state.ruleForm.tag.split(',').filter(v => v);
        }
        state.dialog.title = '修改';
        state.dialog.submitTxt = '修 改';
        state.dialog.type = CURDEnum.EDIT;
    }
    if (type === CURDEnum.INSERT) {
        state.dialog.title = '新增';
        state.dialog.submitTxt = '新 增';
        state.dialog.type = CURDEnum.INSERT;
        // 自动填充当前登录用户为作者
        state.ruleForm.author = userStore.userInfos.userName;
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
    state.ruleForm.tag = state.dynamicTags.join(',');
    state.dialog.loading = true;
    emit('refresh', state.ruleForm);
};

const saveTagInput = ref();
const handleTagClose = (tag: string) => {
    state.dynamicTags.splice(state.dynamicTags.indexOf(tag), 1);
};

const showTagInput = () => {
    state.inputVisible = true;
    nextTick(() => {
        saveTagInput.value.focus();
    });
};

const handleInputConfirm = () => {
    if (state.inputValue) {
        const val = state.inputValue.trim();
        if (val && !state.dynamicTags.includes(val)) {
            state.dynamicTags.push(val);
        }
    }
    state.inputVisible = false;
    state.inputValue = '';
};
// 初始化菜单数据
const getMenuData = () => {
    cateApi.list({ isAll: true }).then(res => {
        state.threeData = res.data;
    })
}
// 暴露变量
defineExpose({
    openDialog, closeDialog, resetLoading
});
</script>
