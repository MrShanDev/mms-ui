<template>
  <div class="block">
    <!-- Table  -->
    <div class="system-sysLog-container layout-padding mt-5 p-t-0">
      <el-card shadow="hover" class="layout-padding-auto">
        <el-container>
          <el-main>
            <!-- Table -->
            <el-table
              :data="state.tableData.data"
              v-loading="state.tableData.loading"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50"
              ></el-table-column>
              <!-- <el-table-column v-if="false" prop="operId" label="日志主键" header-align="center" align="center"></el-table-column> -->
              <el-table-column
                prop="module"
                label="模块名称"
                header-align="center"
                align="center"
              ></el-table-column>
              <fast-table-column
                prop="operType"
                label="操作类型"
                dict-type="operType"
              ></fast-table-column>
              <el-table-column
                prop="description"
                label="操作描述"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="requestMethod"
                label="请求方法"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="operUrl"
                label="请求URL"
                header-align="center"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="userName"
                label="操作人员账号"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="userRoles"
                label="操作人员角色"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="operIp"
                label="主机地址"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="operLocation"
                label="操作地点"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="operTime"
                label="操作时间"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="os"
                label="操作系统"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" width=" 100 ">
                <template #default="scope">
                  <el-tooltip placement="top" :content="$t('message.form.edit')">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auths="['system:sysLog:query', 'system:sysLog:edit']"
                      @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.operId })"
                    >
                      <ele-Edit />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <!-- 分页 -->
            <el-pagination
              @size-change="onHandleSizeChange"
              @current-change="onHandleCurrentChange"
              class="mt15"
              :pager-count="5"
              :page-sizes="[10, 20, 30, 50, 100, 500, 1000]"
              v-model:current-page="state.tableData.param.pageNum"
              background
              size="default"
              v-model:page-size="state.tableData.param.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="state.tableData.total"
            ></el-pagination>
          </el-footer>
        </el-container>
      </el-card>
      <SysLogDialog ref="sysLogDialogRef" @refresh="formSubmit" />
    </div>
  </div>
</template>
//ModuleName 操作日志记录表
<script setup lang="ts" name="systemSysLog">
  import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { generateUUID, isEmpty } from '/@/utils/mms';
  import { NextLoading } from '/@/utils/loading';

  import { SysLogBo, SysLogVo } from '/@/views/system/sysLog/type';
  import { sysLogApi } from '/@/views/system/sysLog';
  const baseApi = sysLogApi();

  const sysLogDialogRef = ref();
  const SysLogDialog = defineAsyncComponent(() => import('/@/views/system/sysLog/dialog.vue'));
  const TableTool = defineAsyncComponent(() => import('/@/components/table-tool/index.vue'));

  const curdEnum = CURDEnum;
  const tableToolRef = ref();
  const componentKey = ref(generateUUID());
  const state = reactive({
    tableData: {
      data: [] as SysLogVo[],
      total: 0,
      loading: false,
      param: {
        selectIds: '',
        pageNum: 1,
        pageSize: 10,
      },
    },
  });
  // 初始化表格数据
  const getTableData = () => {
    state.tableData.loading = true;
    baseApi
      .list(state.tableData.param)
      .then((res) => {
        state.tableData.data = res.rows;
        state.tableData.total = res.total;
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {
        state.tableData.loading = false;
      });
  };
  // 打开修改用户弹窗
  const onCURD = (obj: { type: CURDEnum; ids?: string }) => {
    if (obj.type === CURDEnum.INSERT) {
      sysLogDialogRef.value.openDialog(obj.type);
      return false;
    }
    // 编辑操作
    if (obj.type === CURDEnum.EDIT) {
      baseApi
        .query(obj.ids)
        .then((res) => {
          sysLogDialogRef.value.openDialog(obj.type, res.data);
        })
        .catch(async (err) => {
          ElMessage.warning(err);
        })
        .finally(() => {});
    }
    // 删除操作
    if (obj.type === CURDEnum.DELETE) {
      ElMessageBox.confirm(`此操作将永久删除，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          baseApi
            .delete(obj.ids)
            .then((res) => {
              getTableData();
              ElMessage.success('删除成功');
            })
            .catch(async (err) => {
              ElMessage.warning(err);
            })
            .finally(() => {
              setTimeout(() => {
                getTableData();
              }, 1000);
            });
        })
        .catch(() => {});
    }
  };
  // 接收子组件传值
  const formSubmit = (row: SysLogBo) => {
    if (isEmpty(row.operId)) {
      //新增
      NextLoading.open();
      baseApi
        .insert(row)
        .then((row) => {
          sysLogDialogRef.value.closeDialog();
          ElMessage.success(row.msg);
          setTimeout(() => {
            getTableData();
          }, 1000);
        })
        .catch(async (err) => {
          sysLogDialogRef.value.resetLoading();
          ElMessage.warning(err);
        })
        .finally(() => {
          NextLoading.close();
        });
    } else {
      //更新
      NextLoading.open();
      baseApi
        .edit(row)
        .then((row) => {
          sysLogDialogRef.value.closeDialog();
          ElMessage.success(row.msg);
        })
        .catch(async (err) => {
          sysLogDialogRef.value.resetLoading();
          ElMessage.warning(err);
        })
        .finally(() => {
          NextLoading.close();
        });
    }
  };
  // 分页改变
  const onHandleSizeChange = (val: number) => {
    state.tableData.param.pageSize = val;
    getTableData();
  };
  // 分页改变
  const onHandleCurrentChange = (val: number) => {
    state.tableData.param.pageNum = val;
    getTableData();
  };
  //选择项改变
  const handleSelectionChange = (val: SysLogVo[]) => {
    state.tableData.param.selectIds = val.map((item: any) => item.id).join(',');
  };
  // 页面加载时
  onMounted(() => {
    getTableData();
  });
</script>

<style scoped lang="scss"></style>
