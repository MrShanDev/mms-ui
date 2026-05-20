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
              v-model="state.tableData.param.key"
              placeholder="配置 KEY"
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
              v-auth="'doc:docConfig:list'"
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
            <div class="doc-config-toolbar">
              <el-button type="primary" @click="onCURD({ type: curdEnum.INSERT })">新增</el-button>
              <el-button
                type="danger"
                :disabled="!state.tableData.param.selectIds"
                @click="onCURD({ type: curdEnum.DELETE, ids: state.tableData.param.selectIds })"
              >
                批量删除
              </el-button>
            </div>
          </el-header>
          <el-main>
            <el-table
              :data="state.tableData.data"
              v-loading="state.tableData.loading"
              style="width: 100%"
              row-key="id"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column prop="id" label="ID" min-width="140" show-overflow-tooltip />
              <el-table-column prop="key" label="KEY" min-width="120" show-overflow-tooltip />
              <el-table-column prop="value" label="值" min-width="200" show-overflow-tooltip />
              <el-table-column prop="ctime" label="创建时间" min-width="160" />
              <el-table-column prop="mtime" label="更新时间" min-width="160" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" width="80" align="center" />
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-tooltip content="编辑">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auths="['doc:docConfig:query', 'doc:docConfig:edit']"
                      @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })"
                    >
                      <ele-Edit />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip content="删除">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auth="'doc:docConfig:delete'"
                      @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.id })"
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
              size="default"
              layout="total, sizes, prev, pager, next, jumper"
              :total="state.tableData.total"
              @size-change="getTableData"
              @current-change="getTableData"
            />
          </el-footer>
        </el-container>
      </el-card>
    </div>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="dialog.form" label-width="100px" size="default">
        <el-form-item v-show="false" label="ID">
          <el-input v-model="dialog.form.id" disabled />
        </el-form-item>
        <el-form-item label="KEY" required>
          <el-input v-model="dialog.form.key" placeholder="配置键" />
        </el-form-item>
        <el-form-item label="值" required>
          <el-input v-model="dialog.form.value" type="textarea" :rows="3" placeholder="配置值" />
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
        <el-form-item label="状态">
          <el-switch v-model="dialog.form.status" :active-value="1" :inactive-value="0" />
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

<script setup lang="ts" name="DocConfigPage">
  import { reactive, onMounted } from 'vue';
  import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
  import { docCrudApi } from '../api/docCrudApi';

  const baseApi = docCrudApi('docConfig');
  const curdEnum = {
    INSERT: 'insert',
    EDIT: 'edit',
    DELETE: 'delete',
  } as const;

  const withLoading = async (task: () => Promise<void>) => {
    const loading = ElLoading.service({ text: '加载中请稍候...', background: 'rgba(0, 0, 0, 0.7)' });
    try {
      await task();
    } finally {
      loading.close();
    }
  };

  const state = reactive({
    tableData: {
      data: [] as any[],
      total: 0,
      loading: false,
      param: {
        selectIds: '',
        pageNum: 1,
        pageSize: 10,
        key: '',
      } as Record<string, any>,
    },
  });

  const dialog = reactive({
    visible: false,
    title: '',
    mode: '' as string,
    saving: false,
    form: {
      id: '',
      key: '',
      value: '',
      ctime: '',
      mtime: '',
      status: 1,
      sort: 0,
      remark: '',
    } as Record<string, any>,
  });

  function resetDialog() {
    dialog.form = {
      id: '',
      key: '',
      value: '',
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
    state.tableData.param.selectIds = rows.map((r) => r.id).filter(Boolean).join(',');
  }

  function openInsert() {
    resetDialog();
    const now = formatNow();
    dialog.form.ctime = now;
    dialog.form.mtime = now;
    dialog.title = '新增文档配置';
    dialog.mode = curdEnum.INSERT;
    dialog.visible = true;
  }

  function formatNow() {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function onCURD(obj: { type: string; ids?: string }) {
    if (obj.type === curdEnum.INSERT) {
      openInsert();
      return;
    }
    if (obj.type === curdEnum.EDIT && obj.ids) {
      baseApi
        .query(obj.ids)
        .then((res: any) => {
          resetDialog();
          Object.assign(dialog.form, res.data || {});
          dialog.title = '编辑文档配置';
          dialog.mode = curdEnum.EDIT;
          dialog.visible = true;
        })
        .catch((e) => ElMessage.warning(String(e)));
      return;
    }
    if (obj.type === curdEnum.DELETE && obj.ids) {
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
    if (!dialog.form.key || !dialog.form.value || !dialog.form.ctime || !dialog.form.mtime) {
      ElMessage.warning('请填写 KEY、值与时间');
      return;
    }
    dialog.saving = true;
    const payload = { ...dialog.form };
    const done = () => {
      dialog.saving = false;
      dialog.visible = false;
      getTableData();
    };
    if (dialog.mode === curdEnum.INSERT) {
      withLoading(async () => {
        const r: any = await baseApi.insert(payload);
        ElMessage.success(r.msg || '保存成功');
        done();
      })
        .catch((e) => ElMessage.warning(String(e)))
        .finally(() => {
          dialog.saving = false;
        });
    } else {
      withLoading(async () => {
        const r: any = await baseApi.edit(payload);
        ElMessage.success(r.msg || '保存成功');
        done();
      })
        .catch((e) => ElMessage.warning(String(e)))
        .finally(() => {
          dialog.saving = false;
        });
    }
  }

  onMounted(() => {
    getTableData();
  });
</script>

<style scoped lang="scss">
  .mms-doc-fed-page {
    width: 100%;
  }
</style>
