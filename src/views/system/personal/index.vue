<template>
  <div class="personal layout-pd">
    <!-- 主内容区域 -->
    <el-row :gutter="20" class="main-content">
      <!-- 左侧用户卡片 -->
      <el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="8">
        <div class="user-card">
          <!-- 头像区域 -->
          <div class="user-avatar-section">
            <el-dropdown trigger="click" @command="handleAvatarCommand">
              <div class="avatar-wrapper">
                <el-upload
                  class="avatar-upload"
                  :id="uuid"
                  action="#"
                  :http-request="handleHttpUpload"
                  :auto-upload="true"
                  :show-file-list="false"
                  :limit="1"
                >
                  <img
                    class="user-avatar"
                    :src="userInfos.photo || 'https://sxpcwlkj.oss-cn-beijing.aliyuncs.com/defimg.png'"
                    alt="avatar"
                  />
                  <div class="avatar-camera">
                    <el-icon><ele-Camera /></el-icon>
                  </div>
                </el-upload>
              </div>
            </el-dropdown>
          </div>
          <!-- 用户信息 -->
          <div class="user-info">
            <div class="user-name">{{ userInfos.nickName || userInfos.userName }}</div>
            <div class="user-detail">
              <span class="detail-label">身份：</span>
              <span class="detail-value">{{ userInfos.roleName }}</span>
            </div>
            <div class="user-detail">
              <span class="detail-label">登录ip：</span>
              <span class="detail-value">{{ userInfos.loginIp }}</span>
            </div>
            <div class="user-detail">
              <span class="detail-label">登录时间：</span>
              <span class="detail-value">{{ userInfos.loginDate }}</span>
            </div>
          </div>
          <!-- 功能菜单 -->
          <div class="menu-list">
            <div
              class="menu-item"
              :class="{ active: activeMenu === 'password' }"
              @click="handleMenuClick('password')"
            >
              <div class="menu-item-left">
                <div class="menu-icon">
                  <el-icon><ele-User /></el-icon>
                </div>
                <span class="menu-text">账号密码</span>
              </div>
              <el-icon class="menu-arrow"><ele-ArrowRight /></el-icon>
            </div>
            <div
              class="menu-item"
              :class="{ active: activeMenu === 'phone' }"
              @click="handleMenuClick('phone')"
            >
              <div class="menu-item-left">
                <div class="menu-icon">
                  <el-icon><ele-Iphone /></el-icon>
                </div>
                <span class="menu-text">密保手机</span>
              </div>
              <el-icon class="menu-arrow"><ele-ArrowRight /></el-icon>
            </div>
            <div
              class="menu-item"
              :class="{ active: activeMenu === 'email' }"
              @click="handleMenuClick('email')"
            >
              <div class="menu-item-left">
                <div class="menu-icon">
                  <el-icon><ele-Message /></el-icon>
                </div>
                <span class="menu-text">绑定邮箱</span>
              </div>
              <el-icon class="menu-arrow"><ele-ArrowRight /></el-icon>
            </div>
            <div
              class="menu-item"
              :class="{ active: activeMenu === 'wechat' }"
              @click="handleMenuClick('wechat')"
            >
              <div class="menu-item-left">
                <div class="menu-icon">
                  <el-icon><ele-ChatDotRound /></el-icon>
                </div>
                <span class="menu-text">绑定微信</span>
              </div>
              <el-icon class="menu-arrow"><ele-ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧设置区域 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="16" :xl="16">
        <div class="setting-card">
          <!-- 账号密码设置 -->
          <div v-show="activeMenu === 'password'" class="setting-content">
            <div class="setting-title">账号密码</div>
            <div class="setting-form">
              <div class="setting-inline-panel">
                <div v-if="!hasPwdResetEmailBound">
                  <el-alert
                    type="warning"
                    :closable="false"
                    show-icon
                    title="当前账号尚未绑定邮箱，请先在左侧进入「绑定邮箱」完成绑定后再重置密码。"
                  />
                </div>
                <template v-else>
                  <el-form :model="pwdEmailForm" label-width="96px" class="setting-inline-el-form">
                    <el-row :gutter="12">
                      <el-col :xs="24" :sm="14">
                        <el-form-item label="验证码">
                          <el-input
                            v-model="pwdEmailForm.code"
                            maxlength="6"
                            autocomplete="one-time-code"
                            :placeholder="pwdResetCodePlaceholder"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :xs="24" :sm="10" class="inline-send-col">
                        <el-button
                          type="primary"
                          plain
                          :disabled="pwdEmailExitTime !== 60"
                          class="full-w-xs"
                          @click="getPwdResetEmailCode"
                        >
                          {{ pwdEmailExitTime === 60 ? '获取验证码' : pwdEmailExitTime + 's后可重发' }}
                        </el-button>
                      </el-col>
                    </el-row>
                    <el-form-item label="新密码">
                      <el-input show-password v-model="pwdEmailForm.password" autocomplete="new-password" clearable />
                    </el-form-item>
                    <el-form-item label="确认密码">
                      <el-input show-password v-model="pwdEmailForm.passwordTwo" autocomplete="new-password" clearable />
                    </el-form-item>
                    <el-form-item label=" ">
                      <div class="inline-form-actions">
                        <el-button @click="clearPwdEmailInlineForm">重置</el-button>
                        <el-button type="primary" @click="submitPwdEmailReset">保存新密码</el-button>
                      </div>
                    </el-form-item>
                  </el-form>
                </template>
              </div>
            </div>
          </div>

          <!-- 密保手机设置 -->
          <div v-show="activeMenu === 'phone'" class="setting-content">
            <div class="setting-title">密保手机</div>
            <div class="setting-form">
              <div class="form-item">
                <label class="form-label">当前手机：</label>
                <el-input
                  :value="userInfos.phoneNumber || '未绑定'"
                  disabled
                  placeholder="未绑定手机"
                />
              </div>
              <div class="form-item form-btn">
                <el-button type="primary" class="reset-btn" @click="state.dialog = true">
                  {{ userInfos.phoneNumber && userInfos.phoneNumber.length > 0 ? '修改手机' : '绑定手机' }}
                </el-button>
                <el-popconfirm
                  v-if="userInfos.phoneNumber && userInfos.phoneNumber.length > 0"
                  title="是否继续要解除绑定手机号?"
                  @confirm="confirmEvent(1)"
                >
                  <template #reference>
                    <el-button type="danger">解除绑定</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </div>

          <!-- 绑定邮箱设置 -->
          <div v-show="activeMenu === 'email'" class="setting-content">
            <div class="setting-title">绑定邮箱</div>
            <div class="setting-form">
              <div class="form-item">
                <label class="form-label">当前邮箱：</label>
                <el-input
                  :value="userInfos.email || '未绑定'"
                  disabled
                  placeholder="未绑定邮箱"
                />
              </div>
              <div class="form-item form-btn bind-actions-top">
                <el-popconfirm
                  v-if="userInfos.email && userInfos.email.length > 0"
                  title="是否继续要解除绑定邮箱?"
                  @confirm="confirmEvent(2)"
                >
                  <template #reference>
                    <el-button type="danger">解除绑定</el-button>
                  </template>
                </el-popconfirm>
              </div>
              <div class="setting-inline-panel">
                <el-divider content-position="left">{{
                  userInfos.email && userInfos.email.length > 0 ? '修改绑定邮箱' : '绑定邮箱'
                }}</el-divider>
                <el-form
                  ref="ruleFormEmailRef"
                  :model="stateEmail.form"
                  :rules="stateEmail.rules"
                  label-width="96px"
                  status-icon
                  class="setting-inline-el-form"
                >
                  <el-row :gutter="12">
                    <el-col :span="24">
                      <el-form-item label="邮箱" prop="email">
                        <el-input
                          v-model="stateEmail.form.email"
                          autocomplete="email"
                          placeholder="请输入邮箱"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="14">
                      <el-form-item label="验证码" prop="code">
                        <el-input
                          v-model="stateEmail.form.code"
                          autocomplete="off"
                          placeholder="请输入邮箱验证码"
                          maxlength="6"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="10" class="inline-send-col">
                      <el-button
                        type="primary"
                        plain
                        class="full-w-xs"
                        :disabled="bindEmailExitTime !== 60"
                        @click="getEmailCode"
                      >
                        {{
                          bindEmailExitTime === 60 ? '获取验证码' : bindEmailExitTime + 's后可重发'
                        }}
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-form-item label=" ">
                    <div class="inline-form-actions">
                      <el-button @click="resetEmailBindForm(ruleFormEmailRef)">重置</el-button>
                      <el-button type="primary" @click="submitEmailForm(ruleFormEmailRef)">确定</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>

          <!-- 绑定微信设置 -->
          <div v-show="activeMenu === 'wechat'" class="setting-content">
            <div class="setting-title">绑定微信</div>
            <div class="setting-form">
              <div class="form-item">
                <label class="form-label">当前微信：</label>
                <el-input
                  :value="userInfos.wxOpenid || '未绑定'"
                  disabled
                  placeholder="未绑定微信"
                />
              </div>
              <div class="form-item form-btn">
                <el-button type="primary" class="reset-btn" @click="openWxCode">
                  {{ userInfos.wxOpenid && userInfos.wxOpenid.length > 0 ? '修改微信' : '绑定微信' }}
                </el-button>
                <el-popconfirm
                  v-if="userInfos.wxOpenid && userInfos.wxOpenid.length > 0"
                  title="是否继续要解除绑定微信?"
                  @confirm="confirmEvent(3)"
                >
                  <template #reference>
                    <el-button type="danger">解除绑定</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--绑定手机号-->
    <el-dialog
      draggable
      v-model="state.dialog"
      :key="state.key"
      @close="
        state.dialog = false;
        state.key = generateUUID();
      "
      :title="state.title"
      width="450"
    >
      <el-form
        ref="ruleFormRef"
        :model="state.form"
        :rules="state.rules"
        label-width="auto"
        status-icon
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="state.form.phone"
                autocomplete="off"
                placeholder="请输入手机号"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14" class="mt25">
            <el-form-item label="短信码" prop="code">
              <el-input v-model="state.form.code" autocomplete="off" placeholder="请输入短信码" />
            </el-form-item>
          </el-col>
          <el-col :span="10" class="mt25 text-right">
            <el-button type="primary" :disabled="!(exitTime == 60)" @click="getSmsCode">
              {{ exitTime == 60 ? '获取验证码' : exitTime + 's后重新获取' }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!--绑定微信-->
    <el-dialog
      draggable
      v-model="stateWx.dialog"
      :key="stateWx.key"
      @close="wxClose"
      :title="stateWx.title"
      width="450"
    >
      <div v-if="!succeed" class="flex flex-col">
        <div v-if="unCode" class="flex flex-col f-c">
          <div class="fond16 mt-10">
            <el-icon color="#f0a71a" :size="80"><ele-WarningFilled /></el-icon>
          </div>
          <div class="fond16">
            {{ unCodeMsg }}
            <span class="fond16 f-c-1 shou" @click="openWxCode">刷新</span>
          </div>
        </div>
        <div v-else class="flex flex-col f-c">
          <img :src="stateWx.form.wxCode" alt="" style="width: 50%" />
          <div class="mt10 text-center">
            请用微信扫一扫进行绑定
            <span v-if="exitTime > 0">{{ exitTime + 's' }}</span>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col f-c">
        <div class="fond16 mt-10">
          <el-icon color="#2dac34" :size="80"><ele-CircleCheckFilled /></el-icon>
        </div>
        <div class="fond16">绑定成功</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="personal">
  import { reactive, computed, ref, onMounted, onUnmounted, watch } from 'vue';
  import { formatAxis } from '/@/utils/formatTime';
  import { useUserInfo } from '/@/stores/userInfo';
  import { storeToRefs } from 'pinia';
  import { uploadImg } from '/@/views/system/upload';
  import { ElMessage, UploadRequestOptions } from 'element-plus';
  import { generateUUID } from '/@/utils/mms';
  import { smsCode, emailCode } from '/@/views/system/init';
  import { userApi } from '/@/views/system/user';
  import { Session } from '/@/utils/storage';
  import { elEmail, elPhone, email, phone } from '/@/utils/toolsValidate';
  const succeed = ref(false);
  const unCode = ref(false);
  const unCodeMsg = ref('二维码已失效');
  const stores = useUserInfo();
  const { userInfos } = storeToRefs(stores);
  // 引入 api 请求接口
  const baseUserApi = userApi();
  // 倒计时
  const exitTime = ref(60);
  let intervalId: ReturnType<typeof setInterval> | undefined;
  // 生成组件唯一id
  const uuid = ref('id-' + generateUUID());
  const pwdEmailForm = reactive({
    code: '',
    password: '',
    passwordTwo: '',
  });
  const pwdEmailExitTime = ref(60);
  let intervalIdPwd: ReturnType<typeof setInterval> | undefined;
  const hasPwdResetEmailBound = computed(() => !!(userInfos.value.email && `${userInfos.value.email}`.trim()));
  /** 验证码输入框占位：写明验证码将发往的绑定邮箱（与接口返回展示一致） */
  const pwdResetCodePlaceholder = computed(() => {
    const em = `${userInfos.value.email || ''}`.trim();
    if (!em) {
      return '请输入6位验证码';
    }
    return `发送至 ${em}，请输入6位验证码`;
  });

  // 新增：当前激活的菜单
  const activeMenu = ref('password');
  const clearPwdEmailInlineForm = () => {
    if (intervalIdPwd !== undefined) {
      clearInterval(intervalIdPwd);
      intervalIdPwd = undefined;
    }
    pwdEmailExitTime.value = 60;
    pwdEmailForm.code = '';
    pwdEmailForm.password = '';
    pwdEmailForm.passwordTwo = '';
  };
  // 新增：菜单点击处理
  const handleMenuClick = (menu: string) => {
    activeMenu.value = menu;
  };
  // 新增：头像命令处理
  const handleAvatarCommand = (command: string) => {
    if (command === 'upload') {
      // 触发上传
    }
  };

  // 绑定手机号码
  const ruleFormRef = ref<FormInstance>();
  interface TypeForm {
    phone: string;
    code: string;
  }
  const state = reactive<VerifyType<TypeForm>>({
    dialog: false,
    key: generateUUID(),
    title: '绑定手机号',
    form: {
      phone: '',
      code: '',
    },
    rules: {
      phone: [{ required: true, validator: elPhone, trigger: 'blur' }],
      code: [
        { required: true, message: '请输入短信验证码', trigger: 'blur' },
        { required: true, min: 6, max: 6, message: '请输入正确的短信验证码', trigger: 'blur' },
      ],
    },
  });
  //解除手机号
  const confirmEvent = (type: number) => {
    baseUserApi
      .unbind(type)
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          state.dialog = false;
          updateUserInfo();
        }
      })
      .catch((err) => {
        ElMessage.error(err);
      });
  };

  // 发送短信
  const getSmsCode = () => {
    if (!phone(state.form.phone)) {
      ElMessage.error('请正确输入手机号');
      return;
    }
    smsCode({ ...state.form, ...{ type: 5 } })
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          state.form.code = '';
          intervalId = setInterval(() => {
            if (exitTime.value <= 0) {
              clearInterval(intervalId);
              exitTime.value = 60;
              return;
            }
            exitTime.value--;
          }, 1000);
        }
      })
      .catch((e) => {
        ElMessage.error(e);
      });
  };
  // 验证
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        baseUserApi
          .bindingPhone(state.form)
          .then((res) => {
            if (res.code === 200) {
              ElMessage.success(res.msg);
              state.dialog = false;
              updateUserInfo();
            }
          })
          .catch((err) => {
            ElMessage.error(err);
          });
      } else {
        // eslint-disable-next-line no-console
        console.log('error submit!', fields);
      }
    });
  };
  // 重置
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  const bindEmailExitTime = ref(60);
  let intervalIdBindEmail: ReturnType<typeof setInterval> | undefined;

  const clearBindEmailCountdown = () => {
    if (intervalIdBindEmail !== undefined) {
      clearInterval(intervalIdBindEmail);
      intervalIdBindEmail = undefined;
    }
    bindEmailExitTime.value = 60;
  };

  /** 重置「绑定邮箱」内联表单并重置倒计时 */
  const resetEmailBindForm = (formEl: FormInstance | undefined) => {
    resetForm(formEl);
    clearBindEmailCountdown();
  };

  watch(activeMenu, (menu, prev) => {
    if (prev === 'password' && menu !== 'password') {
      clearPwdEmailInlineForm();
    }
    if (prev === 'email' && menu !== 'email') {
      clearBindEmailCountdown();
    }
  });

  const getPwdResetEmailCode = () => {
    if (!hasPwdResetEmailBound.value) {
      ElMessage.warning('请先绑定邮箱');
      return;
    }
    if (pwdEmailExitTime.value !== 60) {
      return;
    }
    emailCode({ type: 3 })
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          pwdEmailForm.code = '';
          intervalIdPwd = setInterval(() => {
            if (pwdEmailExitTime.value <= 0) {
              if (intervalIdPwd !== undefined) {
                clearInterval(intervalIdPwd);
                intervalIdPwd = undefined;
              }
              pwdEmailExitTime.value = 60;
              return;
            }
            pwdEmailExitTime.value--;
          }, 1000);
        }
      })
      .catch((e) => {
        ElMessage.error(e as any);
      });
  };

  const submitPwdEmailReset = () => {
    if (!hasPwdResetEmailBound.value) {
      ElMessage.warning('请先绑定邮箱');
      return;
    }
    if (!pwdEmailForm.code || pwdEmailForm.code.length !== 6) {
      ElMessage.warning('请输入6位验证码');
      return;
    }
    if (pwdEmailForm.password !== pwdEmailForm.passwordTwo) {
      ElMessage.error('两次密码输入不一致');
      return;
    }
    if ((pwdEmailForm.password || '').length < 6) {
      ElMessage.error('新密码至少6位');
      return;
    }
    baseUserApi
      .resetPwdEmail({ code: pwdEmailForm.code, password: pwdEmailForm.password })
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          updateUserInfo();
          clearPwdEmailInlineForm();
        }
      })
      .catch((err) => {
        ElMessage.error(err);
      });
  };
  // 上传图片
  const handleHttpUpload = async (options: UploadRequestOptions) => {
    let formData = new FormData();
    formData.append('file', options.file);
    try {
      await uploadImg(formData).then((res) => {
        if (res.code === 200) {
          options.onSuccess(res.msg);
          userInfos.value.photo = res.data.url;
          Session.set('userInfo', userInfos.value);
          // 更新用户信息
          baseUserApi
            .editHeaderImg({ avatar: res.data.url })
            .then((res) => {
              if (res.code === 200) {
                options.onSuccess(res.msg);
                ElMessage.success(res.msg);
              }
            })
            .catch((err) => {
              ElMessage.error(err);
            });
        }
      });
    } catch (error) {
      options.onError(error as any);
    }
  };
  // 当前时间提示语
  const currentTime = computed(() => {
    return formatAxis(new Date());
  });

  // 绑定手机号码
  const ruleFormEmailRef = ref<FormInstance>();
  interface TypeEmailForm {
    email: string;
    code: string;
  }

  const stateEmail = reactive<VerifyType<TypeEmailForm>>({
    form: {
      email: '',
      code: '',
    },
    rules: {
      email: [{ required: true, validator: elEmail, trigger: 'blur' }],
      code: [
        { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
        { required: true, min: 6, max: 6, message: '请输入正确的邮箱验证码', trigger: 'blur' },
      ],
    },
  });
  // 发送邮件
  const getEmailCode = () => {
    if (!email(stateEmail.form.email)) {
      ElMessage.error('请正确输入邮箱');
      return;
    }
    if (bindEmailExitTime.value !== 60) {
      return;
    }
    emailCode({ ...stateEmail.form, ...{ type: 1 } })
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          stateEmail.form.code = '';
          intervalIdBindEmail = setInterval(() => {
            if (bindEmailExitTime.value <= 0) {
              if (intervalIdBindEmail !== undefined) {
                clearInterval(intervalIdBindEmail);
                intervalIdBindEmail = undefined;
              }
              bindEmailExitTime.value = 60;
              return;
            }
            bindEmailExitTime.value--;
          }, 1000);
        }
      })
      .catch((e) => {
        ElMessage.error(e);
      });
  };
  // 验证
  const submitEmailForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        baseUserApi
          .bindingEmail(stateEmail.form)
          .then((res) => {
            if (res.code === 200) {
              ElMessage.success(res.msg);
              updateUserInfo();
              resetEmailBindForm(formEl);
            }
          })
          .catch((err) => {
            ElMessage.error(err);
          });
      } else {
        // eslint-disable-next-line no-console
        console.log('error submit!', fields);
      }
    });
  };

  // 更新用户信息
  const updateUserInfo = () => {
    baseUserApi.getUserInfo().then((res) => {
      if (res.code === 200) {
        userInfos.value = res.data;
        Session.set('userInfo', userInfos.value);
      }
    });
  };

  // 绑定微信
  const wxUuid = ref(generateUUID() as string);
  // 二维码
  const openWxCode = () => {
    // 获取二维码
    wxUuid.value = generateUUID() as string;
    unCode.value = false;
    succeed.value = false;
    exitTime.value = 60;
    baseUserApi.getWxCode(wxUuid.value).then((res) => {
      stateWx.dialog = true;
      stateWx.form.wxCode = res.data as string;
      queryWxCodeState();
      intervalId = setInterval(() => {
        if (exitTime.value <= 0) {
          unCode.value = true;
          unCodeMsg.value = '二维码已失效';
          succeed.value = false;
          clearInterval(intervalId);
          clearInterval(intervalIdWxState);
          return;
        }
        exitTime.value--;
      }, 1000);
    });
  };
  interface TypeWxForm {
    wxCode: string;
    state: number;
  }
  const stateWx = reactive<VerifyType<TypeWxForm>>({
    dialog: false,
    key: generateUUID(),
    title: '绑定微信',
    form: {
      wxCode: '',
      state: 1,
    },
    rules: {},
  });
  let intervalIdWxState: ReturnType<typeof setInterval> | undefined;
  // 查询二维码状态
  const queryWxCodeState = () => {
    intervalIdWxState = setInterval(() => {
      baseUserApi.queryWxCodeState(wxUuid.value).then((res) => {
        if (res.status == 0) {
          succeed.value = true;
          unCode.value = false;
          updateUserInfo();
          clearInterval(intervalIdWxState);
          clearInterval(intervalId);
        } else {
          unCodeMsg.value = res.msg as string;
          succeed.value = false;
          unCode.value = true;
          exitTime.value = 0;
          clearInterval(intervalId);
          clearInterval(intervalIdWxState);
        }
      });
    }, 3000);
  };
  const wxClose = () => {
    stateWx.dialog = false;
    stateWx.key = generateUUID();
    clearInterval(intervalIdWxState);
    clearInterval(intervalId);
  };
  onUnmounted(() => {
    // 销毁事件
    clearInterval(intervalIdWxState);
    clearInterval(intervalId);
    if (intervalIdPwd !== undefined) {
      clearInterval(intervalIdPwd);
    }
    if (intervalIdBindEmail !== undefined) {
      clearInterval(intervalIdBindEmail);
    }
  });
  // 页面加载时
  onMounted(() => {
    updateUserInfo();
  });
