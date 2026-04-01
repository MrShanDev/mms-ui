#!/usr/bin/env python3
# 根据 mms-servers 各模块 admin Controller + Vo 生成 mms-ui CRUD 页面（与 module/function 路径、权限约定一致）。
import re
import os
from pathlib import Path
from typing import List, Dict, Optional

REPO = Path(__file__).resolve().parents[2]
SERVERS = REPO / "mms-servers"
UI_VIEWS = REPO / "mms-ui" / "src" / "views"

SKIP_TABLE = {"contentHtml", "content", "password", "tenantId", "revision", "serialVersionUID"}
SKIP_FORM = {"serialVersionUID", "ctime", "mtime", "createdTime"}
SKIP_FORM_TYPES = ("Date", "LocalDateTime")


def find_java_file(pkg_suffix: str, class_name: str) -> Optional[Path]:
    rel = "src/main/java/" + pkg_suffix.replace(".", "/") + f"/{class_name}.java"
    for mod in SERVERS.iterdir():
        if not mod.is_dir():
            continue
        p = mod / rel
        if p.is_file():
            return p
    return None


def _field_comment(doc_block: str) -> str:
    if not doc_block:
        return ""
    for ln in doc_block.replace("\t", "\n").split("\n"):
        s = ln.strip()
        if not s.startswith("*"):
            continue
        s = s[1:].strip()
        if s.startswith("@") or not s:
            continue
        return s
    return ""


def parse_vo_fields(vo_path: Path) -> List[Dict]:
    """逐个 private 字段：取字段前最近的 /** ... */ 作为注释（避免类级注释落到首个字段上）。"""
    text = vo_path.read_text(encoding="utf-8")
    fields = []
    for m in re.finditer(r"private\s+(?P<t>[\w<>, ?]+)\s+(?P<n>\w+)\s*;", text):
        n, t = m.group("n"), m.group("t")
        if n == "serialVersionUID" or "<" in t or "List" in t:
            continue
        head = text[: m.start()]
        dm = None
        for dm in re.finditer(r"/\*\*(?P<doc>[\s\S]*?)\*/", head):
            pass
        doc = dm.group("doc") if dm else ""
        c = _field_comment(doc) or n
        fields.append({"name": n, "type": t, "comment": c})
    return fields


def controller_meta(ctrl_path: Path) -> Optional[Dict]:
    t = ctrl_path.read_text(encoding="utf-8")
    rm = re.search(r'@RequestMapping\("([^"]+)"\)', t)
    if not rm:
        return None
    mapping = rm.group(1)
    model_name, function_name = mapping.split("/", 1)
    vm = re.search(
        r"import\s+com\.sxpcwlkj\.(\w+)\.entity\.vo\.(\w+)\s*;",
        t,
    )
    if not vm:
        return None
    pkg = vm.group(1)
    vo_class = vm.group(2)
    vo_path = find_java_file(f"com.sxpcwlkj.{pkg}.entity.vo", vo_class)
    if not vo_path:
        return None
    title_m = re.search(r"/\*\*\s*\n\s*\*\s*([^\n*]+)", t)
    title = title_m.group(1).strip() if title_m else function_name
    fields = parse_vo_fields(vo_path)
    id_field = "id"
    names = {f["name"] for f in fields}
    if "id" not in names:
        id_field = next(
            (f["name"] for f in fields if f["name"] in ("uid", "code")),
            fields[0]["name"] if fields else "id",
        )
    return {
        "mapping": mapping,
        "model_name": model_name,
        "function_name": function_name,
        "title": title,
        "vo_path": vo_path,
        "fields": fields,
        "id_field": id_field,
        "pkg": pkg,
    }


def pascal(s: str) -> str:
    return "".join(x[:1].upper() + x[1:] for x in re.split(r"[^\w]+", s) if x)


