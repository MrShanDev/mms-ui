<template>
  <el-dialog v-model="visible" title="生成代码" :close-on-click-modal="false" draggable>
    <el-form v-loading="loading" ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="表名" prop="tableName">
            <el-input v-model="dataForm.tableName" disabled placeholder="表名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="说明" prop="tableComment">
            <el-input v-model="dataForm.tableComment" placeholder="说明"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类名" prop="className">
            <el-input v-model="dataForm.className" placeholder="类名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="baseclassId" label="继承">
            <el-select
              v-model="dataForm.baseclassId"
              placeholder="继承"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in baseClassList"
                :key="item.id"
                :label="item.code"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="模块名" prop="moduleName">
            <el-input v-model="dataForm.moduleName" placeholder="模块名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功能名" prop="functionName">
            <el-input v-model="dataForm.functionName" placeholder="功能名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目包名" prop="packageName">
            <el-input v-model="dataForm.packageName" placeholder="项目包名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="dataForm.version" placeholder="版本号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="默认作者" prop="author">
            <el-input v-model="dataForm.author" placeholder="默认作者"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作者邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="作者邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属菜单" prop="menuId">
            <el-cascader
              :options="menuData"
              :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
              placeholder="请选择菜单"
              clearable
              class="w100"
              v-model="dataForm.menuId"
            >
              <template #default="{ node, data }">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf">({{ data.children.length }})</span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataForm.formLayout == 2">
          <el-form-item label="父级节点" prop="parentId">
            <el-select
              v-model="dataForm.parentId"
              placeholder="父级节点"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in dataForm.fieldList.filter(field => !field.primaryPk)"
                :key="item.id"
                :label="item.fieldName + ' | ' + item.fieldComment"
                :value="item.attrName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataForm.formLayout == 2">
          <el-form-item label="节点Label" prop="tableLabel">
            <el-select
              v-model="dataForm.tableLabel"
              placeholder="节点Label"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in dataForm.fieldList"
                :key="item.id"
                :label="item.fieldComment"
                :value="item.attrName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="布局排列" prop="span">
            <el-radio-group v-model="dataForm.span">
              <el-radio :value="24">单列</el-radio>
              <el-radio :value="12">双列</el-radio>
              <el-radio :value="8">三列</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生成方式" prop="generatorType">
            <el-radio-group v-model="dataForm.generatorType">
              <el-radio :value="0">zip压缩包</el-radio>
              <el-radio :value="1">自定义路径</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单类型" prop="formLayout">
            <el-radio-group v-model="dataForm.formLayout" @change="formLayoutChange">
              <el-radio :value="1">分页列表</el-radio>
              <el-radio :value="2">
                <el-tooltip placement="top" content="备注：需要有根节点‘id’和父节点‘parentId’字段">
                  树结构
                </el-tooltip>
              </el-radio>
              <el-radio :value="3">单页面表单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="dataForm.generatorType === 1" label="后端生成路径" prop="backendPath">
        <el-input v-model="dataForm.backendPath" placeholder="后端生成路径"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.generatorType === 1" label="前端生成路径" prop="frontendPath">
        <el-input v-model="dataForm.frontendPath" placeholder="前端生成路径"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button :disabled="loading || !ready" type="primary" @click="submitHandle()">保存</el-button>
      <el-button :disabled="loading || !ready" type="danger" @click="generatorHandle()">保存生成代码</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref, nextTick } from 'vue';
  import { normalizeConfig, normalizeMenus, recommendTreeFields } from './selection';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import {
    useBaseClassListApi,
    useGeneratorApi,
    useDownloadApi,
    useTableApi,
    useTableSubmitApi,
  } from '/@/views/system/generate';
  import { useMenuApi } from '/@/views/system/menu';
  import { NextLoading } from '/@/utils/loading';
  const emit = defineEmits(['refreshDataList']);

  const visible = ref(false);
  const dataFormRef = ref();
  const baseClassList = ref<any[]>([]);
  const menuData = ref<any[]>([]);
  const loading = ref(false);
  const ready = ref(false);
  let loadVersion = 0;
  const defaults = () => ({
    id: '',
    baseclassId: '',
    generatorType: 0,
    formLayout: 1,
    backendPath: '',
    frontendPath: '',
    packageName: '',
    email: '',
    author: '',
    version: '',
    moduleName: '',
    functionName: '',
    className: '',
    tableComment: '',
    tableName: '',
    span: 24,
    menuId: '0',
    parentId: '',
    tableLabel: '',
    fieldList: [] as any[],
  });
  const dataForm = reactive(defaults());
  const baseApi = useMenuApi();
  const formLayoutChange = () => {
    if (dataForm.formLayout === 2) {
      Object.assign(dataForm, recommendTreeFields(dataForm));
    }
    nextTick(() => dataFormRef.value?.clearValidate());
  };
  const init = async (id: number) => {
    const version = ++loadVersion;
    visible.value = true;
    loading.value = true;
    ready.value = false;
    Object.assign(dataForm, defaults());
    menuData.value = [];
    baseClassList.value = [];
    try {
      const [table, menus, bases] = await Promise.all([
        useTableApi(id), baseApi.list({ level: 0 }), useBaseClassListApi(),
      ]);
      if (version !== loadVersion) return;
      menuData.value = normalizeMenus(menus.data);
      baseClassList.value = (bases.data || []).map((item: any) => ({ ...item, id: String(item.id) }));
      Object.assign(dataForm, normalizeConfig(table.data));
      if (dataForm.formLayout === 2) Object.assign(dataForm, recommendTreeFields(dataForm));
      ready.value = true;
      await nextTick();
      dataFormRef.value?.clearValidate();
    } catch (err) {
      if (version === loadVersion) ElMessage.warning('生成配置加载失败，请重新打开');
    } finally {
      if (version === loadVersion) loading.value = false;
      NextLoading.close();
    }
  };

  const dataRules = ref({
    tableName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    tableComment: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    className: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    packageName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    author: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    moduleName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    functionName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    generatorType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    formLayout: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    menuId: [{ validator: (_: any, value: string, done: any) => {
      const contains = (items: any[]): boolean => items.some(item => item.id === value || contains(item.children || []));
      done(contains(menuData.value) ? undefined : new Error('原菜单已不可用，请重新选择所属菜单'));
    }, trigger: 'change' }],
    span: [{ required: true, message: '请选择布局排列', trigger: 'change' }],
    parentId: [{ validator: (_: any, value: string, done: any) => done(dataForm.formLayout === 2 && !dataForm.fieldList.some(f => f.attrName === value && !f.primaryPk) ? new Error('请选择有效的父级节点字段') : undefined), trigger: 'change' }],
    tableLabel: [{ validator: (_: any, value: string, done: any) => done(dataForm.formLayout === 2 && !dataForm.fieldList.some(f => f.attrName === value) ? new Error('请选择节点名称字段') : undefined), trigger: 'change' }],
    backendPath: [{ validator: (_: any, value: string, done: any) => done(dataForm.generatorType === 1 && !value?.trim() ? new Error('请输入后端生成路径') : undefined), trigger: 'blur' }],
    frontendPath: [{ validator: (_: any, value: string, done: any) => done(dataForm.generatorType === 1 && !value?.trim() ? new Error('请输入前端生成路径') : undefined), trigger: 'blur' }],
  });

  // 保存
  const submitHandle = () => {
    if (loading.value || !ready.value) return;
    dataFormRef.value.validate((valid: boolean) => {
      if (!valid) {
        return false;
      }

      useTableSubmitApi(dataForm)
        .then(() => {
          ElMessage.success({
            message: '操作成功',
            duration: 500,
            onClose: () => {
              visible.value = false;
              emit('refreshDataList');
            },
          });
        })
        .catch(async (err) => {
          ElMessage.warning(err);
        })
        .finally(() => {
          NextLoading.close();
        });
    });
  };

  // 生成代码
  const generatorHandle = () => {
    if (loading.value || !ready.value) return;
    dataFormRef.value.validate(async (valid: boolean) => {
      if (!valid) {
        return false;
      }

      // 先保存
      await useTableSubmitApi(dataForm);

      // 生成代码，zip压缩包
      if (dataForm.generatorType === 0) {
        useDownloadApi([dataForm.id]);
        visible.value = false;
        return;
      }

      // 生成代码，自定义路径
      useGeneratorApi([dataForm.id])
        .then(() => {
          ElMessage.success({
            message: '操作成功',
            duration: 500,
            onClose: () => {
              visible.value = false;
              emit('refreshDataList');
            },
          });
        })
        .catch(async (err) => {
          ElMessage.warning(err);
        })
        .finally(() => {
          NextLoading.close();
        });
    });
  };

  defineExpose({
    init,
  });
</script>

<style lang="scss" scoped>
  .generator-code .el-dialog__body {
    padding: 15px 30px 0 20px;
  }
  .el-form .el-form-item:last-of-type {
    margin-bottom: 20px !important;
  }
</style>
