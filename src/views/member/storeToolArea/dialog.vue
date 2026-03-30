<template>
  <div class="member-storeToolArea-dialog-container">
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
              <el-input-number v-model="state.ruleForm.id" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="state.ruleForm.name" placeholder="名称" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="CODE" prop="code">
              <el-input v-model="state.ruleForm.code" placeholder="CODE" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="父CODE" prop="parentCode">
              <el-input v-model="state.ruleForm.parentCode" placeholder="父CODE" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="级别" prop="level">
              <el-input v-model="state.ruleForm.level" placeholder="级别" clearable />
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
<script setup lang="ts" name="memberStoreToolAreaDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { MemberStoreToolAreaEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as MemberStoreToolAreaEntity,
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
    state.ruleForm = {} as MemberStoreToolAreaEntity;
  };
  const openDialog = (type: string, row?: MemberStoreToolAreaEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as MemberStoreToolAreaEntity;
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