def emit_ts(meta: dict, out_dir: Path):
    m, f = meta["model_name"], meta["function_name"]
    api_fn = f"{m}{pascal(f)}Api"
    out_dir.mkdir(parents=True, exist_ok=True)
    base = f"{m}/{f}"
    (out_dir / "index.ts").write_text(
        f"""import request from '/@/utils/request';
import {{ getEnv }} from '/@/utils/mms';
import {{ AxiosPromise }} from 'axios';
import {{ SysEnum }} from '/@/enums/SysEnum';
import {{ EncryptTypeEnum }} from '/@/enums/EncryptTypeEnum';

/**
 * {meta["title"]} — Api（{base}）
 */
export function {api_fn}() {{
  return {{
    list: <T = any>(params?: object): AxiosPromise<T> => {{
      return request({{
        url: getEnv() + '/{base}/list',
        method: 'post',
        data: params,
        headers: {{
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        }},
      }});
    }},
    edit: <T = any>(params?: object): AxiosPromise<T> => {{
      return request({{
        url: getEnv() + '/{base}',
        method: 'put',
        data: params,
        headers: {{
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        }},
      }});
    }},
    query: <T = any>(id?: number | string): AxiosPromise<T> => {{
      return request({{
        url: getEnv() + '/{base}/' + id,
        method: 'get',
        headers: {{
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        }},
      }});
    }},
    insert: <T = any>(params?: object): AxiosPromise<T> => {{
      return request({{
        url: getEnv() + '/{base}',
        method: 'post',
        data: params,
        headers: {{
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        }},
      }});
    }},
    delete: <T = any>(id?: number | string): AxiosPromise<T> => {{
      return request({{
        url: getEnv() + '/{base}/' + id,
        method: 'delete',
        headers: {{
          'Encrypt-State': SysEnum.SYS_COMMON_STATE_CLOSE,
          'Encrypt-Type': EncryptTypeEnum.AES,
        }},
      }});
    }},
  }};
}}
""",
        encoding="utf-8",
    )


def emit_type(meta: dict, out_dir: Path):
    m, f = meta["model_name"], meta["function_name"]
    ent = f"{pascal(m)}{pascal(f)}Entity"
    (out_dir / "type.ts").write_text(
        f"""import {{ BaseEntity, TableType }} from '/@/types/global';

export declare interface {pascal(m)}{pascal(f)}State {{
  tableData: {pascal(m)}{pascal(f)}TableData;
}}

declare interface {pascal(m)}{pascal(f)}TableData extends TableType {{
  data: {ent}[];
}}

/** {meta["title"]} */
export declare interface {ent} extends BaseEntity {{
  [key: string]: any;
}}
""",
        encoding="utf-8",
    )


def form_widget(field: dict) -> str:
    n, c, t = field["name"], field["comment"], field["type"]
    if n in SKIP_FORM:
        return ""
    if any(x in t for x in SKIP_FORM_TYPES):
        return ""
    if n == "status" and "Integer" in t:
        return f"""          <el-col class="mt-5" :span="24">
            <el-form-item label="{c}" prop="{n}">
              <fast-switch v-model="state.ruleForm.{n}" dict-type="SYS_STATE" placeholder="{c}" />
            </el-form-item>
          </el-col>
"""
    if "Boolean" in t:
        return f"""          <el-col class="mt-5" :span="24">
            <el-form-item label="{c}" prop="{n}">
              <el-switch v-model="state.ruleForm.{n}" />
            </el-form-item>
          </el-col>
"""
    if "Long" in t or "Integer" in t or "int" in t or "long" in t:
        return f"""          <el-col class="mt-5" :span="24">
            <el-form-item label="{c}" prop="{n}">
              <el-input-number v-model="state.ruleForm.{n}" class="w100" controls-position="right" />
            </el-form-item>
          </el-col>
"""
    if "Html" in n or "content" == n.lower() or "Content" in n:
        return f"""          <el-col class="mt-5" :span="24">
            <el-form-item label="{c}" prop="{n}">
              <el-input v-model="state.ruleForm.{n}" type="textarea" :rows="6" placeholder="{c}" />
            </el-form-item>
          </el-col>
"""
    return f"""          <el-col class="mt-5" :span="24">
            <el-form-item label="{c}" prop="{n}">
              <el-input v-model="state.ruleForm.{n}" placeholder="{c}" clearable />
            </el-form-item>
          </el-col>
"""


