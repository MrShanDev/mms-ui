<template>
  <div class="system-sysLog-dialog-container">
    <el-dialog
      :title="state.dialog.title"
      v-model="state.dialog.isShowDialog"
      :width="dialogWidth"
      draggable
      :close-on-click-modal="false"
    >
      <!-- 日志预览模式 -->
      <div class="log-detail-container">
        <el-scrollbar max-height="70vh">
          <!-- 基本信息 -->
          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="card-header">
                <span class="header-title">基本信息</span>
              </div>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="模块名称">
                <template v-if="isEditing">
                  <el-input v-model="state.ruleForm.module" size="small"></el-input>
                </template>
                <template v-else>
                  <span class="detail-value">{{ state.ruleForm.module || '-' }}</span>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="操作类型">
                <template v-if="isEditing">
                  <fast-select
                    v-model="state.ruleForm.operType"
                    dict-type="operType"
                    size="small"
                  ></fast-select>
                </template>
                <template v-else>
                  <el-tag :type="getOperTypeTag(state.ruleForm.operType)" size="small">
                    {{ getOperTypeText(state.ruleForm.operType) }}
                  </el-tag>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="操作描述" :span="2">
                <template v-if="isEditing">
                  <el-input v-model="state.ruleForm.description" size="small"></el-input>
                </template>
                <template v-else>
                  <span class="detail-value">{{ state.ruleForm.description || '-' }}</span>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="操作状态">
                <template v-if="isEditing">
                  <fast-switch
                    v-model="state.ruleForm.status"
                    dict-type="SYS_STATE"
                    size="small"
                  ></fast-switch>
                </template>
                <template v-else>
                  <el-tag :type="state.ruleForm.status === 1 ? 'success' : 'danger'" size="small">
                    {{ state.ruleForm.status === 1 ? '成功' : '失败' }}
                  </el-tag>
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="操作时间">
                <span class="detail-value">
                  <el-icon><ele-Clock /></el-icon>
                  {{ state.ruleForm.operTime || '-' }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="消耗时间">
                <el-tag type="info" size="small">{{ state.ruleForm.costTime || '0' }} ms</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 操作人员信息 -->
          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="card-header">
                <span class="header-title">操作人员</span>
              </div>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="操作人员">
                <span class="detail-value">
                  <el-icon><ele-User /></el-icon>
                  {{ state.ruleForm.userName || '-' }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="用户ID">
                <span class="detail-value">{{ state.ruleForm.userId || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="用户角色" :span="2">
                <template v-if="state.ruleForm.userRoles">
                  <el-tag
                    v-for="(role, index) in state.ruleForm.userRoles.split(',')"
                    :key="index"
                    size="small"
                    class="mr-5"
                  >
                    {{ role }}
                  </el-tag>
                </template>
                <span v-else class="detail-value">-</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 请求信息 -->
          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="card-header">
                <span class="header-title">请求信息</span>
              </div>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="请求方法">
                <el-tag size="small" :type="getMethodTag(state.ruleForm.requestMethod)">
                  {{ state.ruleForm.requestMethod || '-' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="请求URL">
                <span class="detail-value url-text">{{ state.ruleForm.operUrl || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="操作方法" :span="2">
                <span class="detail-value code-text">{{ state.ruleForm.method || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="请求参数" :span="2">
                <el-input
                  v-if="isEditing"
                  v-model="state.ruleForm.operParam"
                  type="textarea"
                  :rows="3"
                  size="small"
                ></el-input>
                <pre v-else class="json-content">{{ formatJson(state.ruleForm.operParam) }}</pre>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 网络信息 -->
          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="card-header">
                <span class="header-title">网络信息</span>
              </div>
            </template>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="IP地址">
                <span class="detail-value">
                  <el-icon><ele-Location /></el-icon>
                  {{ state.ruleForm.operIp || '-' }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="操作地点">
                <span class="detail-value">{{ state.ruleForm.operLocation || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="浏览器">
                <span class="detail-value">{{ state.ruleForm.browser || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="操作系统">
                <span class="detail-value">{{ state.ruleForm.os || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="User-Agent" :span="2">
                <span class="detail-value user-agent">{{ state.ruleForm.userAgent || '-' }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 响应信息 -->
          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="card-header">
                <span class="header-title">响应信息</span>
              </div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item v-if="state.ruleForm.beforeData" label="操作前数据">
                <el-input
                  v-if="isEditing"
                  v-model="state.ruleForm.beforeData"
                  type="textarea"
                  :rows="3"
                  size="small"
                ></el-input>
                <pre v-else class="json-content">{{ formatJson(state.ruleForm.beforeData) }}</pre>
              </el-descriptions-item>
              <el-descriptions-item label="返回结果">
                <el-input
                  v-if="isEditing"
                  v-model="state.ruleForm.jsonResult"
                  type="textarea"
                  :rows="3"
                  size="small"
                ></el-input>
                <pre v-else class="json-content">{{ formatJson(state.ruleForm.jsonResult) }}</pre>
              </el-descriptions-item>
              <el-descriptions-item v-if="state.ruleForm.errorMsg" label="错误消息">
                <el-input
                  v-if="isEditing"
                  v-model="state.ruleForm.errorMsg"
                  type="textarea"
                  :rows="2"
                  size="small"
                ></el-input>
                <el-alert v-else :title="state.ruleForm.errorMsg" type="error" :closable="false" />
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-scrollbar>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" size="default">关闭</el-button>
          <!-- 超级管理员才显示编辑/删除按钮 -->
          <template v-if="isSuperAdmin">
            <el-button v-if="!isEditing" type="primary" @click="toggleEdit" size="default">
              <el-icon><ele-Edit /></el-icon>
              编辑
            </el-button>
            <template v-else>
              <el-button @click="cancelEdit" size="default">取消编辑</el-button>
              <el-button
                type="primary"
                @click="onSubmit"
                :loading="state.dialog.loading"
                size="default"
              >
                <el-icon><ele-Check /></el-icon>
                {{ state.dialog.submitTxt }}
              </el-button>
            </template>
            <el-button v-if="!isEditing" type="danger" @click="onDelete" size="default">
              <el-icon><ele-Delete /></el-icon>
              删除
            </el-button>
          </template>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
//ModuleName 操作日志记录表
<script setup lang="ts" name="systemSysLogDialog">
  import { computed, nextTick, reactive, ref } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { SysLogBo, SysLogVo } from '/@/views/system/sysLog/type';
  import { isSuperAdmin as checkSuperAdmin } from '/@/utils/mms';
  import { useUserInfo } from '/@/stores/userInfo';
  import { storeToRefs } from 'pinia';
  import FastSelect from '/@/components/fast-select/src/fast-select.vue';
  import FastSwitch from '/@/components/fast-switch/src/fast-switch.vue';

  const dialogWidth = ref('65vw');
  const userStore = useUserInfo();
  const { userInfos } = storeToRefs(userStore);

  // 定义子组件向父组件传值/事件
  const emit = defineEmits(['refresh', 'delete']);
  const dialogFormRef = ref();
  const isEditing = ref(false);
  const originalData = ref<SysLogBo>();

  const state = reactive({
    ruleForm: {} as SysLogBo,
    threeData: [] as SysLogVo[],
    dialog: {
      loading: false,
      isShowDialog: false,
      type: '',
      title: '',
      submitTxt: '',
    },
  });

  // 判断是否为超级管理员
  const isSuperAdmin = computed(() => {
    return userInfos.value.roles && userInfos.value.roles.includes('super_admin');
  });

  // 格式化 JSON 字符串
  const formatJson = (jsonStr: string) => {
    if (!jsonStr) return '-';
    try {
      const obj = JSON.parse(jsonStr);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return jsonStr;
    }
  };

  // 获取操作类型标签颜色
  const getOperTypeTag = (type: number) => {
    const tagMap: Record<number, string> = {
      1: '',
      2: 'success',
      3: 'warning',
      4: 'danger',
      5: 'info',
    };
    return tagMap[type] || '';
  };

  // 获取操作类型文本
  const getOperTypeText = (type: number) => {
    const textMap: Record<number, string> = {
      1: '查询',
      2: '新增',
      3: '修改',
      4: '删除',
      5: '其他',
    };
    return textMap[type] || '未知';
  };

  // 获取请求方法标签颜色
  const getMethodTag = (method: string) => {
    const tagMap: Record<string, string> = {
      GET: 'success',
      POST: 'primary',
      PUT: 'warning',
      DELETE: 'danger',
    };
    return tagMap[method] || 'info';
  };

  // 重置
  const resetForm = () => {
    state.dialog.loading = false;
    isEditing.value = false;
    state.ruleForm = {
      operId: '',
      module: '',
      operType: 0,
      description: '',
      requestMethod: '',
      method: '',
      operUrl: '',
      userId: '',
      userName: '',
      userRoles: '',
      operIp: '',
      operLocation: '',
      operParam: '',
      beforeData: '',
      jsonResult: '',
      status: 1,
      errorMsg: '',
      operTime: '',
      costTime: '',
      userAgent: '',
      browser: '',
      os: '',
    } as SysLogBo;
  };

  // 打开弹窗
  const openDialog = (type: string, row: SysLogVo) => {
    resetForm();
    if (type === CURDEnum.EDIT) {
      state.ruleForm = { ...row };
      originalData.value = { ...row };
      state.dialog.title = '日志详情';
      state.dialog.submitTxt = '保 存';
      state.dialog.type = CURDEnum.EDIT;
    }
    state.dialog.isShowDialog = true;
  };

  // 关闭弹窗
  const closeDialog = () => {
    state.dialog.loading = false;
    state.dialog.isShowDialog = false;
    isEditing.value = false;
  };

  // 切换编辑模式
  const toggleEdit = () => {
    isEditing.value = true;
    state.dialog.submitTxt = '保 存';
  };

  // 取消编辑
  const cancelEdit = () => {
    isEditing.value = false;
    // 恢复原始数据
    if (originalData.value) {
      state.ruleForm = { ...originalData.value };
    }
  };

  // 重置Loading
  const resetLoading = () => {
    state.dialog.loading = false;
  };

  // 提交
  const onSubmit = () => {
    state.dialog.loading = true;
    emit('refresh', state.ruleForm);
  };

  // 删除
  const onDelete = () => {
    ElMessageBox.confirm('确定要删除这条日志吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        emit('delete', state.ruleForm.operId);
        closeDialog();
      })
      .catch(() => {
        // 取消删除
      });
  };

  // 暴露变量
  defineExpose({
    openDialog,
    closeDialog,
    resetLoading,
  });
</script>

<style lang="scss" scoped>
  .log-detail-container {
    padding: 10px 0;

    .detail-card {
      margin-bottom: 15px;
      border-radius: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      :deep(.el-card__header) {
        padding: 12px 20px;
        background: linear-gradient(90deg, #f6f8fa 0%, #ffffff 100%);
        border-bottom: 2px solid #e4e7ed;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .header-title {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
          display: flex;
          align-items: center;

          &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 16px;
            background: #409eff;
            border-radius: 2px;
            margin-right: 8px;
          }
        }
      }

      :deep(.el-card__body) {
        padding: 20px;
      }
    }

    :deep(.el-descriptions) {
      .el-descriptions__label {
        font-weight: 600;
        color: #606266;
        background-color: #fafafa;
        width: 140px;
      }

      .el-descriptions__content {
        color: #303133;
      }
    }

    .detail-value {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #303133;
      word-break: break-all;

      .el-icon {
        color: #909399;
      }

      &.url-text {
        color: #409eff;
        font-family: 'Courier New', monospace;
        font-size: 13px;
      }

      &.code-text {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        color: #606266;
        background-color: #f5f7fa;
        padding: 2px 8px;
        border-radius: 4px;
      }

      &.user-agent {
        font-size: 12px;
        color: #909399;
        line-height: 1.5;
      }
    }

    .json-content {
      background-color: #f6f8fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 12px;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #24292e;
      max-height: 300px;
      overflow: auto;
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }
    }

    .mr-5 {
      margin-right: 5px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  :deep(.el-scrollbar__view) {
    padding: 0 10px;
  }
</style>
