<template>
  <div class="ad-storeAdvertisingLocation-dialog-container">
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
            <el-form-item label="广告位名称" prop="name">
              <el-input v-model="state.ruleForm.name" placeholder="广告位名称" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="广告位高度" prop="height">
              <el-input v-model="state.ruleForm.height" placeholder="广告位高度" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="广告位宽度" prop="width">
              <el-input v-model="state.ruleForm.width" placeholder="广告位宽度" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="广告位编码" prop="code">
              <el-input v-model="state.ruleForm.code" placeholder="广告位编码" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="最大显示数量" prop="maxNum">
              <el-input-number v-model="state.ruleForm.maxNum" class="w100" controls-position="right" />
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
<script setup lang="ts" name="adStoreAdvertisingLocationDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { AdStoreAdvertisingLocationEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as AdStoreAdvertisingLocationEntity,
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
    state.ruleForm = {} as AdStoreAdvertisingLocationEntity;
  };
  const openDialog = (type: string, row?: AdStoreAdvertisingLocationEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as AdStoreAdvertisingLocationEntity;
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
