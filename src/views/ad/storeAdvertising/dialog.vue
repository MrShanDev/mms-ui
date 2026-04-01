<template>
  <div class="ad-storeAdvertising-dialog-container">
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
            <el-form-item label="广告位ID" prop="advertisingId">
              <el-input v-model="state.ruleForm.advertisingId" placeholder="广告位ID" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="广告位ID" prop="advertisingName">
              <el-input v-model="state.ruleForm.advertisingName" placeholder="广告位ID" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="开始时间" prop="startTime">
              <el-input v-model="state.ruleForm.startTime" placeholder="开始时间" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="到期时间" prop="endTime">
              <el-input v-model="state.ruleForm.endTime" placeholder="到期时间" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="路由地址" prop="routeUrl">
              <el-input v-model="state.ruleForm.routeUrl" placeholder="路由地址" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="图片地址" prop="imageUrl">
              <el-input v-model="state.ruleForm.imageUrl" placeholder="图片地址" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="路由参数" prop="routeParameter">
              <el-input v-model="state.ruleForm.routeParameter" placeholder="路由参数" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="扩展参数一" prop="extendedParameterOne">
              <el-input v-model="state.ruleForm.extendedParameterOne" placeholder="扩展参数一" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="扩展参数三" prop="extendedParameterThree">
              <el-input v-model="state.ruleForm.extendedParameterThree" placeholder="扩展参数三" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="扩展参数二" prop="extendedParameterTwo">
              <el-input v-model="state.ruleForm.extendedParameterTwo" placeholder="扩展参数二" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="扩展参数四" prop="extendedParameterFour">
              <el-input v-model="state.ruleForm.extendedParameterFour" placeholder="扩展参数四" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="扩展参数五" prop="extendedParameterFive">
              <el-input v-model="state.ruleForm.extendedParameterFive" placeholder="扩展参数五" clearable />
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
<script setup lang="ts" name="adStoreAdvertisingDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { AdStoreAdvertisingEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as AdStoreAdvertisingEntity,
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
    state.ruleForm = {} as AdStoreAdvertisingEntity;
  };
  const openDialog = (type: string, row?: AdStoreAdvertisingEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as AdStoreAdvertisingEntity;
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
