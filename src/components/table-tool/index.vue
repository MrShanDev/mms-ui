<template>
  <div class="w-100">
    <!-- 工具框 -->
    <div class="table-tool">
      <el-button-group>
        <!-- 新增 -->
        <el-button
          size="small"
          type="primary"
          v-if="supportedActions.includes('insert')"
          @click="insert"
          :loading="state.loading.insert"
          v-auth="modelName + ':' + functionName + ':insert'"
        >
          <SvgIcon name="iconfont icon-xinzeng" />
          {{ $t('message.form.insert') }}
        </el-button>
        <!-- 删除 -->
        <el-button
          size="small"
          type="danger"
          v-if="supportedActions.includes('delete')"
          @click="deletes"
          :loading="state.loading.delete"
          v-auth="modelName + ':' + functionName + ':delete'"
        >
          <SvgIcon name="iconfont icon-weibiaoti544" />
          {{ $t('message.form.delete') }}
        </el-button>
        <!-- 导入 -->
        <el-button
          size="small"
          type="success"
          v-if="supportedActions.includes('import')"
          @click="openDialog"
          :loading="state.loading.import"
          v-auth="modelName + ':' + functionName + ':import'"
        >
          <SvgIcon name="iconfont icon-daoru" />
          {{ $t('message.form.import') }}
        </el-button>
        <!-- 导出 -->
        <el-button
          size="small"
          type="warning"
          v-if="supportedActions.includes('export')"
          @click="exportExcel"
          :loading="state.loading.export"
          v-auth="modelName + ':' + functionName + ':export'"
        >
          <SvgIcon name="iconfont icon-daochu" />
          {{ $t('message.form.export') }}
        </el-button>
        <!-- 打印 -->
        <el-button
          size="small"
          type="info"
          v-if="supportedActions.includes('print')"
          @click="print"
          :loading="state.loading.print"
          v-auth="modelName + ':' + functionName + ':print'"
        >
          <SvgIcon name="iconfont icon-weibiaoti--" />
          {{ $t('message.form.print') }}
        </el-button>
      </el-button-group>
    </div>
    <!-- 导入 -->
    <el-dialog
      :title="state.dialog.title"
      v-model="state.dialog.isShowDialog"
      width="min(450px, 94vw)"
      @close="closeDialog"
    >
      <el-upload
        class="upload-file"
        action="#"
        :http-request="handleHttpUpload"
        :headers="httpFileHeaders"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
      >
        <div class="flex">
          <el-button type="primary">
            <SvgIcon name="iconfont icon-daoru" />
            {{ $t('message.export.update') }}
          </el-button>
          <p v-if="props.modelName === 'system' && props.functionName === 'user'">
            仅新增账户，不覆盖已有用户；账户默认禁用且不分配角色，管理员重置密码、授权后再启用。
          </p>
          <p v-if="props.modelName === 'system' && props.functionName === 'notice'">
            仅新增公告，默认禁用，审核后再启用。
          </p>
          <p v-if="props.modelName === 'system' && props.functionName === 'dept'">
            部门编号必须唯一；父级编号须在系统或本次文件中存在。
          </p>
          <div class="importMsg">{{ state.importMsg }}</div>
        </div>

        <template #tip>
          <div class="flex">
            <div class="el-upload__tip">{{ $t('message.export.msg') }}</div>
            <div class="el-upload__tip template" @click="getTemplate">
              {{ $t('message.export.template') }}
            </div>
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
  import { ref, inject, computed } from 'vue';
  import { NextLoading } from '/@/utils/loading';
  import {
    UploadProps,
    UploadRequestOptions,
    formContextKey,
    formItemContextKey,
    ElMessage,
  } from 'element-plus';
  import printJs from 'print-js';
  import { importData, downloadTemplate, exportData, printData } from '/@/views/system/upload';
  import { Session } from '/@/utils/storage';
  import { isEmpty } from '/@/utils/mms';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { LoadingInstance } from 'element-plus/es/components/loading/src/loading';
  let downloadLoadingInstance: LoadingInstance;
  const httpFileHeaders = ref({
    Authorization: `${Session.get('token')}`,
  });
  // 传入对象
  interface PropsType {
    fileType?: any[]; // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
    functionName?: string;
    modelName?: string;
    tableComment: string;
    param: any;
  }
  // Prop 组件传过来的值
  const props = withDefaults(defineProps<PropsType>(), {
    fileType: () => ['xlsx'],
    functionName: '',
    modelName: 'system',
    tableComment: '',
    param: () => {},
  });

  const supportedActions = computed(() => {
    const capabilities: Record<string, string[]> = {
      user: ['insert', 'delete', 'import', 'export', 'print'],
      dept: ['import'],
      role: ['insert', 'delete'],
      dict: ['insert', 'delete'],
      notice: ['insert', 'delete', 'import', 'export', 'print'],
      config: ['insert', 'delete'],
      sysLog: ['export', 'print'],
    };
    return props.modelName === 'system'
      ? capabilities[props.functionName] || ['insert', 'delete', 'import', 'export', 'print']
      : ['insert', 'delete', 'import', 'export', 'print'];
  });

  // emit 通信
  const emit = defineEmits<{
    insert: [value: any];
    success: [value: any];
    close: [value: any];
    print: [value: any];
    deletes: [value: any];
  }>();
  // 定义变量内容
  const defDialogFormRef = ref();
  const state = reactive({
    dialog: {
      isShowDialog: false,
      type: '',
      title: '',
      submitTxt: '',
    },
    importMsg: '',
    loading: {
      insert: false,
      delete: false,
      import: false,
      export: false,
      print: false,
    },
  });
  // 获取 el-form 组件上下文
  const formContext = inject(formContextKey, void 0);
  // 获取 el-form-item 组件上下文
  const formItemContext = inject(formItemContextKey, void 0);
  // 超出限制
  const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
    ElMessage.warning(`最多可选择 ${files.length} 个文件！`);
  };
  // 打开弹窗
  const openDialog = (type: string) => {
    state.loading.import = false;
    state.dialog.title = `导入${props.tableComment}`;
    state.importMsg = '';
    state.dialog.isShowDialog = true;
  };
  // 关闭弹窗
  const closeDialog = () => {
    emit('close', '');
    state.dialog.isShowDialog = false;
  };
  //新增
  const insert = async () => {
    state.loading.insert = true;
    try {
      emit('insert', { type: CURDEnum.INSERT });
    } finally {
      // 延迟重置 loading 状态，给父组件处理的时间
      setTimeout(() => {
        state.loading.insert = false;
      }, 500);
    }
  };
  //删除
  const deletes = async () => {
    if (isEmpty(props.param.selectIds)) {
      ElMessage.warning('请选择要删除的数据');
      return;
    }
    state.loading.delete = true;
    try {
      emit('deletes', { type: CURDEnum.DELETE, ids: props.param.selectIds });
    } finally {
      // 延迟重置 loading 状态，给父组件处理的时间
      setTimeout(() => {
        state.loading.delete = false;
      }, 500);
    }
  };
  //保存
  const save = () => {
    emit('success', 'success');
  };

  //打印
  const print = () => {
    state.loading.print = true;
    NextLoading.open();
    printData(props.param, props.modelName + '/' + props.functionName)
      .then((res) => {
        printTable(res.data);
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {
        NextLoading.close();
        state.loading.print = false;
      });
  };
  //下载模版
  const getTemplate = async () => {
    state.loading.export = true;
    try {
      await downloadTemplate(props.modelName + '/' + props.functionName, props.tableComment);
    } finally {
      state.loading.export = false;
    }
  };
  //导出数据
  const exportExcel = async () => {
    state.loading.export = true;
    try {
      await exportData(props.modelName + '/' + props.functionName, props.tableComment, props.param);
    } finally {
      state.loading.export = false;
    }
  };
  //上传导入数据
  const handleHttpUpload = async (options: UploadRequestOptions) => {
    let formData = new FormData();
    formData.append('file', options.file);
    try {
      state.loading.import = true;
      NextLoading.open();
      await importData(formData, props.modelName + '/' + props.functionName).then((res) => {
        if (res.code !== 200) throw new Error(res.msg || '导入失败');
        state.importMsg = res.msg;
        options.onSuccess(res);
        emit('success', res);
        // 调用 el-form 内部的校验方法（可自动校验）
        formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);

        NextLoading.close();
      });
    } catch (error) {
      NextLoading.close();
      options.onError(error as any);
    } finally {
      state.loading.import = false;
    }
  };
  // 打印数据
  const printTable = (printData: PrintObject) => {
    // https://printjs.crabbly.com/#documentation
    // 自定义打印
    let tableTh = '';
    let tableTrTd = '';
    let tableTd: any = {};
    // 表头
    printData.header.forEach((v) => {
      tableTh += `<th class="table-th">${v.title}</th>`;
    });
    printData.header.forEach((v) => {});
    // 表格内容
    printData.data.forEach((val, key) => {
      if (!tableTd[key]) tableTd[key] = [];
      let html = '';
      let index = 0;
      printData.header.forEach((v) => {
        for (let k in val) {
          if (k === v.key) {
            let header = printData.header.filter((h) => h.key == k);
            if (header[0].type === 'TEXT') {
              html = html + `<td class="table-th table-center">${val[k]}</td>`;
            }
            if (header[0].type === 'IMAGE') {
              html =
                html +
                `<td class="table-th table-center"><img src="${val[k]}" style="width:${header[0].width}px;height:${header[0].height}px;"/></td>`;
            }
          }
          index++;
        }
      });

      tableTd[key].push(html);
      tableTrTd += `<tr>${tableTd[key].join('')}</tr>`;
    });
    // 打印
    printJs({
      printable: `<div style=display:flex;flex-direction:column;text-align:center><h3>${printData.title}</h3></div><table border=1 cellspacing=0 width="100%"><tr>${tableTh}${tableTrTd}</table>`,
      type: 'raw-html',
      css: [
        '//at.alicdn.com/t/c/font_4740715_kjhdas71qeq.css',
        '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        '//unpkg.com/element-plus/dist/index.css',
      ],
      style: `@media print{.mb15{margin-bottom:15px;}.el-button--small i.iconfont{font-size: 12px !important;margin-right: 5px;}}; .table-th{word-break: break-all;white-space: pre-wrap;}.table-center{text-align: center;}`,
    });
  };
  // 暴露变量
  defineExpose({
    openDialog, //打开导入框
    closeDialog, //关闭到入口
    exportExcel, //导出数据
    printTable, //打印数据
  });
</script>
<style lang="css">
  .w-100 {
    width: 100%;
  }
  .template {
    font-size: 12px;
    font-weight: 800;
    margin-left: 10px;
    cursor: pointer;
    color: rgb(237, 122, 80);
  }
  .importMsg {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
  }
</style>
