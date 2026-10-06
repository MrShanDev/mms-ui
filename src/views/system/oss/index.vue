<template>
  <SystemPage feature="oss">
    <div class="system-oss-container layout-padding">
      <el-card shadow="never" class="layout-padding-auto">
        <div class="system-user-search mb15">
          <el-upload
            ref="upload"
            class="ml5"
            :action="httpFileUrl"
            :limit="1"
            :headers="httpFileHeaders"
            :on-exceed="handleExceed"
            :on-success="onSuccess"
            :on-error="onUploadError"
            v-model:file-list="selectedFiles"
            :auto-upload="false"
          >
            <template #trigger>
              <el-button size="small" type="warning" v-auth="'system:oss:insert'">
                选择文件
              </el-button>
            </template>
            <el-button
              size="small"
              class="ml10"
              type="success"
              :loading="uploading"
              v-auth="'system:oss:insert'"
              @click="submitUpload"
            >
              提交上传
            </el-button>
            <el-button
              size="small"
              :type="state.tableData.param.lookImg ? 'info' : 'primary'"
              @click="updateLookImg"
            >
              <View
                v-if="!state.tableData.param.lookImg"
                style="width: 1em; height: 1em; margin-right: 8px"
              />
              <Hide v-else style="width: 1em; height: 1em; margin-right: 8px" />
              {{ state.tableData.param.lookImg ? '隐藏图片' : '显示图片' }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip text-red">
                {{ $t('message.router.ossinfo') }}
              </div>
            </template>
          </el-upload>
        </div>
        <el-table
          :data="state.tableData.data"
          v-loading="state.tableData.loading"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="80">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ossId"
            label="ID"
            width="190"
            show-overflow-tooltip
          ></el-table-column>
          <fast-table-column
            prop="platform"
            label="存储平台"
            width="150"
            dict-type="OSS_TYPE"
          ></fast-table-column>
          <el-table-column
            prop="originalName"
            label="原名称"
            width="200"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column prop="url" label="网络地址" show-overflow-tooltip min-width="120">
            <template #default="scope">
              <img
                @click="handlePreview(scope.row.ossId)"
                v-if="state.tableData.param.lookImg"
                :src="scope.row.base64"
                style="height: 30px"
              />
              <p v-else ref="copyTextRef" @click="handlePreview(scope.row.ossId)">
                {{ scope.row.url }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="fileSuffix"
            label="后缀"
            width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createdTime"
            label="创建时间"
            width="170"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button
                size="small"
                text
                type="primary"
                v-auth="'system:oss:query'"
                @click="handlePreview(scope.row.ossId)"
              >
                预览
              </el-button>
              <el-button size="small" text type="primary" @click="copy(scope.row.url)">
                复制
              </el-button>
              <el-button
                size="small"
                text
                type="danger"
                v-auth="'system:oss:delete'"
                @click="onRowDel(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
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
        ></el-pagination>
      </el-card>
      <!-- 图片预览-->
      <el-image-viewer
        v-if="showImagePreview"
        :zoom-rate="1.2"
        hide-on-click-modal
        teleported
        style="z-index: 3000"
        @close="closePreview"
        :url-list="imgPreviewList"
      />
    </div>
  </SystemPage>
</template>

<script setup lang="ts" name="systemOss">
  import SystemPage from '/@/views/system/shared/SystemPage.vue';
  import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
  import { ElMessageBox, ElMessage, genFileId } from 'element-plus';
  import { ossApi } from '/@/views/system/oss';
  import { isEmpty, getEnv } from '/@/utils/mms';
  import { Session } from '/@/utils/storage';
  import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus';
  import FastTableColumn from '/@/components/fast-table-column/src/fast-table-column.vue';
  import { Hide, Share, Tools, View } from '@element-plus/icons-vue';
  import useClipboard from 'vue-clipboard3';
  import { SysOssState, RowOssType } from '/@/views/system/oss/type';

  // 引入 api 请求接口
  const baseApi = ossApi();
  const { toClipboard } = useClipboard();
  const upload = ref<UploadInstance>();
  const state = reactive<SysOssState>({
    tableData: {
      data: [],
      total: 0,
      loading: false,
      param: {
        lookImg: false,
        name: '',
        pageNum: 1,
        pageSize: 10,
      },
    },
  });
  const selectedFiles = ref<UploadUserFile[]>([]);
  const uploading = ref(false);
  const onUploadError = () => {
    uploading.value = false;
    ElMessage.error('上传失败，请检查存储配置后重试');
  };
  // 图片预览
  const imgPreviewList = ref<any>([]);
  const showImagePreview = ref(false);
  const copy = (txt: string) => {
    toClipboard(txt)
      .then(() => {
        ElMessage.success('复制成功！');
      })
      .catch(() => {
        ElMessage.warning('复制失败！');
      });
  };
  // 图片上传
  const httpFileUrl = ref(getEnv() + '/system/oss');
  const httpFileHeaders = ref({
    Authorization: `${Session.get('token')}`,
  });
  // 当超出限制时
  const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles();
    const file = files[0] as UploadRawFile;
    file.uid = genFileId();
    upload.value!.handleStart(file);
  };
  //上传成功
  const onSuccess: UploadProps['onSuccess'] = (response) => {
    uploading.value = false;
    if (response?.code !== 200) {
      ElMessage.error(response?.msg || '上传失败');
      return;
    }
    upload.value?.clearFiles();
    ElMessage.success('上传成功');
    getTableData();
  };
  const submitUpload = () => {
    if (!selectedFiles.value.some((file) => file.status === 'ready')) {
      ElMessage.warning('请先选择文件');
      return;
    }
    uploading.value = true;
    upload.value?.submit();
  };
  const handlePreview = async (ossId: string) => {
    try {
      const res = await baseApi.query(ossId);
      const image = res.data?.base64;
      if (!image) {
        ElMessage.info('该文件暂无图片预览');
        return;
      }
      imgPreviewList.value = [image];
      showImagePreview.value = true;
    } catch {
      /* 请求封装已展示错误 */
    }
  };
  // 关闭预览
  const closePreview = () => {
    imgPreviewList.value = [];
    showImagePreview.value = false;
  };
  const updateLookImg = () => {
    state.tableData.param.lookImg = !state.tableData.param.lookImg;
    getTableData();
  };
  // 初始化表格数据
  const getTableData = () => {
    state.tableData.loading = true;
    baseApi
      .list(state.tableData.param)
      .then((res) => {
        state.tableData.data = res.rows;
        state.tableData.total = res.total;
        state.tableData.loading = false;
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {
        state.tableData.loading = false;
      });
  };
  // 删除
  const onRowDel = (row: RowOssType) => {
    ElMessageBox.confirm(`此操作将永久删除文件名称：“${row.originalName}”，是否继续?`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        baseApi
          .delete(row.ossId)
          .then((res) => {
            getTableData();
            ElMessage.success('删除成功');
          })
          .catch(async (err) => {
            ElMessage.warning(err);
          })
          .finally(() => {});
      })
      .catch(() => {});
  };
  // 分页改变
  const onHandleSizeChange = (val: number) => {
    state.tableData.param.pageSize = val;
    state.tableData.param.pageNum = 1;
    getTableData();
  };
  // 分页改变
  const onHandleCurrentChange = (val: number) => {
    state.tableData.param.pageNum = val;
    getTableData();
  };
  // 页面加载时
  onMounted(() => {
    getTableData();
  });
</script>
<style scoped lang="scss"></style>
