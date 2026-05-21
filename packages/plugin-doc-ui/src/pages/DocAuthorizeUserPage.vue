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
            <el-input v-model="state.tableData.param.uid" placeholder="用户编号" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="state.tableData.param.openid" placeholder="OpenID" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="state.tableData.loading"
              @click="getTableData"
              v-auth="'doc:docAuthorizeUser:list'"
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
            <PluginTableTool
              :has-selection="state.tableData.param.selectIds !== ''"
              :select-ids="state.tableData.param.selectIds"
              @insert="onCURD"
              @deletes="onCURD"
            />
          </el-header>
          <el-main>
            <el-table
              :data="state.tableData.data"
              v-loading="state.tableData.loading"
              row-key="id"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column prop="id" label="ID" min-width="120" show-overflow-tooltip />
              <el-table-column prop="uid" label="用户编号" width="120" show-overflow-tooltip />
              <el-table-column prop="chan" label="授权平台" width="100" />
              <el-table-column prop="appid" label="AppID" min-width="120" show-overflow-tooltip />
              <el-table-column prop="openid" label="OpenID" min-width="160" show-overflow-tooltip />
              <el-table-column prop="ctime" label="创建时间" min-width="160" />
              <el-table-column prop="mtime" label="更新时间" min-width="160" />
              <el-table-column prop="status" label="状态" width="90">
                <template #default="scope">
                  <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" />
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-icon
                    class="mr10"
                    color="blue"
                    v-auths="['doc:docAuthorizeUser:query', 'doc:docAuthorizeUser:edit']"
                    @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })"
                  >
                    <ele-Edit />
                  </el-icon>
                  <el-icon
                    class="mr10"
                    color="blue"
                    v-auth="'doc:docAuthorizeUser:delete'"
                    @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.id })"
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

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="600px" destroy-on-close>
      <el-form :model="dialog.form" label-width="120px" size="default">
        <el-form-item v-show="dialog.mode === curdEnum.EDIT" label="ID">
          <el-input v-model="dialog.form.id" disabled />
        </el-form-item>
        <el-form-item label="用户编号" required>
          <el-input v-model="dialog.form.uid" />
        </el-form-item>
        <el-form-item label="授权平台" required>
          <el-input v-model="dialog.form.chan" />
        </el-form-item>
        <el-form-item label="授权平台标识" required>
          <el-input v-model="dialog.form.appid" />
        </el-form-item>
        <el-form-item label="OpenID" required>
          <el-input v-model="dialog.form.openid" />
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

<script setup lang="ts" name="DocAuthorizeUserPage">
  import { reactive, ref, onMounted } from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { CURDEnum } from '@mms-ui/plugin-common-kit/utils/enums';
  import { NextLoading } from '@mms-ui/plugin-common-kit/utils/loading';
  import { docCrudApi } from '../api/docCrudApi';
  import { PluginTableTool } from '@mms-ui/plugin-common-kit';

  const baseApi = docCrudApi('docAuthorizeUser');
  const curdEnum = CURDEnum;

  const state = reactive({
    tableData: {
      data: [] as any[],
      total: 0,
      loading: false,
      param: {
        selectIds: '',
        pageNum: 1,
        pageSize: 10,
        uid: '',
        openid: '',
      } as Record<string, any>,
    },
  });

  const dialog = reactive({
    visible: false,
    title: '',
    mode: '',
    saving: false,
    form: {
      id: '',
      uid: '',
      chan: '',
      appid: '',
      openid: '',
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
      uid: '',
      chan: '',
      appid: '',
      openid: '',
      ctime: '',
      mtime: '',
      status: 1,
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
    state.tableData.param.selectIds = rows.map((r) => r.id).filter(Boolean).join(',');
  }

  function onCURD(obj: { type: string; ids?: string }) {
    if (obj.type === CURDEnum.INSERT) {
      resetDialog();
      const t = nowStr();
      dialog.form.ctime = t;
      dialog.form.mtime = t;
      dialog.title = '新增授权用户';
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
          dialog.title = '编辑授权用户';
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
    if (!f.uid || !f.chan || !f.appid || !f.openid || !f.ctime || !f.mtime) {
      ElMessage.warning('请填写必填项');
      return;
    }
    dialog.saving = true;
    const payload = { ...f };
    if (dialog.mode === CURDEnum.INSERT) {
      delete payload.id;
    }
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
</style>
