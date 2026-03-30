<template>
  <div class="member-storeMember-dialog-container">
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
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="state.ruleForm.nickname" placeholder="昵称" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="账号" prop="account">
              <el-input v-model="state.ruleForm.account" placeholder="账号" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="性别" prop="sex">
              <el-input-number v-model="state.ruleForm.sex" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="state.ruleForm.phone" placeholder="手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="密码" prop="password">
              <el-input v-model="state.ruleForm.password" placeholder="密码" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="头像" prop="headPortrait">
              <el-input v-model="state.ruleForm.headPortrait" placeholder="头像" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="微信openid" prop="wxOpenid">
              <el-input v-model="state.ruleForm.wxOpenid" placeholder="微信openid" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="信用分" prop="reputationScore">
              <el-input-number v-model="state.ruleForm.reputationScore" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="级别" prop="level">
              <el-input-number v-model="state.ruleForm.level" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="邀请码" prop="invitationCode">
              <el-input v-model="state.ruleForm.invitationCode" placeholder="邀请码" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="支付密码" prop="payPassword">
              <el-input v-model="state.ruleForm.payPassword" placeholder="支付密码" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="秘钥" prop="privateKey">
              <el-input v-model="state.ruleForm.privateKey" placeholder="秘钥" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="支付宝OPENID" prop="alipayOpenid">
              <el-input v-model="state.ruleForm.alipayOpenid" placeholder="支付宝OPENID" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="抖音OPENID" prop="douyinOpenid">
              <el-input v-model="state.ruleForm.douyinOpenid" placeholder="抖音OPENID" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="最后登录IP" prop="lastLoginIp">
              <el-input v-model="state.ruleForm.lastLoginIp" placeholder="最后登录IP" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="认证信息" prop="authentication">
              <el-input v-model="state.ruleForm.authentication" placeholder="认证信息" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="Token" prop="token">
              <el-input v-model="state.ruleForm.token" placeholder="Token" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="所在城市（根据IP解析）" prop="city">
              <el-input v-model="state.ruleForm.city" placeholder="所在城市（根据IP解析）" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="个性签名" prop="signature">
              <el-input v-model="state.ruleForm.signature" placeholder="个性签名" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="用户标签（多个标签用逗号分隔）" prop="tags">
              <el-input v-model="state.ruleForm.tags" placeholder="用户标签（多个标签用逗号分隔）" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="个人中心背景图" prop="memberBgImg">
              <el-input v-model="state.ruleForm.memberBgImg" placeholder="个人中心背景图" clearable />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否已实名认证（true: 已认证, false: 未认证）" prop="hasAuthentication">
              <el-switch v-model="state.ruleForm.hasAuthentication" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否设置邮箱（true: 已设置, false: 未设置）" prop="hasEmail">
              <el-switch v-model="state.ruleForm.hasEmail" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否设置手机号（true: 已设置, false: 未设置）" prop="hasPhone">
              <el-switch v-model="state.ruleForm.hasPhone" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否设置密码（true: 已设置, false: 未设置）" prop="hasPassword">
              <el-switch v-model="state.ruleForm.hasPassword" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="是否绑定提现账户（true: 已绑定, false: 未绑定）" prop="hasWithdrawAccount">
              <el-switch v-model="state.ruleForm.hasWithdrawAccount" />
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="提现账户数量" prop="withdrawAccountCount">
              <el-input-number v-model="state.ruleForm.withdrawAccountCount" class="w100" controls-position="right" />
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
<script setup lang="ts" name="memberStoreMemberDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { MemberStoreMemberEntity } from './type';
  import { Eleme } from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as MemberStoreMemberEntity,
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
    state.ruleForm = {} as MemberStoreMemberEntity;
  };
  const openDialog = (type: string, row?: MemberStoreMemberEntity) => {
    resetForm();
    nextTick(() => {
      if (type === CURDEnum.EDIT && row) {
        state.ruleForm = { ...row } as MemberStoreMemberEntity;
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