def emit_dialog(meta: dict, out_dir: Path):
    m, f = meta["model_name"], meta["function_name"]
    ent = f"{pascal(m)}{pascal(f)}Entity"
    pk = meta["id_field"]
    has_id = any(x["name"] == "id" for x in meta["fields"])
    id_hidden = ""
    if has_id:
        id_hidden = """          <el-col v-show="false" class="mt-5" :span="24">
            <el-form-item v-show="false" label="id" prop="id">
              <el-input v-model="state.ruleForm.id" />
            </el-form-item>
          </el-col>
"""
    form_cols = "".join(form_widget(f) for f in meta["fields"])
    uses_fast_switch = any(
        f["name"] == "status" and "Integer" in f["type"] for f in meta["fields"]
    )
    fast_switch_import = (
        "  import FastSwitch from '/@/components/fast-switch/src/fast-switch.vue';\n"
        if uses_fast_switch
        else ""
    )
    name = f"{m}{pascal(f)}Dialog"
    (out_dir / "dialog.vue").write_text(
        f"""<template>
  <div class="{m}-{f}-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
      <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="120px">
        <el-row>
{id_hidden}{form_cols}
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" size="default">取 消</el-button>
          <el-button
            type="primary"
            :disabled="state.dialog.loading"
            :loading-icon="Eleme"
            :loading="state.dialog.loading"
            @click="onSubmit"
            size="default"
          >{{{{ state.dialog.submitTxt }}}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts" name="{name}">
  import {{ reactive, ref, nextTick }} from 'vue';
  import {{ CURDEnum }} from '/@/enums/CURDEnum';
{fast_switch_import}  import {{ {ent} }} from './type';
  import {{ Eleme }} from '@element-plus/icons-vue';
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({{
    ruleForm: {{}} as {ent},
    dialog: {{
      loading: false,
      isShowDialog: false,
      type: '',
      title: '',
      submitTxt: '',
    }},
  }});
  const resetForm = () => {{
    state.dialog.loading = false;
    state.ruleForm = {{}} as {ent};
  }};
  const openDialog = (type: string, row?: {ent}) => {{
    resetForm();
    nextTick(() => {{
      if (type === CURDEnum.EDIT && row) {{
        state.ruleForm = {{ ...row }} as {ent};
        state.dialog.title = '修改';
      }} else {{
        state.dialog.title = '新增';
      }}
      state.dialog.submitTxt = type === CURDEnum.INSERT ? '新 增' : '修 改';
      state.dialog.isShowDialog = true;
      state.dialog.type = type;
    }});
  }};
  const closeDialog = () => {{
    state.dialog.isShowDialog = false;
  }};
  const onSubmit = () => {{
    state.dialog.loading = true;
    emit('refresh', state.ruleForm);
  }};
  const resetLoading = () => {{ state.dialog.loading = false; }};
  defineExpose({{ openDialog, closeDialog, resetLoading }});
</script>
""",
        encoding="utf-8",
    )


def table_columns(meta: dict) -> str:
    cols = []
    pk = meta["id_field"]
    cols.append(
        f"""              <el-table-column
                prop="{pk}"
                label="{pk}"
                header-align="center"
                align="center"
                min-width="100"
              />"""
    )
    n = 0
    for f in meta["fields"]:
        if f["name"] == pk or f["name"] in SKIP_TABLE:
            continue
        if n >= 7:
            break
        cols.append(
            f"""              <el-table-column
                prop="{f["name"]}"
                label="{f["comment"]}"
                header-align="center"
                align="center"
                min-width="120"
                show-overflow-tooltip
              />"""
        )
        n += 1
    return "\n".join(cols)


