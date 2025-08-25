<template>
    <div class="block">
                <!-- Table  -->
        <div class="docAdmin-docProduct-container layout-padding  mt-5  p-t-0">
            <el-card shadow="hover" class="layout-padding-auto">
                <el-container>
                    <el-header>
                        <!-- 新增/导入/导出/打印 -->
                        <TableTool ref="tableToolRef"
                                   tableComment="文档商品"
                                   functionName="docProduct"
                                   modelName="docAdmin"
                                   :key="componentKey"
                                   :param="state.tableData.param"
                                   @close="componentKey = generateUUID()"
                                   @insert="onCURD" @deletes="onCURD" />
                    </el-header>
                    <el-main>
                        <!-- Table -->
                        <el-table :data="state.tableData.data"
                                  v-loading="state.tableData.loading"
                                  style="width: 100%"
                                  @selection-change="handleSelectionChange"
                        >
                            <el-table-column  type="selection" header-align="center" align="center" width="50"></el-table-column>
                            <el-table-column v-if="false" prop="prodId" label="产品编号" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="prodName" label="产品名称" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="unitPrice" label="销售单价" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="markPrice" label="市场价格" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="type" label="产品类型" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="ctime" label="创建时间" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="mtime" label="更新时间" header-align="center" align="center"></el-table-column>
                            <fast-table-column prop="status" label="商品状态" dict-type="SYS_STATE"></fast-table-column>
                            <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width=" 100 ">
                                <template #default="scope">
                                    <el-tooltip placement="top" :content="$t('message.form.edit')">
                                        <el-icon class="mr10" color="blue" v-auths="['docAdmin:docProduct:query', 'docAdmin:docProduct:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.prodId })">
                                            <ele-Edit />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip placement="top" :content="$t('message.form.delete')">
                                        <el-icon class="mr10" color="blue"  v-auth="'docAdmin:docProduct:delete'" @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.prodId })" >
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
                        >
                        </el-pagination>
                    </el-footer>
                </el-container>
            </el-card>
            <DocProductDialog ref="docProductDialogRef" @refresh="formSubmit"/>
        </div>
    </div>
</template>
//ModuleName 文档商品
<script setup lang="ts" name="docAdminDocProduct">
    import { defineAsyncComponent, reactive, onMounted, ref } from "vue";
    import { ElMessageBox, ElMessage } from "element-plus";
    import { CURDEnum } from "/@/enums/CURDEnum";
    import { isEmpty, generateUUID } from "/@/utils/mms";
    import {NextLoading} from "/@/utils/loading";
    import FastSelect from "/@/components/fast-select/src/fast-select.vue";
    import {docProductApi} from '/@/views/docAdmin/docProduct';
    import {DocProductBo,DocProductVo } from '/@/views/docAdmin/docProduct/type';
    const baseApi = docProductApi();
    import FastTableColumn from "/@/components/fast-table-column";
    const docProductDialogRef = ref();
    const DocProductDialog = defineAsyncComponent(() => import('/@/views/docAdmin/docProduct/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as DocProductVo[],
            total: 0,
            loading: false,
            param: {
                selectIds: "",
                pageNum: 1,
                pageSize: 10,
            }
        }
    });
    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;
        baseApi.list(state.tableData.param).then(res => {
            state.tableData.data = res.rows;
            state.tableData.total = res.total;
        }).catch(async err => {
            ElMessage.warning(err);
        }).finally(() => {
            state.tableData.loading = false;
        })
    };
    // 打开修改用户弹窗
    const onCURD = (obj: { type: CURDEnum; ids?: string }) => {
        if (obj.type === CURDEnum.INSERT) {
            docProductDialogRef.value.openDialog(obj.type);
            return false;
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              docProductDialogRef.value.openDialog(obj.type, res.data);
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
    const formSubmit = (row: DocProductBo) => {
        if (isEmpty(row.prodId)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                docProductDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                docProductDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                docProductDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
            }).catch(async err => {
                docProductDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        }
    }
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
    const handleSelectionChange = (val: DocProductVo[]) => {
        state.tableData.param.selectIds = val.map((item: any) => item.id).join(",");
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
