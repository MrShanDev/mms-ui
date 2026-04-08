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
            <el-input
              v-model="state.tableData.param.prodName"
              placeholder="产品名称"
              style="max-width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="state.tableData.loading"
              :loading="state.tableData.loading"
              @click="getTableData"
              v-auth="'doc:docProduct:list'"
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
              table-comment="文档商品"
              function-name="docProduct"
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
              row-key="prodId"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column prop="prodId" label="产品编号" min-width="120" show-overflow-tooltip />
              <el-table-column prop="prodName" label="产品名称" min-width="140" show-overflow-tooltip />
              <el-table-column prop="unitPrice" label="销售单价" width="100" />
              <el-table-column prop="markPrice" label="市场价" width="100" />
              <el-table-column prop="type" label="类型" width="100" />
              <el-table-column prop="ctime" label="创建时间" min-width="140" />
              <el-table-column prop="mtime" label="更新时间" min-width="140" />
              <fast-table-column
                prop="status"
                label="商品状态"
                width="120"
                dict-type="mms_plugin_doc_product_status"
              />
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-tooltip content="编辑">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auths="['doc:docProduct:query', 'doc:docProduct:edit']"
                      @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.prodId })"
                    >
                      <ele-Edit />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip content="删除">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auth="'doc:docProduct:delete'"
                      @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.prodId })"
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
              v-model:current-page="state.tableData.param.pageNum"
              v-model:page-size="state.tableData.param.pageSize"
              class="mt15"
              :pager-count="5"
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

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="640px" destroy-on-close>
      <el-form :model="dialog.form" label-width="100px" size="default">
        <el-form-item label="产品编号" required>
          <el-input v-model="dialog.form.prodId" :disabled="dialog.mode === curdEnum.EDIT" />
        </el-form-item>
        <el-form-item label="产品名称" required>
          <el-input v-model="dialog.form.prodName" />
        </el-form-item>
        <el-form-item label="销售单价" required>
          <el-input v-model="dialog.form.unitPrice" />
        </el-form-item>
        <el-form-item label="市场价格" required>
          <el-input v-model="dialog.form.markPrice" />
        </el-form-item>
        <el-form-item label="产品类型" required>
          <el-input v-model="dialog.form.type" />
        </el-form-item>
        <el-form-item label="创建时间" required>
          <el-input v-model="dialog.form.ctime" placeholder="字符串，如 2025-01-01 12:00:00" />
        </el-form-item>
        <el-form-item label="更新时间" required>
          <el-input v-model="dialog.form.mtime" />
        </el-form-item>
        <el-form-item label="商品状态">
          <fast-select
            v-model="dialog.form.status"
            dict-type="mms_plugin_doc_product_status"
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

<script setup lang="ts" name="DocProductPage">
  import { reactive, ref, onMounted, defineAsyncComponent } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { generateUUID } from '/@/utils/mms';
  import { NextLoading } from '/@/utils/loading';
  import { docCrudApi } from '../api/docCrudApi';
  import FastSelect from '/@/components/fast-select/src/fast-select.vue';
  import FastTableColumn from '/@/components/fast-table-column/src/fast-table-column.vue';

  const TableTool = defineAsyncComponent(() => import('/@/components/table-tool/index.vue'));
  const baseApi = docCrudApi('docProduct');
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
        prodName: '',
      } as Record<string, any>,
    },
  });

  const dialog = reactive({
    visible: false,
    title: '',
    mode: '',
    saving: false,
    form: {
      prodId: '',
      prodName: '',
      unitPrice: '',
      markPrice: '',
      type: '',
      ctime: '',
      mtime: '',
      status: 1,
      sort: 0,
      remark: '',
    } as Record<string, any>,
  });

  function resetDialog() {
    dialog.form = {
      prodId: '',
      prodName: '',
      unitPrice: '',
      markPrice: '',
      type: '',
      ctime: '',
      mtime: '',
      status: 1,
      sort: 0,
      remark: '',
    };
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
    state.tableData.param.selectIds = rows.map((r) => r.prodId).filter(Boolean).join(',');
  }

  function onCURD(obj: { type: string; ids?: string }) {
    if (obj.type === CURDEnum.INSERT) {
      resetDialog();
      dialog.title = '新增文档商品';
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
          dialog.title = '编辑文档商品';
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
    if (!f.prodId || !f.prodName || !f.unitPrice || !f.markPrice || !f.type || !f.ctime || !f.mtime) {
      ElMessage.warning('请填写必填项');
      return;
    }
    dialog.saving = true;
    const payload = { ...f };
    const run = dialog.mode === CURDEnum.INSERT ? baseApi.insert(payload) : baseApi.edit(payload);
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
