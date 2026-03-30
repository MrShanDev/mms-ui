<template>
  <div class="article-storeArticleCate-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="120px">
        <el-row>
          <el-col v-show="false" class="mt-5" :span="24">
            <el-form-item v-show="false" label="id" prop="id">
              <el-input v-model="state.ruleForm.id" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="ID" prop="id">
              <el-input v-model="state.ruleForm.id" placeholder="ID" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="父ID" prop="parentId">
              <el-input v-model="state.ruleForm.parentId" placeholder="父ID" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="分类名称" prop="cateName">
              <el-input v-model="state.ruleForm.cateName" placeholder="分类名称" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="级别" prop="level">
              <el-input-number v-model="state.ruleForm.level" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="state.ruleForm.icon" placeholder="图标" clearable />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" size="default">取 消</el-button>
          <el-button
            type="primary"
            :disabled="state.dialog.loading"
            :loading-icon="Eleme"
            :loading="state.dialog.loading"
            @click="onSubmit"
            size="default"
          >{{ state.dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="articleStoreArticleCateDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { ArticleStoreArticleCateEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as ArticleStoreArticleCateEntity,
    dialog: {
      loading: false,
      isShowDialog: false,
      type: '',
      title: '',
      submitTxt: '',
    },
  });
  const resetForm = () => {
    state.dialog.loading = false;
    state.ruleForm = {} as ArticleStoreArticleCateEntity;
  };
  const openDialog = (type: string, row?: ArticleStoreArticleCateEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as ArticleStoreArticleCateEntity;
        state.dialog.title = '修改';
      } else {
        state.dialog.title = '新增';
      }
      state.dialog.submitTxt = type === CURDEnum.INSERT ? '新 增' : '修 改';
      state.dialog.isShowDialog = true;
      state.dialog.type = type;
    });
  };
  const closeDialog = () => {
    state.dialog.isShowDialog = false;
  };
  const onSubmit = () => {
    state.dialog.loading = true;
    emit('refresh', state.ruleForm);
  };
  const resetLoading = () => { state.dialog.loading = false; };
  defineExpose({ openDialog, closeDialog, resetLoading });
</script>
