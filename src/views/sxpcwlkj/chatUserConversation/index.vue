<template>
    <div class="block">
                <!-- Table  -->
        <div class="sxpcwlkj-chatUserConversation-container layout-padding  mt-15  p-t-0">
            <el-card shadow="hover" class="layout-padding-auto">
                <el-container>
                    <el-header>
                        <!-- 新增/导入/导出/打印 -->
                        <TableTool ref="tableToolRef"
                                   tableComment="用户会话表"
                                   functionName="chatUserConversation"
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
                            <el-table-column v-if="false" prop="id" label="主键ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="userId" label="用户ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="conversationId" label="会话ID（私聊是对方用户ID，群聊是群组ID）" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="conversationType" label="会话类型：private私聊、group群聊" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="isPinned" label="是否置顶：0否 1是" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="pinnedTime" label="置顶时间" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="isMuted" label="是否免打扰：0否 1是" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="lastMessageTime" label="最后一条消息时间" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="lastMessageContent" label="最后一条消息内容" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="unreadCount" label="未读消息数" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="updateTime" label="更新时间" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="extra" label="扩展字段JSON" header-align="center" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width=" 100 ">
                                <template #default="scope">
                                    <el-tooltip placement="top" :content="$t('message.form.edit')">
                                        <el-icon class="mr10" color="blue" v-auths="['sxpcwlkj:chatUserConversation:query', 'sxpcwlkj:chatUserConversation:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })">
                                            <ele-Edit />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip placement="top" :content="$t('message.form.delete')">
                                        <el-icon class="mr10" color="blue"  v-auth="'sxpcwlkj:chatUserConversation:delete'" @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.id })" >
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
            <ChatUserConversationDialog ref="chatUserConversationDialogRef" @refresh="formSubmit"/>
        </div>
    </div>
</template>
//ModuleName 用户会话表
<script setup lang="ts" name="sxpcwlkjChatUserConversation">
    import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import {CURDEnum} from "/@/enums/CURDEnum";
    import {generateUUID, isEmpty} from "/@/utils/mms";
    import {NextLoading} from "/@/utils/loading";

    import {ChatUserConversationBo, ChatUserConversationVo} from '/@/views/sxpcwlkj/chatUserConversation/type';
    import {chatUserConversationApi} from '/@/views/sxpcwlkj/chatUserConversation';
    const baseApi = chatUserConversationApi();

    const chatUserConversationDialogRef = ref();
    const ChatUserConversationDialog = defineAsyncComponent(() => import('/@/views/sxpcwlkj/chatUserConversation/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as ChatUserConversationVo[],
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
            chatUserConversationDialogRef.value.openDialog(obj.type);
            return false;
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              chatUserConversationDialogRef.value.openDialog(obj.type, res.data);
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
    const formSubmit = (row: ChatUserConversationBo) => {
        if (isEmpty(row.id)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                chatUserConversationDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                chatUserConversationDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                chatUserConversationDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
            }).catch(async err => {
                chatUserConversationDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        }
    }
    // 更新状态
    const updateStatus = (row: ChatUserConversationVo, status: number) => {
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
    const handleSelectionChange = (val: ChatUserConversationVo[]) => {
        state.tableData.param.selectIds = val.map((item: any) => item.id).join(",");
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
