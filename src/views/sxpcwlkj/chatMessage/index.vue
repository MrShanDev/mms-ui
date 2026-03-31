<template>
    <div class="block">
                <!-- Table  -->
        <div class="sxpcwlkj-chatMessage-container layout-padding  mt-15  p-t-0">
            <el-card shadow="hover" class="layout-padding-auto">
                <el-container>
                    <el-header>
                        <!-- 新增/导入/导出/打印 -->
                        <TableTool ref="tableToolRef"
                                   tableComment="聊天消息表"
                                   functionName="chatMessage"
                                   modelName="sxpcwlkj"
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
                            <el-table-column v-if="false" prop="id" label="消息ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="senderId" label="发送者ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="receiverId" label="接收者ID（私聊时使用）" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="chatRoomId" label="聊天室ID（群聊时使用）" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="messageType" label="消息类型：private私聊、group群聊、broadcast广播" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="content" label="消息内容" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="contentType" label="内容类型：text文本、image图片、video视频、file文件、recall撤回" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="status" label="消息状态：normal正常、recall撤回、delete删除" show-overflow-tooltip>
                                <template #default="scope">
                                  <fast-switch
                                    v-model="scope.row.status"
                                    dict-type="SYS_STATE"
                                    placeholder="消息状态：normal正常、recall撤回、delete删除"
                                    size="small"
                                    @change="updateStatus(scope.row, scope.row.status)"
                                  ></fast-switch>
                                </template>
                              </el-table-column>
                            <el-table-column prop="createTime" label="消息发送时间" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="updateTime" label="消息更新时间" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="extra" label="扩展字段JSON格式" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="contentLength" label="消息长度" header-align="center" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width=" 100 ">
                                <template #default="scope">
                                    <el-tooltip placement="top" :content="$t('message.form.edit')">
                                        <el-icon class="mr10" color="blue" v-auths="['sxpcwlkj:chatMessage:query', 'sxpcwlkj:chatMessage:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })">
                                            <ele-Edit />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip placement="top" :content="$t('message.form.delete')">
                                        <el-icon class="mr10" color="blue"  v-auth="'sxpcwlkj:chatMessage:delete'" @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.id })" >
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
            <ChatMessageDialog ref="chatMessageDialogRef" @refresh="formSubmit"/>
        </div>
    </div>
</template>
//ModuleName 聊天消息表
<script setup lang="ts" name="sxpcwlkjChatMessage">
    import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import {CURDEnum} from "/@/enums/CURDEnum";
    import {generateUUID, isEmpty} from "/@/utils/mms";
    import {NextLoading} from "/@/utils/loading";

    import {ChatMessageBo, ChatMessageVo} from '/@/views/sxpcwlkj/chatMessage/type';
    import {chatMessageApi} from '/@/views/sxpcwlkj/chatMessage';
    const baseApi = chatMessageApi();

    const chatMessageDialogRef = ref();
    const ChatMessageDialog = defineAsyncComponent(() => import('/@/views/sxpcwlkj/chatMessage/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as ChatMessageVo[],
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
            chatMessageDialogRef.value.openDialog(obj.type);
            return false;
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              chatMessageDialogRef.value.openDialog(obj.type, res.data);
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
    const formSubmit = (row: ChatMessageBo) => {
        if (isEmpty(row.id)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                chatMessageDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                chatMessageDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                chatMessageDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
            }).catch(async err => {
                chatMessageDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        }
    }
    // 更新状态
    const updateStatus = (row: ChatMessageVo, status: number) => {
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
    const handleSelectionChange = (val: ChatMessageVo[]) => {
        state.tableData.param.selectIds = val.map((item: any) => item.id).join(",");
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
