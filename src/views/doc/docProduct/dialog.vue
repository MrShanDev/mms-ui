<template>
  <div class="doc-docProduct-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="120px">
        <el-row>
          <el-col class="mt-5" :span="24">
            <el-form-item label="产品编号" prop="prodId">
              <el-input v-model="state.ruleForm.prodId" placeholder="产品编号" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="产品名称" prop="prodName">
              <el-input v-model="state.ruleForm.prodName" placeholder="产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="销售单价" prop="unitPrice">
              <el-input v-model="state.ruleForm.unitPrice" placeholder="销售单价" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="市场价格" prop="markPrice">
              <el-input v-model="state.ruleForm.markPrice" placeholder="市场价格" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="产品类型" prop="type">
              <el-input v-model="state.ruleForm.type" placeholder="产品类型" clearable />
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
<script setup lang="ts" name="docDocProductDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { DocDocProductEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as DocDocProductEntity,
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
    state.ruleForm = {} as DocDocProductEntity;
  };
  const openDialog = (type: string, row?: DocDocProductEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as DocDocProductEntity;
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