</script>

<style scoped lang="scss">
  @use '/src/theme/mixins/index.scss' as v;

  .personal {
    padding: 20px;
    
    // 主内容区域
    .main-content {
      height: 600px;
      // 左侧用户卡片
      .user-card {
        height: 100%;
        background: var(--el-color-white);
        border-radius: 8px;
        padding: 30px 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        text-align: center;

        // 头像区域
        .user-avatar-section {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;

          .avatar-wrapper {
            position: relative;
            cursor: pointer;

            .avatar-upload {
              :deep(.el-upload) {
                border-radius: 50%;
              }
            }

            .user-avatar {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid #f0f0f0;
              transition: all 0.3s;

              &:hover {
                border-color: var(--el-color-primary);
              }
            }

            .avatar-camera {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 28px;
              height: 28px;
              background: var(--el-color-white);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #858EBD;
              font-size: 14px;
              border: 2px solid #fff;
            }
          }
        }

        // 用户信息
        .user-info {
          margin-bottom: 25px;

          .user-name {
            font-size: 18px;
            color: #333;
            margin-bottom: 8px;
          }

          .user-detail {
            font-size: 14px;
            color: #999;
            margin-bottom: 5px;

            .detail-label {
              color: #999;
            }

            .detail-value {
              color: #666;
            }
          }
        }

        // 功能菜单
        .menu-list {
          .menu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            margin-bottom: 10px;
            background: #fafafa;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;

            &:last-child {
              margin-bottom: 0;
            }

            &:hover,
            &.active {
              background: #f0f7ff !important;
              
              .menu-arrow {
                color: var(--el-color-primary);
              }
            }
            .menu-item-left {
              display: flex;
              align-items: center;
              gap: 12px;

              .menu-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 18px;
                font-weight: 600;
                background: linear-gradient(135deg, #4F8AFF 0%, #4B5EFF 100%);
              }

              .menu-text {
                font-size: 14px;
                color: #333;
              }
            }

            .menu-arrow {
              color: #ccc;
              transition: all 0.3s;
            }
          }
        }
      }

      // 右侧设置卡片
      .setting-card {
        height: 100%;
        background: var(--el-color-white);
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        min-height: 400px;

        @media screen and (max-width: 768px) {
          margin-top: 20px;
        }

        .setting-content {
          .setting-title {
            font-size: 18px;
            color: #333;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
          }

          .setting-form {
            max-width: 560px;

            .form-item {
              display: flex;
              align-items: center;
              margin-bottom: 60px;

              .form-label {
                width: 80px;
                font-size: 14px;
                color: #666;
                flex-shrink: 0;
              }

              :deep(.el-input) {
                flex: 1;
              }

              &.form-btn {
                margin-top: 40px;
                /* 与同表单 .form-label(80px) 后的输入框左缘对齐 */
                margin-left: 80px;
                align-items: center;
                justify-content: flex-start;
                flex-wrap: wrap;
                gap: 12px;

                .reset-btn {
                  flex-shrink: 0;
                  min-width: 120px;
                  height: 40px;
                  font-size: 14px;
                }

                &.bind-actions-top {
                  margin-top: 12px;
                  margin-bottom: 8px;
                }
              }
            }

            .setting-inline-panel {
              width: 100%;
              max-width: 540px;

              :deep(.el-divider) {
                margin: 8px 0 18px;
              }

              :deep(.el-divider__text) {
                font-weight: 600;
                font-size: 14px;
              }

              .inline-send-col {
                display: flex;
                align-items: flex-end;
                padding-bottom: 18px;
              }

              .inline-form-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
              }

              .full-w-xs {
                min-height: var(--el-component-size-default);
              }

              :deep(.setting-inline-el-form .el-form-item:last-of-type) {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }

    // 弹窗样式
    .fond16 {
      font-size: 16px;
      text-align: center;
    }

    .mt-10 {
      margin-top: 10px;
      margin-bottom: 20px;
    }
  }

  // 响应式调整
  @media screen and (max-width: 992px) {
    .personal {
      .main-content {
        .user-card {
          margin-bottom: 20px;
        }
      }
    }
  }

  @media screen and (max-width: 576px) {
    .personal {
      padding: 10px;

      .main-content {
        .setting-card {
          padding: 20px;

          .setting-content {
            .setting-form {
              .form-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;

                .form-label {
                  width: auto;
                }

                :deep(.el-input) {
                  width: 100%;
                }

                &.form-btn {
                  margin-left: 0;
                }
              }

              .setting-inline-panel {
                max-width: 100%;

                .inline-send-col {
                  align-items: stretch;
                  padding-bottom: 0;
                  padding-top: 4px;
                  width: 100%;

                  .full-w-xs {
                    width: 100%;
                  }
                }

                .inline-form-actions .el-button {
                  flex: 1;
                  min-width: 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
