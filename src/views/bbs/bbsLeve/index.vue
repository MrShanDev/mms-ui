<template>
    <div class="block">
                <!-- Table  -->
        <div class="bbs-bbsLeve-container layout-padding  mt-15  p-t-0">
            <el-card shadow="hover" class="layout-padding-auto">
                <el-container>
                    <el-header>
                        <!-- 新增/导入/导出/打印 -->
                        <TableTool ref="tableToolRef"
                                   tableComment="话题操作"
                                   functionName="bbsLeve"
                                   modelName="bbs"
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
                            <el-table-column prop="id" label="ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="bbsId" label="话题ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="memberId" label="会员ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="type" label="类型;1:喜欢 2:点赞 3:分享" header-align="center" align="center"></el-table-column>
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
                            <el-table-column fixed="right" label="操作" width=" 100 ">
                                <template #default="scope">
                                    <el-tooltip placement="top" :content="$t('message.form.edit')">
                                        <el-icon class="mr10" color="blue" v-auths="['bbs:bbsLeve:query', 'bbs:bbsLeve:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })">
                                            <ele-Edit />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip placement="top" :content="$t('message.form.delete')">
                                        <el-icon class="mr10" color="blue"  v-auth="'bbs:bbsLeve:delete'" @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.id })" >
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
            <BbsLeveDialog ref="bbsLeveDialogRef" @refresh="formSubmit"/>
        </div>
    </div>
</template>
//ModuleName 话题操作
<script setup lang="ts" name="bbsBbsLeve">
    import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import {CURDEnum} from "/@/enums/CURDEnum";
    import {generateUUID, isEmpty} from "/@/utils/mms";
    import {NextLoading} from "/@/utils/loading";

    import {BbsLeveBo, BbsLeveVo} from '/@/views/bbs/bbsLeve/type';
    import {bbsLeveApi} from '/@/views/bbs/bbsLeve';
    const baseApi = bbsLeveApi();

    const bbsLeveDialogRef = ref();
    const BbsLeveDialog = defineAsyncComponent(() => import('/@/views/bbs/bbsLeve/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as BbsLeveVo[],
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
            bbsLeveDialogRef.value.openDialog(obj.type);
            return false;
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              bbsLeveDialogRef.value.openDialog(obj.type, res.data);
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
    const formSubmit = (row: BbsLeveBo) => {
        if (isEmpty(row.id)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                bbsLeveDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                bbsLeveDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                bbsLeveDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
            }).catch(async err => {
                bbsLeveDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        }
    }
    // 更新状态
    const updateStatus = (row: BbsLeveVo, status: number) => {
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
    const handleSelectionChange = (val: BbsLeveVo[]) => {
        state.tableData.param.selectIds = val.map((item: any) => item.id).join(",");
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
