<template>
  <div class="block">
    <div class="views-tool">
      <div class="tool-left">
        <el-form
          :inline="true"
          size="default"
          :model="state.tableData.param"
          class="form-tool"
          @keyup.enter="getTableData"
        >
          <el-form-item>
            <el-button
              size="default"
              type="primary"
              :disabled="state.tableData.loading"
              :loading="state.tableData.loading"
              @click="getTableData"
              v-auth="'bbs:bbsFiles:list'"
            >
              <SvgIcon name="iconfont icon-search1" />
              {{ $t('message.form.search') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bbs-bbsFiles-container layout-padding m-t-0 p-t-0">
      <el-card shadow="hover" class="layout-padding-auto">
        <el-container>
          <el-header>
            <TableTool
              ref="tableToolRef"
              tableComment="话题附件"
              functionName="bbsFiles"
              modelName="bbs"
              :key="componentKey"
              :param="state.tableData.param"
              @close="componentKey = generateUUID()"
              @insert="onCURD"
              @deletes="onCURD"
            />
          </el-header>
          <el-main>
            <el-table
              :data="state.tableData.data"
              v-loading="state.tableData.loading"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column
                prop="id"
                label="id"
                header-align="center"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="bbsId"
                label="话题ID"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                prop="type"
                label="类型"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                prop="height"
                label="高度"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                prop="width"
                label="宽度"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                prop="size"
                label="大小"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                prop="url"
                label="附件地址"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column
                prop="createdTime"
                label="创建时间"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-tooltip placement="top" :content="$t('message.form.edit')">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auths="['bbs:bbsFiles:query', 'bbs:bbsFiles:edit']"
                      @click="onCURD({ type: curdEnum.EDIT, ids: scope.row['id'] })"
                    >
                      <ele-Edit />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip placement="top" :content="$t('message.form.delete')">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auth="'bbs:bbsFiles:delete'"
                      @click="onCURD({ type: curdEnum.DELETE, ids: scope.row['id'] })"
                    >
                      <ele-Delete />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination
              @size-change="onHandleSizeChange"
              @current-change="onHandleCurrentChange"
              class="mt15"
              :pager-count="5"
              :page-sizes="[10, 20, 30, 50, 100]"
              v-model:current-page="state.tableData.param.pageNum"
              background
              size="default"
              v-model:page-size="state.tableData.param.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="state.tableData.total"
            />
          </el-footer>
        </el-container>
      </el-card>
      <EntityDialog ref="entityDialogRef" @refresh="formSubmit" />
    </div>
  </div>
</template>
<script setup lang="ts" name="bbsBbsFiles">
  import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { generateUUID } from '/@/utils/mms';
  import { bbsBbsFilesApi } from './index';
  import { BbsBbsFilesEntity, BbsBbsFilesState } from './type';
  import { NextLoading } from '/@/utils/loading';

  const baseApi = bbsBbsFilesApi();
  const curdEnum = CURDEnum;
  const entityDialogRef = ref();
  const EntityDialog = defineAsyncComponent(() => import('./dialog.vue'));
  const TableTool = defineAsyncComponent(() => import('/@/components/table-tool/index.vue'));
  const componentKey = ref(generateUUID());
  const state = reactive<BbsBbsFilesState>({
    tableData: {
      data: [],
      total: 0,
      loading: false,
      param: {
        selectIds: '',
        pageNum: 1,
        pageSize: 10,
      },
    },
  });

  const getTableData = () => {
    state.tableData.loading = true;
    baseApi
      .list(state.tableData.param)
      .then((res) => {
        state.tableData.data = res.rows;
        state.tableData.total = res.total;
      })
      .catch((err) => ElMessage.warning(err))
      .finally(() => {
        state.tableData.loading = false;
      });
  };

  const onCURD = (obj: { type: CURDEnum; ids?: string }) => {
    if (obj.type === CURDEnum.INSERT) {
      entityDialogRef.value.openDialog(obj.type);
      return;
    }
    if (obj.type === CURDEnum.EDIT) {
      baseApi
        .query(obj.ids)
        .then((res) => {
          entityDialogRef.value.openDialog(obj.type, res.data);
        })
        .catch((err) => ElMessage.warning(err));
      return;
    }
    if (obj.type === CURDEnum.DELETE) {
      ElMessageBox.confirm('此操作将永久删除，是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          baseApi
            .delete(obj.ids!)
            .then(() => {
              ElMessage.success('删除成功');
              getTableData();
            })
            .catch((err) => ElMessage.warning(err));
        })
        .catch(() => {});
    }
  };

  const formSubmit = (row: BbsBbsFilesEntity) => {
    const emptyPk = !row['id'] || String(row['id']) === '';
    const doClose = () => {
      entityDialogRef.value.closeDialog();
      entityDialogRef.value.resetLoading();
    };
    if (emptyPk) {
      NextLoading.open();
      baseApi
        .insert(row)
        .then((r) => {
          doClose();
          ElMessage.success(r.msg);
        })
        .catch((err) => {
          entityDialogRef.value.resetLoading();
          ElMessage.warning(err);
        })
        .finally(() => {
          NextLoading.close();
          getTableData();
        });
    } else {
      NextLoading.open();
      baseApi
        .edit(row)
        .then((r) => {
          doClose();
          ElMessage.success(r.msg);
        })
        .catch((err) => {
          entityDialogRef.value.resetLoading();
          ElMessage.warning(err);
        })
        .finally(() => {
          NextLoading.close();
          getTableData();
        });
    }
  };

  const onHandleSizeChange = (val: number) => {
    state.tableData.param.pageSize = val;
    getTableData();
  };
  const onHandleCurrentChange = (val: number) => {
    state.tableData.param.pageNum = val;
    getTableData();
  };
  const handleSelectionChange = (val: BbsBbsFilesEntity[]) => {
    state.tableData.param.selectIds = val.map((item: any) => item['id']).join(',');
  };

  onMounted(() => getTableData());
</script>
<style scoped lang="scss"></style>
