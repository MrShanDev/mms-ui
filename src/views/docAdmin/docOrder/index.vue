<template>
  <div class="block">
    <!-- Table  -->
    <div class="docAdmin-docOrder-container layout-padding mt-5 p-t-0">
      <el-card shadow="hover" class="layout-padding-auto">
        <el-container>
          <el-header>
            <!-- 新增/导入/导出/打印 -->
            <TableTool
              ref="tableToolRef"
              tableComment="文档订单"
              functionName="docOrder"
              modelName="docAdmin"
              :key="componentKey"
              :param="state.tableData.param"
              @close="componentKey = generateUUID()"
              @insert="onCURD"
              @deletes="onCURD"
            />
          </el-header>
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
              <el-table-column
                v-if="false"
                prop="orderId"
                label="订单编号"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="uid"
                label="用户编号"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="txnAmt"
                label="订单金额"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="payMchid"
                label="支付商户号"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="payNo"
                label="支付平台流水号"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="payTimeout"
                label="支付超时时间"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="prodId"
                label="产品编号"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="prodName"
                label="产品名称"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="prodPrice"
                label="产品价格"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="prodType"
                label="产品类型"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="ctime"
                label="创建时间"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="mtime"
                label="更新时间"
                header-align="center"
                align="center"
              ></el-table-column>
              <fast-table-column
                prop="status"
                label="订单状态"
                dict-type="SYS_STATE"
              ></fast-table-column>
              <el-table-column
                prop="sort"
                label="排序"
                header-align="center"
                align="center"
              ></el-table-column>
              <el-table-column fixed="right" label="操作" width=" 100 ">
                <template #default="scope">
                  <el-tooltip placement="top" :content="$t('message.form.edit')">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auths="['docAdmin:docOrder:query', 'docAdmin:docOrder:edit']"
                      @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.orderId })"
                    >
                      <ele-Edit />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip placement="top" :content="$t('message.form.delete')">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auth="'docAdmin:docOrder:delete'"
                      @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.orderId })"
                    >
                      <ele-Delete />
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
      <DocOrderDialog ref="docOrderDialogRef" @refresh="formSubmit" />
    </div>
  </div>
</template>
//ModuleName 文档订单
<script setup lang="ts" name="docAdminDocOrder">
  import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { isEmpty, generateUUID } from '/@/utils/mms';
  import { NextLoading } from '/@/utils/loading';
  import FastSelect from '/@/components/fast-select/src/fast-select.vue';
  import { docOrderApi } from '/@/views/docAdmin/docOrder';
  import { DocOrderBo, DocOrderVo } from '/@/views/docAdmin/docOrder/type';
  const baseApi = docOrderApi();
  import FastTableColumn from '/@/components/fast-table-column';
  const docOrderDialogRef = ref();
  const DocOrderDialog = defineAsyncComponent(
    () => import('/@/views/docAdmin/docOrder/dialog.vue')
  );
  const TableTool = defineAsyncComponent(() => import('/@/components/table-tool/index.vue'));

  const curdEnum = CURDEnum;
  const tableToolRef = ref();
  const componentKey = ref(generateUUID());
  const state = reactive({
    tableData: {
      data: [] as DocOrderVo[],
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
      docOrderDialogRef.value.openDialog(obj.type);
      return false;
    }
    // 编辑操作
    if (obj.type === CURDEnum.EDIT) {
      baseApi
        .query(obj.ids)
        .then((res) => {
          docOrderDialogRef.value.openDialog(obj.type, res.data);
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
  const formSubmit = (row: DocOrderBo) => {
    if (isEmpty(row.orderId)) {
      //新增
      NextLoading.open();
      baseApi
        .insert(row)
        .then((row) => {
          docOrderDialogRef.value.closeDialog();
          ElMessage.success(row.msg);
          setTimeout(() => {
            getTableData();
          }, 1000);
        })
        .catch(async (err) => {
          docOrderDialogRef.value.resetLoading();
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
          docOrderDialogRef.value.closeDialog();
          ElMessage.success(row.msg);
        })
        .catch(async (err) => {
          docOrderDialogRef.value.resetLoading();
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
  const handleSelectionChange = (val: DocOrderVo[]) => {
    state.tableData.param.selectIds = val.map((item: any) => item.id).join(',');
  };
  // 页面加载时
  onMounted(() => {
    getTableData();
  });
</script>

<style scoped lang="scss"></style>
