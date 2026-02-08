<template>
  <el-drawer
    class="pb-5 pr-5 pl-5"
    v-model="visible"
    title="代码预览"
    size="95%"
    @close="emit('close')"
    :with-header="false"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in preViewList"
        :key="index"
        :label="item.fileName"
        :name="index"
      >
        <el-scrollbar height="90vh">
          <div class="block">
            <div class="copy-btn" @click="copy">复制</div>
            <!-- 如果是 SQL 文件，显示执行按钮 -->
            <div v-if="isSqlFile(item.fileName)" class="execute-btn" @click="openExecuteDialog">
              执行 SQL
            </div>
            <pre>{{ content }}</pre>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>

    <!-- 执行 SQL 对话框 -->
    <el-dialog
      v-model="executeDialogVisible"
      title="执行 SQL"
      width="70%"
      :close-on-click-modal="false"
      draggable
    >
      <div class="execute-sql-container">
        <el-form :model="executeForm" label-width="100px">
          <el-form-item label="SQL 脚本">
            <el-input
              disabled
              v-model="executeForm.sql"
              type="textarea"
              :rows="15"
              placeholder="请输入 SQL 脚本"
              class="sql-textarea"
            ></el-input>
          </el-form-item>
        </el-form>

        <!-- 执行结果 -->
        <div v-if="executeResult" class="execute-result">
          <div class="result-title">执行结果：</div>
          <pre class="result-content">{{ executeResult }}</pre>
        </div>
      </div>

      <template #footer>
        <el-button @click="executeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="executeSql" :loading="executeLoading">执行</el-button>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup lang="ts">
  import { nextTick, reactive, ref } from 'vue';
  import { ElMessage, TabsPaneContext } from 'element-plus/es';
  import useClipboard from 'vue-clipboard3';
  import request from '/@/utils/request';
  import { getEnv } from '/@/utils/mms';

  const { toClipboard } = useClipboard();
  const activeName = ref(0);
  const content = ref('');
  const executeDialogVisible = ref(false);
  const executeLoading = ref(false);
  const executeResult = ref('');
  const tableId = ref<number>(0);

  const executeForm = reactive({
    sql: '',
  });

  const handleClick = (tab: TabsPaneContext) => {
    let index: number = Number(tab.index);
    content.value = preViewList[index].content;
    // 切换 tab 时更新 SQL 内容
    if (isSqlFile(preViewList[index].fileName)) {
      executeForm.sql = content.value;
    }
  };

  const emit = defineEmits(['close']);
  const visible = ref(false);

  interface PreView {
    fileName: string;
    content: string;
  }

  let preViewList = reactive<PreView[]>([]);

  const init = (data: PreView[], id?: number) => {
    visible.value = true;
    preViewList = data;
    content.value = data[activeName.value].content;

    // 保存 tableId
    if (id) {
      tableId.value = id;
    }

    // 初始化 SQL 内容
    if (isSqlFile(data[activeName.value].fileName)) {
      executeForm.sql = content.value;
    }
  };

  // 判断是否为 SQL 文件
  const isSqlFile = (fileName: string) => {
    return fileName.toLowerCase().includes('sql') || fileName.toLowerCase().endsWith('.sql');
  };

  // 打开执行对话框
  const openExecuteDialog = () => {
    executeDialogVisible.value = true;
    executeResult.value = '';
    executeForm.sql = content.value;
  };

  // 执行 SQL
  const executeSql = async () => {
    if (!executeForm.sql || !executeForm.sql.trim()) {
      ElMessage.warning('请输入 SQL 脚本');
      return;
    }

    if (!tableId.value) {
      ElMessage.warning('无效的表 ID');
      return;
    }

    executeLoading.value = true;
    executeResult.value = '';

    try {
      const res = await request.post(getEnv() + '/gen/generator/executeSql', {
        tableId: tableId.value,
        sql: executeForm.sql,
      });

      executeResult.value = JSON.stringify(res, null, 2);
      ElMessage.success('执行成功');
    } catch (err: any) {
      executeResult.value = '执行失败：' + (err.message || err);
      ElMessage.error('执行失败');
    } finally {
      executeLoading.value = false;
    }
  };

  const copy = () => {
    toClipboard(content.value)
      .then(() => {
        ElMessage.success('复制成功！');
      })
      .catch(() => {
        ElMessage.warning('复制失败！');
      });
  };

  defineExpose({
    init,
  });
</script>

<style lang="scss">
  .sortable-row-gen .drag-btn {
    cursor: move;
    font-size: 12px;
  }

  .sortable-row-gen .vxe-body--row.sortable-ghost,
  .sortable-row-gen .vxe-body--row.sortable-chosen {
    background-color: #dfecfb;
  }
  .el-drawer .el-drawer__body {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 10px;
  }
  .copy-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 999;
    cursor: pointer;
    color: #409eff;
    font-size: 14px;
  }
  .execute-btn {
    position: absolute;
    right: 80px;
    top: 20px;
    z-index: 999;
    cursor: pointer;
    color: #67c23a;
    font-size: 14px;
    font-weight: 500;
  }
  .execute-btn:hover {
    color: #85ce61;
  }
  pre {
    margin: 0;
    background-color: #f6f8fa;
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
    line-height: 1.5;
    color: #24292e;
    font-family: Consolas, Menlo, Monaco, 'Courier New', monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
    position: relative;
  }

  .execute-sql-container {
    .sql-textarea {
      font-family: Consolas, Menlo, Monaco, 'Courier New', monospace;
      font-size: 13px;
    }

    .execute-result {
      margin-top: 20px;
      border-top: 1px solid #e4e7ed;
      padding-top: 15px;

      .result-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 10px;
      }

      .result-content {
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        padding: 12px;
        font-size: 13px;
        line-height: 1.6;
        color: #606266;
        max-height: 300px;
        overflow-y: auto;
      }
    }
  }
</style>
