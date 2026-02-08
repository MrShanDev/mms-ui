<template>
    <div class="block">
                <!-- Table  -->
        <div class="article-storeArticleCate-container layout-padding  mt-15  p-t-0">
            <el-card shadow="hover" class="layout-padding-auto">
                <el-container>
                    <el-header>
                        <!-- 功能栏 -->
                        <div class="system-dept-search">
                            <el-button size="small" type="primary"  @click="clickExpand">
                                <el-icon><ele-Sort /></el-icon>
                                {{ expand.state ? "全部关闭" : "全部展开" }}
                            </el-button>
                            <el-button
                                size="small"
                                type="success"
                                class="ml10"
                                v-auth="'article:storeArticleCate:insert'"
                                @click="onCURD({ type: curdEnum.EDIT, ids: '1' })"
                            >
                                <el-icon>
                                    <ele-DocumentAdd />
                                </el-icon>
                                新增
                            </el-button>
                        </div>
                    </el-header>
                    <el-main>
                        <!-- Table -->
                        <el-table :data="state.tableData.data"
                                  v-loading="state.tableData.loading"
                                  style="width: 100%"
                                  row-key="id"
                                  :key="expand.key"
                                  :default-expand-all="expand.state"
                                  :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                        >
                            <el-table-column v-if="false" prop="id" label="ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="parentId" label="父ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="cateName" label="分类名称" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="level" label="级别" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="icon" label="图标" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="status" label="状态" show-overflow-tooltip>
                                <template #default="scope">
                                  <fast-switch
                                    v-model="scope.row.status"
                                    dict-type="SYS_STATE"
                                    placeholder="状态"
                                    size="small"
                                    @change="updateStatus(scope.row, scope.row.status)"
                                  ></fast-switch>
                                </template>
                              </el-table-column>
                            <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width=" 120 ">
                                <template #default="scope">
                                    <el-tooltip placement="top" :content="$t('message.form.insertSon')">
                                        <el-icon class="mr10" color="blue" v-auth="'article:storeArticleCate:insert'" @click="onCURD({ type: curdEnum.INSERT, ids: scope.row.id })">
                                            <ele-FolderAdd />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip placement="top" :content="$t('message.form.edit')">
                                        <el-icon class="mr10" color="blue" v-auths="['article:storeArticleCate:query', 'article:storeArticleCate:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })">
                                            <ele-Edit />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip placement="top" :content="$t('message.form.delete')">
                                        <el-icon class="mr10" color="blue"  v-auth="'article:storeArticleCate:delete'" @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.id })" >
                                            <ele-Delete />
                                        </el-icon>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </el-card>
            <StoreArticleCateDialog ref="storeArticleCateDialogRef" @refresh="formSubmit"/>
        </div>
    </div>
</template>
//ModuleName 店铺文章分类
<script setup lang="ts" name="articleStoreArticleCate">
    import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import {CURDEnum} from "/@/enums/CURDEnum";
    import {generateUUID, isEmpty} from "/@/utils/mms";
    import {NextLoading} from "/@/utils/loading";

    import {StoreArticleCateBo, StoreArticleCateVo} from '/@/views/article/storeArticleCate/type';
    import {storeArticleCateApi} from '/@/views/article/storeArticleCate';
    const baseApi = storeArticleCateApi();

    const storeArticleCateDialogRef = ref();
    const StoreArticleCateDialog = defineAsyncComponent(() => import('/@/views/article/storeArticleCate/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as StoreArticleCateVo[],
            total: 0,
            loading: false,
            param: {
                selectIds: "",
                pageNum: 1,
                pageSize: 10,
                isAll:true,
            }
        }
    });
    // 展开/合闭
    const expand = ref({
        state: true,
        key: 0,
    });
    const clickExpand = () => {
        expand.value.key = +new Date();
        expand.value.state = !expand.value.state;
    };
    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;
        baseApi.list(state.tableData.param).then(res => {
            state.tableData.data = res.data;
        }).catch(async err => {
            ElMessage.warning(err);
        }).finally(() => {
            state.tableData.loading = false;
        })
    };
    // 打开修改用户弹窗
    const onCURD = (obj: { type: CURDEnum; ids?: string }) => {
        if (obj.type === CURDEnum.INSERT) {
            baseApi.query(obj.ids).then((res) => {
                storeArticleCateDialogRef.value.openDialog(obj.type, res.data);
            }).catch(async (err) => {
                ElMessage.warning(err);
            }).finally(() => {});
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              storeArticleCateDialogRef.value.openDialog(obj.type, res.data);
           }).catch(async (err) => {
              ElMessage.warning(err);
           }).finally(() => {});
        }
        // 删除操作
        if (obj.type === CURDEnum.DELETE) {
            ElMessageBox.confirm(`此操作将永久删除，是否继续?`, "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                baseApi.delete(obj.ids).then((res) => {
                     getTableData();
                     ElMessage.success("删除成功");
                }).catch(async (err) => {
                     ElMessage.warning(err);
                }).finally(() => {
                    setTimeout(() => {
                       getTableData();
                    }, 1000);
                });
           }).catch(() => {});
        }
    }
    // 接收子组件传值
    const formSubmit = (row: StoreArticleCateBo) => {
        if (isEmpty(row.id)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                storeArticleCateDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                storeArticleCateDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                storeArticleCateDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
            }).catch(async err => {
                storeArticleCateDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        }
    }
    // 更新状态
    const updateStatus = (row: StoreArticleCateVo, status: number) => {
      row.status = status;
      baseApi
        .edit(row)
        .then((res) => {
          ElMessage.success('更新状态成功');
          getTableData(); // 直接刷新数据，不需要延迟
        })
        .catch(async (err) => {
          ElMessage.warning(err);
          getTableData(); // 即使失败也刷新数据以恢复原始状态
        });
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
