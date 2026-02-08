<template>
  <div class="block">
    <!-- 功能栏  -->
    <div class="views-tool">
      <div class="tool-left">
        <div class="tool-left-title">筛选查询</div>
        <el-form
          size="default"
          :inline="true"
          :model="state.queryForm"
          @keyup.enter="getDataList()"
        >
          <el-form-item>
            <el-input v-model="state.queryForm.tableName" placeholder="表名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="importHandle()">导入</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="downloadBatchHandle()">生成代码</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="deleteBatchHandle()">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="settingBatchHandle()">配置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="layout-padding">
      <el-card>
        <el-table
          v-loading="state.dataListLoading"
          :data="state.dataList"
          border
          style="width: 100%"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="tableName"
            label="表名"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="tableComment"
            label="表说明"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="className"
            label="类名"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            header-align="center"
            align="center"
            width="320"
          >
            <template #default="scope">
              <el-button
                type="primary"
                link
                :loading="loadingRows[scope.row.id]?.preview"
                @click="previewHandle(scope.row.id)"
              >
                预览
              </el-button>
              <el-button
                type="primary"
                link
                :loading="loadingRows[scope.row.id]?.generator"
                @click="generatorHandle(scope.row.id)"
              >
                基础信息
              </el-button>
              <el-button
                type="primary"
                link
                :loading="loadingRows[scope.row.id]?.edit"
                @click="editHandle(scope.row.id)"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                link
                :loading="loadingRows[scope.row.id]?.delete"
                @click="deleteBatchHandle(scope.row.id)"
              >
                删除
              </el-button>
              <el-button
                type="primary"
                link
                :loading="loadingRows[scope.row.id]?.sync"
                @click="syncHandle(scope.row)"
              >
                同步
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="m-t-5"
          :current-page="state.page"
          :page-sizes="state.pageSizes"
          :page-size="state.limit"
          :total="state.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        ></el-pagination>
      </el-card>
    </div>
    <import ref="importRef" @refresh-data-list="getDataList"></import>
    <preview
      :key="componentKey"
      @close="componentKey = generateUUID()"
      ref="previewRef"
      @refresh-data-list="getDataList"
    ></preview>
    <edit ref="editRef" @refresh-data-list="getDataList"></edit>
    <generator ref="generatorRef" @refresh-data-list="getDataList"></generator>
    <setting ref="settingRef"></setting>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { IHooksOptions } from '/@/hooks/interface';
  import { useCrud } from '/@/hooks';
  import Import from './import.vue';
  import Preview from './preview.vue';
  import Edit from './edit.vue';
  import Generator from './generator.vue';
  import Setting from './setting.vue';
  import { useTableSyncApi, useDownloadApi, usePreviewApi } from '/@/views/system/generate';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { getEnv, generateUUID } from '/@/utils/mms';
  import { NextLoading } from '/@/utils/loading';
  const componentKey = ref(generateUUID());
  const state: IHooksOptions = reactive({
    dataListUrl: getEnv() + '/gen/table/page',
    deleteUrl: getEnv() + '/gen/table',
    queryForm: {
      tableName: '',
    },
  });

  // 每行按钮的 loading 状态
  const loadingRows = reactive<
    Record<
      number,
      {
        preview?: boolean;
        generator?: boolean;
        edit?: boolean;
        delete?: boolean;
        sync?: boolean;
      }
    >
  >({});

  const importRef = ref();
  const previewRef = ref();
  const editRef = ref();
  const generatorRef = ref();
  const settingRef = ref();
  const importHandle = (id?: number) => {
    importRef.value.init(id);
  };

  const editHandle = (id?: number) => {
    if (!id) return;
    if (!loadingRows[id]) loadingRows[id] = {};
    loadingRows[id].edit = true;
    NextLoading.open();
    editRef.value.init(id);
    // 延迟重置 loading 状态
    setTimeout(() => {
      if (loadingRows[id]) {
        loadingRows[id].edit = false;
      }
    }, 500);
  };

  const generatorHandle = (id?: number) => {
    if (!id) return;
    if (!loadingRows[id]) loadingRows[id] = {};
    loadingRows[id].generator = true;
    NextLoading.open();
    generatorRef.value.init(id);
    // 延迟重置 loading 状态
    setTimeout(() => {
      if (loadingRows[id]) {
        loadingRows[id].generator = false;
      }
    }, 500);
  };

  const downloadBatchHandle = () => {
    const tableIds = state.dataListSelections ? state.dataListSelections : [];

    if (tableIds.length === 0) {
      ElMessage.warning('请选择生成代码的表');
      return;
    }

    useDownloadApi(tableIds);
  };
  const settingBatchHandle = (id?: number) => {
    settingRef.value.init(id);
  };
  const syncHandle = (row: any) => {
    if (!loadingRows[row.id]) loadingRows[row.id] = {};
    loadingRows[row.id].sync = true;
    ElMessageBox.confirm(`确定同步数据表${row.tableName}吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        useTableSyncApi(row.id).then(() => {
          ElMessage.success('同步成功');
        });
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {
        NextLoading.close();
        if (loadingRows[row.id]) {
          loadingRows[row.id].sync = false;
        }
      });
  };

  const previewHandle = (id: any) => {
    if (!loadingRows[id]) loadingRows[id] = {};
    loadingRows[id].preview = true;
    usePreviewApi(id)
      .then((res) => {
        // 传递 tableId 给预览组件
        previewRef.value.init(res.data, id);
      })
      .finally(() => {
        if (loadingRows[id]) {
          loadingRows[id].preview = false;
        }
      });
  };

  const {
    getDataList,
    selectionChangeHandle,
    sizeChangeHandle,
    currentChangeHandle,
    deleteBatchHandle,
  } = useCrud(state);
</script>
