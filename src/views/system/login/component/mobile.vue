<template>
  <el-form size="large" class="login-content-form" @submit.prevent>
    <p v-if="!serviceEnabled" class="method-notice" role="status">
      短信登录暂未启用，请使用账号密码登录。
    </p>
    <el-form-item>
      <div class="login-content-title">手机号</div>
      <el-input
        v-model="phoneNumber"
        placeholder="请输入手机号"
        type="tel"
        autocomplete="tel"
        maxlength="11"
      >
        <template #prefix>
          <el-icon><ele-Iphone /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <div class="login-content-title">短信验证码</div>
      <div class="sms-code-row">
        <el-input
          v-model="code"
          placeholder="请输入验证码"
          maxlength="6"
          autocomplete="one-time-code"
          inputmode="numeric"
        >
          <template #prefix>
            <el-icon><ele-Lock /></el-icon>
          </template>
        </el-input>
        <el-button :disabled="!serviceEnabled" @click="unavailable">获取验证码</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="login-content-submit"
        :disabled="!serviceEnabled"
        @click="unavailable"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts" name="loginMobile">
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  defineProps({
    loginContext: { type: Object, required: true },
    serviceEnabled: { type: Boolean, default: false },
  });
  const phoneNumber = ref(''),
    code = ref('');
  function unavailable() {
    ElMessage.info('短信认证服务尚未接通，请联系管理员或使用账号密码登录');
  }
</script>
<style scoped lang="scss">
  .sms-code-row {
    display: flex;
    gap: 8px;
    width: 100%;
    .el-input {
      min-width: 0;
      flex: 1;
    }
    .el-button {
      height: 44px;
      padding: 0 12px;
      color: #1687ff;
      background: #f8faff;
      border-color: #dde6f4;
      font-size: 12px;
    }
  }
  .method-notice {
    font-size: 12px;
    line-height: 1.6;
    padding: 10px 12px;
    margin: 0 0 18px;
    background: #f0f6ff;
    border-radius: 6px;
    color: #6982a5;
  }
</style>
