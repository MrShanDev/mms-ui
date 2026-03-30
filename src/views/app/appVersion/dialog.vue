<template>
  <div class="app-appVersion-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="120px">
        <el-row>
          <el-col v-show="false" class="mt-5" :span="24">
            <el-form-item v-show="false" label="id" prop="id">
              <el-input v-model="state.ruleForm.id" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="id">
              <el-input-number v-model="state.ruleForm.id" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="appCode">
              <el-input v-model="state.ruleForm.appCode" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="appName">
              <el-input v-model="state.ruleForm.appName" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="platform">
              <el-input v-model="state.ruleForm.platform" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="versionCode">
              <el-input v-model="state.ruleForm.versionCode" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="versionName">
              <el-input v-model="state.ruleForm.versionName" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="buildNumber">
              <el-input v-model="state.ruleForm.buildNumber" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="downloadUrl">
              <el-input v-model="state.ruleForm.downloadUrl" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="fileSize">
              <el-input-number v-model="state.ruleForm.fileSize" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="fileMd5">
              <el-input v-model="state.ruleForm.fileMd5" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="releaseNotes">
              <el-input v-model="state.ruleForm.releaseNotes" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="isForceUpdate">
              <el-input-number v-model="state.ruleForm.isForceUpdate" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="minRequiredVersion">
              <el-input v-model="state.ruleForm.minRequiredVersion" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="publishType">
              <el-input v-model="state.ruleForm.publishType" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="publishStatus">
              <el-input v-model="state.ruleForm.publishStatus" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="publishUser">
              <el-input v-model="state.ruleForm.publishUser" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="status">
              <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE" placeholder="App版本发布视图对象" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="sort">
              <el-input-number v-model="state.ruleForm.sort" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="remark">
              <el-input v-model="state.ruleForm.remark" placeholder="App版本发布视图对象" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="createdBy">
              <el-input-number v-model="state.ruleForm.createdBy" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="updatedBy">
              <el-input-number v-model="state.ruleForm.updatedBy" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="revision">
              <el-input-number v-model="state.ruleForm.revision" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="App版本发布视图对象" prop="tenantId">
              <el-input v-model="state.ruleForm.tenantId" placeholder="App版本发布视图对象" clearable />
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
<script setup lang="ts" name="appAppVersionDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import FastSwitch from '/@/components/fast-switch/src/fast-switch.vue';
  import { AppAppVersionEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as AppAppVersionEntity,
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
    state.ruleForm = {} as AppAppVersionEntity;
  };
  const openDialog = (type: string, row?: AppAppVersionEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as AppAppVersionEntity;
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
