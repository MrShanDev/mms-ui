<template>
  <div class="cms-cmsQuickEntry-dialog-container">
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
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="state.ruleForm.name" placeholder="菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="描述" prop="desc">
              <el-input v-model="state.ruleForm.desc" placeholder="描述" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="图标组件或类名" prop="icon">
              <el-input v-model="state.ruleForm.icon" placeholder="图标组件或类名" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="图标类型" prop="iconType">
              <el-input v-model="state.ruleForm.iconType" placeholder="图标类型" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="跳转路径" prop="path">
              <el-input v-model="state.ruleForm.path" placeholder="跳转路径" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="入口类型" prop="type">
              <el-input v-model="state.ruleForm.type" placeholder="入口类型" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="显示位置" prop="position">
              <el-input v-model="state.ruleForm.position" placeholder="显示位置" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否始终显示" prop="isAlwaysShow">
              <el-input-number v-model="state.ruleForm.isAlwaysShow" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="显示条件(JSON)" prop="showConditions">
              <el-input v-model="state.ruleForm.showConditions" placeholder="显示条件(JSON)" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="角标类型" prop="badgeType">
              <el-input v-model="state.ruleForm.badgeType" placeholder="角标类型" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="角标值" prop="badgeValue">
              <el-input v-model="state.ruleForm.badgeValue" placeholder="角标值" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="state.ruleForm.permission" placeholder="权限标识" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否有弹出层" prop="hasPopup">
              <el-input-number v-model="state.ruleForm.hasPopup" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="动作类型" prop="actionType">
              <el-input v-model="state.ruleForm.actionType" placeholder="动作类型" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="动作值" prop="actionValue">
              <el-input v-model="state.ruleForm.actionValue" placeholder="动作值" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否热门" prop="isHot">
              <el-input-number v-model="state.ruleForm.isHot" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="点击次数" prop="clickCount">
              <el-input-number v-model="state.ruleForm.clickCount" class="w100" controls-position="right" />
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
<script setup lang="ts" name="cmsCmsQuickEntryDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { CmsCmsQuickEntryEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as CmsCmsQuickEntryEntity,
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
    state.ruleForm = {} as CmsCmsQuickEntryEntity;
  };
  const openDialog = (type: string, row?: CmsCmsQuickEntryEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as CmsCmsQuickEntryEntity;
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
