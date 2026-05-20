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
              <span class="detail-value">
                <template v-if="userInfos.loginIp"
                  >{{ userInfos.loginIp }}（{{ userInfos.loginRegion || '未知' }}）</template
                >
                <template v-else>—</template>
              </span>
            </div>
            <div class="user-detail">
              <span class="detail-label">登录时间：</span>
              <span class="detail-value">{{ formatUserLoginDate(userInfos.loginDate) }}</span>
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
                  <el-form
                    :model="pwdEmailForm"
                    label-width="96px"
                    class="setting-inline-el-form setting-pwd-email-form"
                  >
                    <el-form-item label="验证码">
                      <div class="pwd-email-code-block">
                        <div class="code-with-send">
                          <el-input
                            v-model="pwdEmailForm.code"
                            maxlength="6"
                            autocomplete="one-time-code"
                            placeholder="请输入6位验证码"
                            clearable
                          />
                          <el-button
                            type="primary"
                            plain
                            :disabled="pwdEmailExitTime !== 60"
                            @click="getPwdResetEmailCode"
                          >
                            {{ pwdEmailExitTime === 60 ? '获取验证码' : pwdEmailExitTime + 's后可重发' }}
                          </el-button>
                        </div>
                        <p v-if="pwdResetCodeSendToLine" class="pwd-email-code-sendto">{{ pwdResetCodeSendToLine }}</p>
                      </div>
                    </el-form-item>
                    <el-form-item label="新密码">
                      <div class="pwd-with-strength">
                        <el-input
                          show-password
                          v-model="pwdEmailForm.password"
                          autocomplete="new-password"
                          :placeholder="pwdCompositionHintShort"
                          :title="pwdCompositionHintDetail"
                          clearable
                        />
                        <PwdStrengthMeter :password="pwdEmailForm.password" />
                      </div>
                    </el-form-item>
                    <el-form-item label="确认密码">
                      <div class="pwd-with-strength pwd-with-strength--trail-only">
                        <el-input
                          show-password
                          v-model="pwdEmailForm.passwordTwo"
                          autocomplete="new-password"
                          :placeholder="pwdCompositionHintShort"
                          :title="pwdCompositionHintDetail"
                          clearable
                          @blur="onPwdEmailConfirmBlur"
                        />
                        <div class="pwd-email-confirm-match" aria-live="polite">
                          <span
                            v-if="pwdEmailConfirmMatchLabel"
                            :class="{
                              'is-match': pwdEmailConfirmMatchLabel === '一致',
                              'is-mismatch': pwdEmailConfirmMatchLabel === '不一致',
                            }"
                          >
                            {{ pwdEmailConfirmMatchLabel }}
                          </span>
                        </div>
                      </div>
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
              <el-form
                ref="ruleFormRef"
                :model="state.form"
                :rules="state.rules"
                label-width="96px"
                status-icon
                class="setting-inline-el-form"
              >
                <el-form-item label="当前手机：">
                  <div class="current-field-with-action">
                    <span class="current-field-text" :title="userInfos.phoneNumber || '未绑定'">
                      {{ userInfos.phoneNumber || '未绑定' }}
                    </span>
                    <el-popconfirm
                      v-if="userInfos.phoneNumber && userInfos.phoneNumber.length > 0"
                      title="是否继续要解除绑定手机号?"
                      @confirm="confirmEvent(1)"
                    >
                      <template #reference>
                        <el-link type="danger" :underline="false" class="field-unbind-link">解除绑定</el-link>
                      </template>
                    </el-popconfirm>
                  </div>
                </el-form-item>
                <div class="setting-inline-panel">
                  <el-divider content-position="left">
                    {{ userInfos.phoneNumber && userInfos.phoneNumber.length > 0 ? '修改绑定手机' : '绑定手机' }}
                  </el-divider>
                  <el-form-item label="新手机号" prop="phone">
                    <el-input
                      v-model="state.form.phone"
                      autocomplete="tel"
                      placeholder="请输入新手机号"
                      maxlength="11"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="验证码" prop="code">
                    <div class="code-with-send">
                      <el-input
                        v-model="state.form.code"
                        autocomplete="one-time-code"
                        placeholder="请输入短信验证码"
                        maxlength="6"
                        clearable
                      />
                      <el-button
                        type="primary"
                        plain
                        :disabled="bindPhoneExitTime !== 60"
                        @click="getSmsCode"
                      >
                        {{
                          bindPhoneExitTime === 60 ? '获取验证码' : bindPhoneExitTime + 's后可重发'
                        }}
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label=" ">
                    <div class="inline-form-actions">
                      <el-button @click="resetPhoneBindForm(ruleFormRef)">重置</el-button>
                      <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>

          <!-- 绑定邮箱设置 -->
          <div v-show="activeMenu === 'email'" class="setting-content">
            <div class="setting-title">绑定邮箱</div>
            <div class="setting-form">
              <el-form
                ref="ruleFormEmailRef"
                :model="stateEmail.form"
                :rules="stateEmail.rules"
                label-width="96px"
                status-icon
                class="setting-inline-el-form"
              >
                <el-form-item label="当前邮箱：">
                  <div class="current-field-with-action">
                    <span class="current-field-text" :title="userInfos.email || '未绑定'">
                      {{ userInfos.email || '未绑定' }}
                    </span>
                    <el-popconfirm
                      v-if="userInfos.email && userInfos.email.length > 0"
                      title="是否继续要解除绑定邮箱?"
                      @confirm="confirmEvent(2)"
                    >
                      <template #reference>
                        <el-link type="danger" :underline="false" class="field-unbind-link">解除绑定</el-link>
                      </template>
                    </el-popconfirm>
                  </div>
                </el-form-item>
                <div class="setting-inline-panel">
                  <el-divider content-position="left">{{
                    userInfos.email && userInfos.email.length > 0 ? '修改绑定邮箱' : '绑定邮箱'
                  }}</el-divider>
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      v-model="stateEmail.form.email"
                      autocomplete="email"
                      placeholder="请输入邮箱"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="验证码" prop="code">
                    <div class="code-with-send">
                      <el-input
                        v-model="stateEmail.form.code"
                        autocomplete="off"
                        placeholder="请输入邮箱验证码"
                        maxlength="6"
                        clearable
                      />
                      <el-button
                        type="primary"
                        plain
                        :disabled="bindEmailExitTime !== 60"
                        @click="getEmailCode"
                      >
                        {{
                          bindEmailExitTime === 60 ? '获取验证码' : bindEmailExitTime + 's后可重发'
                        }}
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label=" ">
                    <div class="inline-form-actions">
                      <el-button @click="resetEmailBindForm(ruleFormEmailRef)">重置</el-button>
                      <el-button type="primary" @click="submitEmailForm(ruleFormEmailRef)">确定</el-button>
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>

          <!-- 绑定微信设置 -->
          <div v-show="activeMenu === 'wechat'" class="setting-content">
            <div class="setting-title">绑定微信</div>
            <div class="setting-form">
              <template v-if="!isWxBound">
                <div class="wx-bind-inline">
                  <template v-if="wxInlineUnCode">
                    <div class="wx-bind-inline__fail">
                      <el-icon color="#f0a71a" :size="48"><ele-WarningFilled /></el-icon>
                      <p>{{ wxInlineUnMsg }}</p>
                      <div class="wx-bind-inline__refresh-wrap">
                        <el-button type="primary" link @click="startInlineWxBind({ newSession: true })"
                          >刷新二维码</el-button
                        >
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="wx-bind-inline__qr">
                      <div v-if="wxInlineQrBroken" class="wx-bind-inline__qr-broken">
                        <div class="wx-bind-inline__qr-broken-visual" aria-hidden="true">
                          <span class="wx-bind-inline__qr-broken-crack" />
                        </div>
                        <p class="wx-bind-inline__qr-broken-msg">
                          <template v-if="wxInlineQrFailDetail">{{ wxInlineQrFailDetail }}</template>
                          <template v-else>二维码生成失败或已损坏，请刷新重试</template>
                        </p>
                      </div>
                      <img
                        v-else-if="wxInlineQrUrl"
                        :src="wxInlineQrUrl"
                        alt="微信绑定二维码"
                        @error="onWxInlineQrImgError"
                      />
                      <div v-else class="wx-bind-inline__loading">二维码加载中…</div>
                    </div>
                    <p class="wx-bind-inline__hint">
                      微信扫一扫完成绑定
                      <span v-if="wxInlineExitTime > 0 && !wxInlineQrBroken" class="wx-bind-inline__time"
                        >（{{ wxInlineExitTime }}s）</span>
                    </p>
                    <div class="wx-bind-inline__refresh-wrap">
                      <el-button type="primary" link @click="startInlineWxBind({ newSession: true })"
                        >刷新二维码</el-button
                      >
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <div class="form-item">
                  <label class="form-label">当前微信：</label>
                  <div class="current-field-with-action">
                    <span class="current-field-text" :title="userInfos.wxOpenid || ''">
                      {{ maskWxOpenid(userInfos.wxOpenid) }}
                    </span>
                    <el-link type="primary" :underline="false" class="field-change-link" @click="openWxCode">
                      更换绑定
                    </el-link>
                    <el-popconfirm title="是否继续要解除绑定微信?" @confirm="confirmEvent(3)">
                      <template #reference>
                        <el-link type="danger" :underline="false" class="field-unbind-link">解除绑定</el-link>
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
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
          <div v-if="wxDialogQrBroken" class="wx-dialog-qr-broken">
            <div class="wx-dialog-qr-broken__visual" aria-hidden="true">
              <span class="wx-dialog-qr-broken__crack" />
            </div>
            <p class="wx-dialog-qr-broken__msg">
              <template v-if="wxDialogQrFailDetail">{{ wxDialogQrFailDetail }}</template>
              <template v-else>二维码生成失败或已损坏，请点击刷新</template>
            </p>
          </div>
          <img
            v-else
            :src="stateWx.form.wxCode"
            alt=""
            style="width: 50%"
            @error="onWxDialogQrImgError"
          />
          <div class="mt10 text-center">
            微信扫一扫完成绑定
            <span v-if="exitTime > 0 && !wxDialogQrBroken">{{ exitTime + 's' }}</span>
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
  import { formatAxis, formatDate } from '/@/utils/formatTime';
  import { useUserInfo } from '/@/stores/userInfo';
  import { storeToRefs } from 'pinia';
  import { uploadImg } from '/@/views/system/upload';
  import { ElMessage, UploadRequestOptions } from 'element-plus';
  import { generateUUID, getEnv } from '/@/utils/mms';
  import { SysEnum } from '/@/enums/SysEnum';
  import { smsCode, emailCode } from '/@/views/system/init';
  import { userApi } from '/@/views/system/user';
  import { Session } from '/@/utils/storage';
  import { elEmail, elPhone, email, phone } from '/@/utils/toolsValidate';
  import PwdStrengthMeter from '/@/components/pwd-strength-meter/index.vue';
  import type { FormInstance } from 'element-plus';

  /** 刷新后沿用同一张绑定会话（与登录页 sessionStorage 策略一致） */
  const WX_BIND_INLINE_UUID_KEY = 'mms_personal_wx_bind_inline_uuid';

  const readStoredWxInlineUuid = (): string | null => {
    try {
      const s = sessionStorage.getItem(WX_BIND_INLINE_UUID_KEY);
      return s && `${s}`.trim().length >= 16 ? s : null;
    } catch {
      return null;
    }
  };

  const persistWxInlineUuid = (uid: string) => {
    try {
      sessionStorage.setItem(WX_BIND_INLINE_UUID_KEY, uid);
    } catch {
      /* ignore */
    }
  };

  const clearWxInlineUuidStorage = () => {
    try {
      sessionStorage.removeItem(WX_BIND_INLINE_UUID_KEY);
    } catch {
      /* ignore */
    }
  };

  const succeed = ref(false);
  const unCode = ref(false);
  const unCodeMsg = ref('二维码已失效');
  const stores = useUserInfo();
  const { userInfos } = storeToRefs(stores);
  // 引入 api 请求接口
  const baseUserApi = userApi();

  /** 最后登录时间展示为本地习惯格式（兼容接口返回的 Date 字符串 / ISO） */
  const formatUserLoginDate = (raw: unknown) => {
    if (raw === null || raw === undefined || `${raw}`.trim() === '') return '—';
    const d = new Date(raw as string | number | Date);
    if (Number.isNaN(d.getTime())) return `${raw}`;
    return formatDate(d, 'YYYY-mm-dd HH:MM:SS');
  };
  // 倒计时
  const exitTime = ref(60);
  let intervalId: ReturnType<typeof setInterval> | undefined;
  /** 页内微信绑定：扫码结果经 SSE（/system/user/wxBind/stream），二维码仍由 getWxCode 获取 */
  let intervalIdWxInline: ReturnType<typeof setInterval> | undefined;
  let wxInlineBindEs: EventSource | null = null;
  let wxDialogBindEs: EventSource | null = null;
  const wxInlineQrUrl = ref('');
  /** 生成二维码接口失败或图片加载失败时展示裂图占位 */
  const wxInlineQrBroken = ref(false);
  /** 接口/后端返回的失败原因，展示在裂图区域 */
  const wxInlineQrFailDetail = ref('');
  const wxDialogQrBroken = ref(false);
  const wxDialogQrFailDetail = ref('');
  const wxInlineUuid = ref('');
  const wxInlineUnCode = ref(false);
  const wxInlineUnMsg = ref('');
  const wxInlineExitTime = ref(60);
  // 生成组件唯一id
  const uuid = ref('id-' + generateUUID());
  const pwdEmailForm = reactive({
    code: '',
    password: '',
    passwordTwo: '',
  });
  /** 密码规则：短文案用于占位；完整说明放在 title 悬停 */
  const pwdCompositionHintShort = '大小写、数字、符号至少含三种';
  const pwdCompositionHintDetail =
    '密码须由大写字母、小写字母、数字、符号中至少包含三种';
  const pwdEmailExitTime = ref(60);
  let intervalIdPwd: ReturnType<typeof setInterval> | undefined;
  const hasPwdResetEmailBound = computed(() => !!(userInfos.value.email && `${userInfos.value.email}`.trim()));
  /** 是否已绑定微信（有 openid） */
  const isWxBound = computed(() => !!(userInfos.value.wxOpenid && `${userInfos.value.wxOpenid}`.trim()));

  /** OpenID 脱敏 */
  const maskWxOpenid = (openid: string | undefined) => {
    const s = `${openid || ''}`.trim();
    if (!s) return '—';
    if (s.length <= 8) return `${s.slice(0, 2)}****`;
    return `${s.slice(0, 4)}****${s.slice(-4)}`;
  };

  /** 邮箱脱敏展示：8**@qq.com，用于验证码「发送至」说明 */
  const maskEmailForPwdHint = (email: string) => {
    const s = `${email || ''}`.trim();
    const at = s.indexOf('@');
    if (at < 1) return s;
    const local = s.slice(0, at);
    const domain = s.slice(at + 1);
    if (!domain) return s;
    const head = local.slice(0, 1) || '*';
    return `${head}**@${domain}`;
  };

  /** 显示在验证码输入框下方的「发送至 …」 */
  const pwdResetCodeSendToLine = computed(() => {
    const em = `${userInfos.value.email || ''}`.trim();
    if (!em) return '';
    return `发送至 ${maskEmailForPwdHint(em)}`;
  });

  /** 确认密码失焦后才显示与新密码是否一致 */
  const pwdEmailConfirmBlurred = ref(false);
  const onPwdEmailConfirmBlur = () => {
    pwdEmailConfirmBlurred.value = true;
  };

  /** 失焦且已填写确认密码时：一致 / 不一致 */
  const pwdEmailConfirmMatchLabel = computed(() => {
    if (!pwdEmailConfirmBlurred.value) {
      return '';
    }
    const p1 = pwdEmailForm.password ?? '';
    const p2 = pwdEmailForm.passwordTwo ?? '';
    if (!p2) {
      return '';
    }
    return p1 === p2 ? '一致' : '不一致';
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
    pwdEmailConfirmBlurred.value = false;
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

  const bindPhoneExitTime = ref(60);
  let intervalIdBindPhone: ReturnType<typeof setInterval> | undefined;

  const clearBindPhoneCountdown = () => {
    if (intervalIdBindPhone !== undefined) {
      clearInterval(intervalIdBindPhone);
      intervalIdBindPhone = undefined;
    }
    bindPhoneExitTime.value = 60;
  };

  //解除手机号
  const confirmEvent = (type: number) => {
    baseUserApi
      .unbind(type)
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          updateUserInfo();
          if (type === 3) {
            clearWxInlineUuidStorage();
          }
        }
      })
      .catch((err) => {
        ElMessage.error(err);
      });
  };

  // 重置
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  const resetPhoneBindForm = (formEl: FormInstance | undefined) => {
    resetForm(formEl);
    clearBindPhoneCountdown();
  };

  // 发送短信（绑定/更换手机）
  const getSmsCode = () => {
    if (!phone(state.form.phone)) {
      ElMessage.error('请正确输入新手机号');
      return;
    }
    if (bindPhoneExitTime.value !== 60) {
      return;
    }
    smsCode({ ...state.form, ...{ type: 5 } })
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
          state.form.code = '';
          intervalIdBindPhone = setInterval(() => {
            if (bindPhoneExitTime.value <= 0) {
              if (intervalIdBindPhone !== undefined) {
                clearInterval(intervalIdBindPhone);
                intervalIdBindPhone = undefined;
              }
              bindPhoneExitTime.value = 60;
              return;
            }
            bindPhoneExitTime.value--;
          }, 1000);
        }
      })
      .catch((e) => {
        ElMessage.error(e);
      });
  };

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        baseUserApi
          .bindingPhone(state.form)
          .then((res) => {
            if (res.code === 200) {
              ElMessage.success(res.msg);
              updateUserInfo();
              resetPhoneBindForm(formEl);
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
    if (prev === 'phone' && menu !== 'phone') {
      clearBindPhoneCountdown();
    }
    if (menu === 'wechat' && !isWxBound.value) {
      startInlineWxBind();
    }
    if (prev === 'wechat' && menu !== 'wechat') {
      stopInlineWxBind();
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

  const buildWxBindSseUrl = (uid: string) => {
    const baseApiPrefix = getEnv().replace(/\/$/, '');
    const token = Session.get(SysEnum.TOKEN_KEY);
    if (!token || !uid) return '';
    return `${baseApiPrefix}/system/user/wxBind/stream?uuid=${encodeURIComponent(uid)}&Authorization=${encodeURIComponent(String(token))}`;
  };

  const stopWxDialogBindEs = () => {
    try {
      wxDialogBindEs?.close();
    } catch (e) {
      /* ignore */
    }
    wxDialogBindEs = null;
  };

  const startWxBindSse = (uid: string, mode: 'inline' | 'dialog') => {
    if (mode === 'inline') {
      try {
        wxInlineBindEs?.close();
      } catch (e) {
        /* ignore */
      }
      wxInlineBindEs = null;
    } else {
      stopWxDialogBindEs();
    }
    const url = buildWxBindSseUrl(uid);
    if (!url) {
      ElMessage.warning('未获取到登录信息，无法监听扫码结果');
      return;
    }
    if (!(window as unknown as { EventSource?: typeof EventSource }).EventSource) {
      ElMessage.warning('当前浏览器不支持实时扫码推送（SSE），请使用 Chrome / Edge 等最新版本');
      return;
    }
    const es = new EventSource(url);
    if (mode === 'inline') wxInlineBindEs = es;
    else wxDialogBindEs = es;

    const finishEs = () => {
      try {
        es.close();
      } catch (e) {
        /* ignore */
      }
      if (mode === 'inline') wxInlineBindEs = null;
      else wxDialogBindEs = null;
    };

    es.addEventListener('done', (evt: MessageEvent) => {
      finishEs();
      try {
        const raw = (evt as MessageEvent).data;
        const d = typeof raw === 'string' ? JSON.parse(raw || '{}') : {};
        if (d.ok === true) {
          if (mode === 'inline') {
            clearWxInlineUuidStorage();
            stopInlineWxBind();
            updateUserInfo();
          } else {
            succeed.value = true;
            unCode.value = false;
            updateUserInfo();
            if (intervalId !== undefined) {
              clearInterval(intervalId);
              intervalId = undefined;
            }
          }
        } else {
          const m = (d.msg as string) || '操作失败';
          if (mode === 'inline') {
            wxInlineUnMsg.value = m;
            wxInlineUnCode.value = true;
            wxInlineExitTime.value = 0;
            stopInlineWxBind();
          } else {
            unCodeMsg.value = m;
            succeed.value = false;
            unCode.value = true;
            exitTime.value = 0;
            if (intervalId !== undefined) {
              clearInterval(intervalId);
              intervalId = undefined;
            }
          }
        }
      } catch (e) {
        /* ignore */
      }
    });

    es.onerror = () => {
      finishEs();
    };
  };

  const onWxInlineQrImgError = () => {
    wxInlineQrBroken.value = true;
    wxInlineExitTime.value = 0;
    wxInlineQrFailDetail.value = wxInlineQrFailDetail.value || '二维码图片无法加载，请刷新重试';
  };

  const onWxDialogQrImgError = () => {
    wxDialogQrBroken.value = true;
    exitTime.value = 0;
    wxDialogQrFailDetail.value = wxDialogQrFailDetail.value || '二维码图片无法加载，请刷新重试';
  };

  /** 停止页内微信二维码倒计时与 SSE */
  const stopInlineWxBind = () => {
    if (intervalIdWxInline !== undefined) {
      clearInterval(intervalIdWxInline);
      intervalIdWxInline = undefined;
    }
    try {
      wxInlineBindEs?.close();
    } catch (e) {
      /* ignore */
    }
    wxInlineBindEs = null;
  };

  /** 未绑定：页内获取二维码并由 SSE 推送扫码结果；默认复用 sessionStorage 中的 uuid（刷新页面可续扫） */
  const startInlineWxBind = (opts?: { newSession?: boolean }) => {
    if (isWxBound.value) return;
    stopInlineWxBind();
    wxInlineUnCode.value = false;
    wxInlineQrUrl.value = '';
    wxInlineQrBroken.value = false;
    wxInlineQrFailDetail.value = '';
    wxInlineExitTime.value = 60;
    if (opts?.newSession === true) {
      wxInlineUuid.value = generateUUID() as string;
      persistWxInlineUuid(wxInlineUuid.value);
    } else {
      const st = readStoredWxInlineUuid();
      if (st) {
        wxInlineUuid.value = st;
      } else {
        wxInlineUuid.value = generateUUID() as string;
        persistWxInlineUuid(wxInlineUuid.value);
      }
    }
    baseUserApi
      .getWxCode(wxInlineUuid.value)
      .then((res) => {
        const url = `${res.data ?? ''}`.trim();
        if (!url) {
          wxInlineQrBroken.value = true;
          wxInlineExitTime.value = 0;
          wxInlineQrFailDetail.value = res.msg || '服务端未返回二维码地址，请检查微信相关配置';
          ElMessage.error(wxInlineQrFailDetail.value);
          return;
        }
        wxInlineQrUrl.value = url;
        intervalIdWxInline = setInterval(() => {
          if (wxInlineExitTime.value <= 0) {
            wxInlineUnCode.value = true;
            wxInlineUnMsg.value = '二维码已失效';
            stopInlineWxBind();
            return;
          }
          wxInlineExitTime.value--;
        }, 1000);
        startWxBindSse(wxInlineUuid.value, 'inline');
      })
      .catch((err: unknown) => {
        wxInlineQrBroken.value = true;
        wxInlineExitTime.value = 0;
        const msg =
          typeof err === 'string' && err
            ? err
            : '获取微信二维码失败，请检查后端微信（公众号）配置与网络';
        wxInlineQrFailDetail.value = msg;
        ElMessage.error(msg);
      });
  };

  // 绑定微信
  const wxUuid = ref(generateUUID() as string);
  // 二维码（弹窗：更换绑定等）
  const openWxCode = () => {
    stopInlineWxBind();
    wxUuid.value = generateUUID() as string;
    unCode.value = false;
    succeed.value = false;
    wxDialogQrBroken.value = false;
    wxDialogQrFailDetail.value = '';
    exitTime.value = 60;
    stopWxDialogBindEs();
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    baseUserApi
      .getWxCode(wxUuid.value)
      .then((res) => {
        const url = `${res.data ?? ''}`.trim();
        if (!url) {
          wxDialogQrBroken.value = true;
          exitTime.value = 0;
          stateWx.form.wxCode = '';
          stateWx.dialog = true;
          wxDialogQrFailDetail.value = res.msg || '服务端未返回二维码地址，请检查微信相关配置';
          ElMessage.error(wxDialogQrFailDetail.value);
          return;
        }
        stateWx.dialog = true;
        stateWx.form.wxCode = url;
        startWxBindSse(wxUuid.value, 'dialog');
        intervalId = setInterval(() => {
          if (exitTime.value <= 0) {
            unCode.value = true;
            unCodeMsg.value = '二维码已失效';
            succeed.value = false;
            clearInterval(intervalId);
            intervalId = undefined;
            stopWxDialogBindEs();
            return;
          }
          exitTime.value--;
        }, 1000);
      })
      .catch((err: unknown) => {
        wxDialogQrBroken.value = true;
        stateWx.form.wxCode = '';
        stateWx.dialog = true;
        exitTime.value = 0;
        const msg =
          typeof err === 'string' && err
            ? err
            : '获取微信二维码失败，请检查后端微信（公众号）配置与网络';
        wxDialogQrFailDetail.value = msg;
        ElMessage.error(msg);
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
  const wxClose = () => {
    stateWx.dialog = false;
    stateWx.key = generateUUID();
    stopWxDialogBindEs();
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  };
  onUnmounted(() => {
    // 销毁事件
    stopInlineWxBind();
    stopWxDialogBindEs();
    if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
    if (intervalIdPwd !== undefined) {
      clearInterval(intervalIdPwd);
    }
    if (intervalIdBindEmail !== undefined) {
      clearInterval(intervalIdBindEmail);
    }
    if (intervalIdBindPhone !== undefined) {
      clearInterval(intervalIdBindPhone);
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
                width: 96px;
                font-size: 14px;
                color: #666;
                flex-shrink: 0;
                text-align: right;
                padding-right: 8px;
                box-sizing: border-box;
                line-height: 22px;
              }

              :deep(.el-input) {
                flex: 1;
              }

              &.form-btn {
                margin-top: 40px;
                /* 与 .form-label 列宽（96px）后的主内容左缘对齐 */
                margin-left: 96px;
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
              }

              .current-field-with-action {
                flex: 1;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
                min-width: 0;

                .current-field-text {
                  flex: 0 1 auto;
                  max-width: 280px;
                  min-width: 0;
                  font-size: 14px;
                  line-height: 22px;
                  color: #303133;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .field-change-link,
                .field-unbind-link {
                  flex-shrink: 0;
                  font-size: 14px;
                  padding: 2px 0;
                }
              }
            }

            .wx-bind-inline {
              width: 100%;
              max-width: 360px;
              padding: 8px 0 16px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;

              &__qr {
                width: 200px;
                min-height: 200px;
                align-self: center;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--el-fill-color-lighter);
                border-radius: 8px;
                padding: 12px;
                box-sizing: border-box;

                img {
                  width: 100%;
                  max-width: 176px;
                  height: auto;
                  display: block;
                }
              }

              &__qr-broken {
                width: 100%;
                min-height: 160px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-size: 13px;
                color: var(--el-text-color-secondary);
                text-align: center;
                line-height: 1.4;
              }

              &__qr-broken-visual {
                width: 140px;
                height: 140px;
                position: relative;
                border: 2px dashed var(--el-color-danger-light-5);
                border-radius: 8px;
                background: var(--el-fill-color);
                box-sizing: border-box;
              }

              &__qr-broken-crack {
                position: absolute;
                left: 10%;
                top: 50%;
                width: 80%;
                height: 0;
                border-top: 3px solid var(--el-border-color-darker);
                opacity: 0.45;
                transform: rotate(38deg);
                transform-origin: center;
                pointer-events: none;
              }

              &__qr-broken-msg {
                margin: 0;
                max-width: 220px;
                word-break: break-word;
              }

              &__loading {
                font-size: 13px;
                color: var(--el-text-color-secondary);
              }

              &__hint {
                margin: 0;
                font-size: 13px;
                color: var(--el-text-color-regular);
                line-height: 1.5;
                align-self: stretch;
                text-align: center;
              }

              &__refresh-wrap {
                width: 100%;
                display: flex;
                justify-content: center;
              }

              &__time {
                color: var(--el-text-color-secondary);
                font-size: 12px;
              }

              &__fail {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: var(--el-text-color-regular);
                text-align: center;

                p {
                  margin: 0;
                }
              }
            }

            /* 与下方 el-form-item 共用标签列（密保手机 / 绑定邮箱首行） */
            .setting-inline-el-form {
              .current-field-with-action {
                flex: 1;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
                min-width: 0;

                .current-field-text {
                  flex: 0 1 auto;
                  max-width: 300px;
                  min-width: 0;
                  font-size: 14px;
                  line-height: 22px;
                  color: #303133;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .field-unbind-link {
                  flex-shrink: 0;
                  font-size: 14px;
                  padding: 2px 0;
                  margin-left: 2px;
                }
              }

              /* 首行「当前手机/邮箱」与分区线间距：原独立 form-item 为 60px，现略收紧 */
              & > :deep(.el-form-item:first-child) {
                margin-bottom: 22px;
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

              .inline-form-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
              }

              .code-with-send {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
                box-sizing: border-box;

                :deep(.el-input) {
                  flex: 1;
                  min-width: 0;
                }

                .el-button {
                  flex-shrink: 0;
                  white-space: nowrap;
                }
              }

              /* 邮箱改密：与「弱/中/高」右侧区同栅格列宽，两行主输入框右缘对齐 */
              .setting-pwd-email-form {
                $pwd-email-trailing: 140px;

                .pwd-email-code-block {
                  width: 100%;

                  .pwd-email-code-sendto {
                    margin: 8px 0 0;
                    font-size: 12px;
                    line-height: 1.5;
                    color: var(--el-text-color-secondary);
                  }
                }

                .code-with-send {
                  display: grid;
                  grid-template-columns: minmax(0, 1fr) $pwd-email-trailing;
                  align-items: center;
                  column-gap: 12px;

                  :deep(.el-input) {
                    min-width: 0;
                  }

                  .el-button {
                    box-sizing: border-box;
                    width: 100%;
                    min-width: 0;
                    padding-left: 10px;
                    padding-right: 10px;
                    white-space: nowrap;
                  }
                }

                .pwd-with-strength {
                  display: grid;
                  grid-template-columns: minmax(0, 1fr) $pwd-email-trailing;
                  align-items: center;
                  column-gap: 12px;
                  width: 100%;
                  box-sizing: border-box;

                  :deep(.el-input) {
                    min-width: 0;
                  }

                  .pwd-email-trailing-spacer {
                    min-height: 1px;
                  }

                  .pwd-email-confirm-match {
                    width: 100%;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    font-size: 12px;
                    font-weight: 600;
                    line-height: 1.2;
                    text-align: center;

                    .is-match {
                      color: var(--el-color-success);
                    }

                    .is-mismatch {
                      color: var(--el-color-danger);
                    }
                  }
                }
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
                  text-align: left;
                  padding-right: 0;
                }

                :deep(.el-input) {
                  width: 100%;
                }

                &.form-btn {
                  margin-left: 0;
                }
              }

              .setting-inline-el-form {
                :deep(.el-form-item__label) {
                  width: 100% !important;
                  text-align: left;
                  justify-content: flex-start;
                  padding-right: 0;
                }

                :deep(.el-form-item__content) {
                  margin-left: 0 !important;
                  max-width: 100%;
                }

                :deep(.el-form-item) {
                  display: block;
                  margin-bottom: 18px;
                }

                .current-field-with-action {
                  flex-direction: column;
                  align-items: flex-start;
                  width: 100%;
                  gap: 8px;

                  .current-field-text {
                    flex: 1;
                    max-width: 100%;
                    white-space: normal;
                    word-break: break-all;
                  }
                }
              }

              .setting-inline-panel {
                max-width: 100%;

                .code-with-send {
                  flex-direction: column;
                  align-items: stretch;
                  gap: 10px;
                }

                .code-with-send .el-button {
                  width: 100%;
                }

                .setting-pwd-email-form {
                  .code-with-send,
                  .pwd-with-strength {
                    grid-template-columns: 1fr;
                    row-gap: 10px;
                  }

                  .code-with-send .el-button,
                  .pwd-with-strength .pwd-strength-meter,
                  .pwd-with-strength .pwd-email-confirm-match {
                    width: 100%;
                    flex: none;
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

<style lang="scss">
  /* el-dialog 内容挂到 body 时 scoped 不生效 */
  .wx-dialog-qr-broken {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
    text-align: center;
    line-height: 1.4;
    padding: 8px 0;
  }

  .wx-dialog-qr-broken__visual {
    width: 160px;
    height: 160px;
    position: relative;
    border: 2px dashed var(--el-color-danger-light-5);
    border-radius: 8px;
    background: var(--el-fill-color);
    box-sizing: border-box;
  }

  .wx-dialog-qr-broken__crack {
    position: absolute;
    left: 10%;
    top: 50%;
    width: 80%;
    height: 0;
    border-top: 3px solid var(--el-border-color-darker);
    opacity: 0.45;
    transform: rotate(38deg);
    transform-origin: center;
    pointer-events: none;
  }

  .wx-dialog-qr-broken__msg {
    margin: 0;
    max-width: 360px;
    word-break: break-word;
  }
</style>
