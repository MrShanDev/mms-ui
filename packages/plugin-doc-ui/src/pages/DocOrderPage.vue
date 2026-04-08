<template>
  <div class="block mms-doc-fed-page">
    <div class="views-tool">
      <div class="tool-left">
        <div class="tool-left-title">筛选查询</div>
        <el-form
          :inline="true"
          size="default"
          :model="state.tableData.param"
          class="form-tool"
          @keyup.enter="getTableData"
        >
          <el-form-item>
            <el-input v-model="state.tableData.param.orderId" placeholder="订单号" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="state.tableData.param.uid" placeholder="用户编号" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="state.tableData.loading"
              @click="getTableData"
              v-auth="'doc:docOrder:list'"
            >
              查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="layout-padding">
      <el-card shadow="hover" class="layout-padding-auto">
        <el-container>
          <el-header>
            <TableTool
              table-comment="文档订单"
              function-name="docOrder"
              model-name="doc"
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
              row-key="orderId"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column prop="orderId" label="订单主键" min-width="140" show-overflow-tooltip />
              <el-table-column prop="uid" label="用户" width="120" show-overflow-tooltip />
              <el-table-column prop="txnAmt" label="订单金额" width="100" />
              <el-table-column prop="payNo" label="支付单号" min-width="120" show-overflow-tooltip />
              <el-table-column prop="transactionId" label="渠道流水" min-width="120" show-overflow-tooltip />
              <el-table-column prop="prodName" label="商品" min-width="120" show-overflow-tooltip />
              <fast-table-column
                prop="status"
                label="订单状态"
                width="120"
                dict-type="mms_plugin_doc_order_status"
              />
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-icon
                    class="mr10"
                    color="blue"
                    v-auths="['doc:docOrder:query', 'doc:docOrder:edit']"
                    @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.orderId })"
                  >
                    <ele-Edit />
                  </el-icon>
                  <el-icon
                    class="mr10"
                    color="blue"
                    v-auth="'doc:docOrder:delete'"
                    @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.orderId })"
                  >
                    <ele-Delete />
                  </el-icon>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination
              v-model:current-page="state.tableData.param.pageNum"
              v-model:page-size="state.tableData.param.pageSize"
              class="mt15"
              :page-sizes="[10, 20, 30, 50]"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="state.tableData.total"
              @size-change="getTableData"
              @current-change="getTableData"
            />
          </el-footer>
        </el-container>
      </el-card>
    </div>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="720px" destroy-on-close>
      <el-form :model="dialog.form" label-width="120px" size="default">
        <el-form-item label="订单主键" required>
          <el-input v-model="dialog.form.orderId" :disabled="dialog.mode === curdEnum.EDIT" />
        </el-form-item>
        <el-form-item label="用户编号" required>
          <el-input v-model="dialog.form.uid" />
        </el-form-item>
        <el-form-item label="订单金额" required>
          <el-input-number v-model="dialog.form.txnAmt" :min="0" :precision="2" class="w100" />
        </el-form-item>
        <el-form-item label="支付商户号" required>
          <el-input v-model="dialog.form.payMchid" />
        </el-form-item>
        <el-form-item label="支付单号 payNo" required>
          <el-input v-model="dialog.form.payNo" />
        </el-form-item>
        <el-form-item label="渠道流水号">
          <el-input v-model="dialog.form.transactionId" />
        </el-form-item>
        <el-form-item label="支付超时" required>
          <el-input v-model="dialog.form.payTimeout" />
        </el-form-item>
        <el-form-item label="产品编号" required>
          <el-input v-model="dialog.form.prodId" />
        </el-form-item>
        <el-form-item label="产品名称" required>
          <el-input v-model="dialog.form.prodName" />
        </el-form-item>
        <el-form-item label="产品价格" required>
          <el-input-number v-model="dialog.form.prodPrice" :min="0" :precision="2" class="w100" />
        </el-form-item>
        <el-form-item label="产品类型" required>
          <el-input v-model="dialog.form.prodType" />
        </el-form-item>
        <el-form-item label="创建时间" required>
          <el-date-picker
            v-model="dialog.form.ctime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="更新时间" required>
          <el-date-picker
            v-model="dialog.form.mtime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <fast-select
            v-model="dialog.form.status"
            dict-type="mms_plugin_doc_order_status"
            placeholder="请选择"
            class="w100"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="dialog.form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialog.form.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="dialog.saving" @click="submitDialog">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="DocOrderPage">
  import { reactive, ref, onMounted, defineAsyncComponent } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { generateUUID } from '/@/utils/mms';
  import { NextLoading } from '/@/utils/loading';
  import { docCrudApi } from '../api/docCrudApi';
  import FastSelect from '/@/components/fast-select/src/fast-select.vue';
  import FastTableColumn from '/@/components/fast-table-column/src/fast-table-column.vue';

  const TableTool = defineAsyncComponent(() => import('/@/components/table-tool/index.vue'));
  const baseApi = docCrudApi('docOrder');
  const curdEnum = CURDEnum;
  const componentKey = ref(generateUUID());

  const state = reactive({
    tableData: {
      data: [] as any[],
      total: 0,
      loading: false,
      param: {
        selectIds: '',
        pageNum: 1,
        pageSize: 10,
        orderId: '',
        uid: '',
      } as Record<string, any>,
    },
  });

  const dialog = reactive({
    visible: false,
    title: '',
    mode: '',
    saving: false,
    form: {
      orderId: '',
      uid: '',
      txnAmt: 0,
      payMchid: '',
      payNo: '',
      transactionId: '',
      payTimeout: '',
      prodId: '',
      prodName: '',
      prodPrice: 0,
      prodType: '',
      ctime: '',
      mtime: '',
      status: 0,
      sort: 0,
      remark: '',
    } as Record<string, any>,
  });

  function resetDialog() {
    dialog.form = {
      orderId: '',
      uid: '',
      txnAmt: 0,
      payMchid: '',
      payNo: '',
      transactionId: '',
      payTimeout: '',
      prodId: '',
      prodName: '',
      prodPrice: 0,
      prodType: '',
      ctime: '',
      mtime: '',
      status: 0,
      sort: 0,
      remark: '',
    };
  }

  function nowStr() {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function getTableData() {
    state.tableData.loading = true;
    baseApi
      .list(state.tableData.param)
      .then((res: any) => {
        state.tableData.data = res.rows ?? [];
        state.tableData.total = res.total ?? 0;
      })
      .catch((e) => ElMessage.warning(String(e)))
      .finally(() => {
        state.tableData.loading = false;
      });
  }

  function handleSelectionChange(rows: any[]) {
    state.tableData.param.selectIds = rows.map((r) => r.orderId).filter(Boolean).join(',');
  }

  function onCURD(obj: { type: string; ids?: string }) {
    if (obj.type === CURDEnum.INSERT) {
      resetDialog();
      const t = nowStr();
      dialog.form.ctime = t;
      dialog.form.mtime = t;
      dialog.title = '新增文档订单';
      dialog.mode = CURDEnum.INSERT;
      dialog.visible = true;
      return;
    }
    if (obj.type === CURDEnum.EDIT && obj.ids) {
      baseApi
        .query(obj.ids)
        .then((res: any) => {
          resetDialog();
          Object.assign(dialog.form, res.data || {});
          dialog.title = '编辑文档订单';
          dialog.mode = CURDEnum.EDIT;
          dialog.visible = true;
        })
        .catch((e) => ElMessage.warning(String(e)));
      return;
    }
    if (obj.type === CURDEnum.DELETE && obj.ids) {
      ElMessageBox.confirm('此操作将永久删除，是否继续?', '提示', { type: 'warning' })
        .then(() => {
          baseApi
            .delete(obj.ids)
            .then(() => {
              ElMessage.success('删除成功');
              getTableData();
            })
            .catch((e) => ElMessage.warning(String(e)));
        })
        .catch(() => {});
    }
  }

  function submitDialog() {
    const f = dialog.form;
    if (
      !f.orderId ||
      !f.uid ||
      f.txnAmt == null ||
      !f.payMchid ||
      !f.payNo ||
      !f.payTimeout ||
      !f.prodId ||
      !f.prodName ||
      f.prodPrice == null ||
      !f.prodType ||
      !f.ctime ||
      !f.mtime
    ) {
      ElMessage.warning('请填写必填项');
      return;
    }
    dialog.saving = true;
    const run = dialog.mode === CURDEnum.INSERT ? baseApi.insert({ ...f }) : baseApi.edit({ ...f });
    NextLoading.open();
    run
      .then((r: any) => {
        ElMessage.success(r.msg || '保存成功');
        dialog.visible = false;
        getTableData();
      })
      .catch((e) => ElMessage.warning(String(e)))
      .finally(() => {
        NextLoading.close();
        dialog.saving = false;
      });
  }

  onMounted(() => getTableData());
</script>

<style scoped lang="scss">
  .mms-doc-fed-page {
    width: 100%;
  }
  .w100 {
    width: 100%;
  }
</style>
