<template>
  <el-dialog
    v-model="visible"
    :title="creating ? '新增租户' : '编辑租户'"
    width="680px"
    style="max-width: 94vw"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" v-loading="loading">
      <el-form-item label="租户编号" prop="tenantId">
        <el-input
          v-model="form.tenantId"
          :disabled="!creating"
          maxlength="32"
          placeholder="3–32位小写字母、数字或连字符"
        />
      </el-form-item>
      <el-form-item label="租户名称" prop="name">
        <el-input v-model="form.name" maxlength="100" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>
      <el-form-item label="租户套餐" prop="packageId">
        <el-select v-model="form.packageId" placeholder="请选择已启用套餐" style="width: 100%">
          <el-option
            v-for="p in packages"
            :key="p.id"
            :value="p.id"
            :label="p.name"
            :disabled="p.status !== 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="到期时间">
        <el-date-picker
          v-model="form.expireTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="不设置则长期有效"
          style="width: 100%"
          clearable
        />
      </el-form-item>
      <el-form-item label="账号额度" prop="accountCount">
        <el-input-number v-model="form.accountCount" :min="1" :max="1000000" />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="form.contactName" maxlength="100" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.contactMobile" maxlength="30" />
      </el-form-item>
      <el-form-item label="绑定域名">
        <el-input
          v-model="form.domain"
          maxlength="200"
          placeholder="用于记录域名；登录仍使用租户编号"
        />
      </el-form-item>
      <template v-if="creating">
        <el-divider content-position="left">初始租户管理员</el-divider>
        <el-form-item label="管理员账号" prop="adminUsername">
          <el-input v-model="form.adminUsername" maxlength="64" autocomplete="off" />
        </el-form-item>
        <el-form-item label="初始密码" prop="adminPassword">
          <el-input
            v-model="form.adminPassword"
            type="password"
            show-password
            maxlength="128"
            autocomplete="new-password"
            placeholder="8–128个字符"
          />
        </el-form-item>
      </template>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" maxlength="255" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" :disabled="loading" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
  import { tenantApi } from '../index';
  import type { TenantRow, TenantPackage } from '../type';
  const emit = defineEmits(['saved']);
  const visible = ref(false),
    creating = ref(true),
    loading = ref(false),
    saving = ref(false);
  const formRef = ref<FormInstance>();
  const packages = ref<TenantPackage[]>([]);
  type Form = TenantRow & { adminUsername?: string; adminPassword?: string };
  const fresh = (): Form => ({
    tenantId: '',
    name: '',
    status: 1,
    packageId: '',
    accountCount: 10,
    adminUsername: 'admin',
    adminPassword: '',
  });
  const form = ref<Form>(fresh());
  const rules: FormRules = {
    tenantId: [
      { required: true, message: '请填写租户编号' },
      { pattern: /^[a-z0-9][a-z0-9-]{2,31}$/, message: '请输入3–32位小写字母、数字或连字符' },
    ],
    name: [{ required: true, message: '请填写租户名称' }],
    packageId: [{ required: true, message: '请选择套餐' }],
    accountCount: [{ required: true, message: '请填写账号额度' }],
    adminUsername: [
      { required: true, message: '请填写管理员账号' },
      { min: 3, max: 64, message: '账号长度3–64位' },
    ],
    adminPassword: [
      { required: true, message: '请填写初始密码' },
      { min: 8, max: 128, message: '密码长度8–128位' },
    ],
  };
  async function open(id?: string) {
    visible.value = true;
    creating.value = !id;
    form.value = fresh();
    loading.value = true;
    try {
      const p = await tenantApi.packages();
      packages.value = p.data || [];
      if (id) {
        const r = await tenantApi.query(id);
        form.value = { ...r.data };
      }
    } catch (error) {
      visible.value = false;
      ElMessage.error('租户表单加载失败，请重新打开');
    } finally {
      loading.value = false;
    }
  }
  async function save() {
    if (saving.value || !(await formRef.value?.validate().catch(() => false))) return;
    saving.value = true;
    try {
      await tenantApi.save(
        { ...form.value, expireTime: form.value.expireTime || null },
        creating.value
      );
      ElMessage.success('租户保存成功');
      visible.value = false;
      form.value.adminPassword = '';
      emit('saved');
    } finally {
      saving.value = false;
    }
  }
  defineExpose({ open });
</script>