def emit_index_vue(meta: dict, out_dir: Path):
    m, f = meta["model_name"], meta["function_name"]
    ent = f"{pascal(m)}{pascal(f)}Entity"
    api_fn = f"{m}{pascal(f)}Api"
    pk = meta["id_field"]
    perm = f"{m}:{f}"
    name = f"{m}{pascal(f)}"
    cols = table_columns(meta)
    (out_dir / "index.vue").write_text(
        f"""<template>
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
              v-auth="'{perm}:list'"
            >
              <SvgIcon name="iconfont icon-search1" />
              {{{{ $t('message.form.search') }}}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="{m}-{f}-container layout-padding m-t-0 p-t-0">
      <el-card shadow="hover" class="layout-padding-auto">
        <el-container>
          <el-header>
            <TableTool
              ref="tableToolRef"
              tableComment="{meta["title"]}"
              functionName="{f}"
              modelName="{m}"
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
{cols}
              <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                  <el-tooltip placement="top" :content="$t('message.form.edit')">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auths="['{perm}:query', '{perm}:edit']"
                      @click="onCURD({{ type: curdEnum.EDIT, ids: scope.row['{pk}'] }})"
                    >
                      <ele-Edit />
                    </el-icon>
                  </el-tooltip>
                  <el-tooltip placement="top" :content="$t('message.form.delete')">
                    <el-icon
                      class="mr10"
                      color="blue"
                      v-auth="'{perm}:delete'"
                      @click="onCURD({{ type: curdEnum.DELETE, ids: scope.row['{pk}'] }})"
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
<script setup lang="ts" name="{name}">
  import {{ defineAsyncComponent, reactive, onMounted, ref }} from 'vue';
  import {{ ElMessageBox, ElMessage }} from 'element-plus';
  import {{ CURDEnum }} from '/@/enums/CURDEnum';
  import {{ generateUUID }} from '/@/utils/mms';
  import {{ {api_fn} }} from './index';
  import {{ {ent}, {pascal(m)}{pascal(f)}State }} from './type';
  import {{ NextLoading }} from '/@/utils/loading';

  const baseApi = {api_fn}();
  const curdEnum = CURDEnum;
  const entityDialogRef = ref();
  const EntityDialog = defineAsyncComponent(() => import('./dialog.vue'));
  const TableTool = defineAsyncComponent(() => import('/@/components/table-tool/index.vue'));
  const componentKey = ref(generateUUID());
  const state = reactive<{pascal(m)}{pascal(f)}State>({{
    tableData: {{
      data: [],
      total: 0,
      loading: false,
      param: {{
        selectIds: '',
        pageNum: 1,
        pageSize: 10,
      }},
    }},
  }});

  const getTableData = () => {{
    state.tableData.loading = true;
    baseApi
      .list(state.tableData.param)
      .then((res) => {{
        state.tableData.data = res.rows;
        state.tableData.total = res.total;
      }})
      .catch((err) => ElMessage.warning(err))
      .finally(() => {{
        state.tableData.loading = false;
      }});
  }};

  const onCURD = (obj: {{ type: CURDEnum; ids?: string }}) => {{
    if (obj.type === CURDEnum.INSERT) {{
      entityDialogRef.value.openDialog(obj.type);
      return;
    }}
    if (obj.type === CURDEnum.EDIT) {{
      baseApi
        .query(obj.ids)
        .then((res) => {{
          entityDialogRef.value.openDialog(obj.type, res.data);
        }})
        .catch((err) => ElMessage.warning(err));
      return;
    }}
    if (obj.type === CURDEnum.DELETE) {{
      ElMessageBox.confirm('此操作将永久删除，是否继续?', '提示', {{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }})
        .then(() => {{
          baseApi
            .delete(obj.ids!)
            .then(() => {{
              ElMessage.success('删除成功');
              getTableData();
            }})
            .catch((err) => ElMessage.warning(err));
        }})
        .catch(() => {{}});
    }}
  }};

  const formSubmit = (row: {ent}) => {{
    const emptyPk = !row['{pk}'] || String(row['{pk}']) === '';
    const doClose = () => {{
      entityDialogRef.value.closeDialog();
      entityDialogRef.value.resetLoading();
    }};
    if (emptyPk) {{
      NextLoading.open();
      baseApi
        .insert(row)
        .then((r) => {{
          doClose();
          ElMessage.success(r.msg);
        }})
        .catch((err) => {{
          entityDialogRef.value.resetLoading();
          ElMessage.warning(err);
        }})
        .finally(() => {{
          NextLoading.close();
          getTableData();
        }});
    }} else {{
      NextLoading.open();
      baseApi
        .edit(row)
        .then((r) => {{
          doClose();
          ElMessage.success(r.msg);
        }})
        .catch((err) => {{
          entityDialogRef.value.resetLoading();
          ElMessage.warning(err);
        }})
        .finally(() => {{
          NextLoading.close();
          getTableData();
        }});
    }}
  }};

  const onHandleSizeChange = (val: number) => {{
    state.tableData.param.pageSize = val;
    getTableData();
  }};
  const onHandleCurrentChange = (val: number) => {{
    state.tableData.param.pageNum = val;
    getTableData();
  }};
  const handleSelectionChange = (val: {ent}[]) => {{
    state.tableData.param.selectIds = val.map((item: any) => item['{pk}']).join(',');
  }};

  onMounted(() => getTableData());
</script>
<style scoped lang="scss"></style>
""",
        encoding="utf-8",
    )


def main():
    ctrls = list(SERVERS.glob("*/src/main/java/com/sxpcwlkj/admin/controller/*Controller.java"))
    for cp in sorted(ctrls):
        meta = controller_meta(cp)
        if not meta or not meta["fields"]:
            print("skip", cp)
            continue
        parts = meta["mapping"].split("/")
        out = UI_VIEWS.joinpath(*parts)
        emit_ts(meta, out)
        emit_type(meta, out)
        emit_dialog(meta, out)
        emit_index_vue(meta, out)
        print("ok", meta["mapping"])


if __name__ == "__main__":
    main()
