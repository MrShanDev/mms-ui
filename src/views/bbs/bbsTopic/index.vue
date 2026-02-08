<template>
    <div class="block">
        <div class="bbs-bbsTopic-container layout-padding mt-15 p-t-0">
            <!-- 搜索和操作栏 -->
            <div class="search-bar mb20">
                <div class="flex-b">
                    <div class="flex-c">
                        <el-select v-model="state.tableData.param.cateId" placeholder="选择分类" clearable class="mr10" style="width: 150px" @change="getTableData">
                            <el-option label="全部" :value="''" />
                            <el-option v-for="item in state.categories" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                        <el-input v-model="state.tableData.param.title" placeholder="输入标题搜索" clearable style="width: 200px" class="mr10" @keyup.enter="getTableData" />
                        <el-button type="primary" @click="getTableData">搜索</el-button>
                    </div>
                    <!-- 新增/导入/导出/打印 -->
                    <TableTool ref="tableToolRef"
                           tableComment="话题"
                           functionName="bbsTopic"
                           modelName="bbs"
                           :key="componentKey"
                           :param="state.tableData.param"
                           @close="componentKey = generateUUID()"
                           @insert="onCURD" @deletes="onCURD" />
                </div>
            </div>

            <!-- 瀑布流列表 -->
            <div v-loading="state.tableData.loading" class="waterfall-container">
                <div v-if="state.tableData.data.length === 0 && !state.tableData.loading" class="empty-state">
                    <el-empty description="暂无帖子" />
                </div>
                <div v-else class="waterfall-list">
                    <div v-for="item in state.tableData.data" :key="item.id" class="waterfall-item">
                        <div class="topic-card">
                            <!-- 卡片图片 -->
                            <div v-if="item.files && item.files.length > 0" class="card-image">
                                <el-image
                                    :src="item.files[0].url || item.files[0].fileUrl"
                                    :preview-src-list="item.files.map(f => f.url || f.fileUrl)"
                                    preview-teleported
                                    fit="cover"
                                />
                                <div class="image-overlay">
                                    <div class="status-badge" :class="item.status === 1 ? 'active' : 'inactive'">
                                        {{ item.status === 1 ? '已发布' : '已下架' }}
                                    </div>
                                </div>
                            </div>
                            <div v-else class="card-image-empty">
                                <el-icon :size="60"><ele-Picture /></el-icon>
                            </div>

                            <!-- 卡片内容 -->
                            <div class="card-content">
                                <!-- 标题 -->
                                <div class="card-title" :title="item.title">{{ item.title }}</div>

                                <!-- 发布者信息 -->
                                <div class="author-info">
                                    <el-avatar :size="28" :src="item.memberHeadImg" />
                                    <div class="author-details">
                                        <div class="author-name">{{ item.memberNickName || item.memberId }}</div>
                                        <div class="publish-time">{{ formatTime(item.createdTime) }}</div>
                                    </div>
                                </div>

                                <!-- 互动数据 -->
                                <div class="interaction-stats">
                                    <div class="stat-item">
                                        <el-icon><ele-Pointer /></el-icon>
                                        <span>{{ item.likeCount || 0 }}</span>
                                    </div>
                                    <div class="stat-item">
                                        <el-icon><ele-Star /></el-icon>
                                        <span>{{ item.favoriteCount || 0 }}</span>
                                    </div>
                                    <div class="stat-item" @click="openCommentDrawer(item)" style="cursor: pointer;">
                                        <el-icon><ele-ChatLineRound /></el-icon>
                                        <span>{{ item.commentCount || 0 }}</span>
                                    </div>
                                </div>

                                <!-- 操作按钮 -->
                                <div class="card-actions">
                                    <el-tooltip content="查看评论">
                                        <el-button type="primary" text size="small" @click="openCommentDrawer(item)">
                                            <el-icon><ele-ChatDotSquare /></el-icon>
                                        </el-button>
                                    </el-tooltip>
                                    <el-tooltip content="编辑">
                                        <el-button type="warning" text size="small" v-auths="['bbs:bbsTopic:query', 'bbs:bbsTopic:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: item.id })">
                                            <el-icon><ele-Edit /></el-icon>
                                        </el-button>
                                    </el-tooltip>
                                    <el-popconfirm
                                        title="确定删除该帖子吗？"
                                        confirm-button-text="确定"
                                        cancel-button-text="取消"
                                        @confirm="onCURD({ type: curdEnum.DELETE, ids: item.id })"
                                    >
                                        <template #reference>
                                            <el-button type="danger" text size="small" v-auth="'bbs:bbsTopic:delete'">
                                                <el-icon><ele-Delete /></el-icon>
                                            </el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-button type="info" text size="small" @click="toggleStatus(item)">
                                        <el-icon v-if="item.status === 1"><ele-CircleCloseFilled /></el-icon>
                                        <el-icon v-else><ele-SuccessFilled /></el-icon>
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 分页 -->
            <div v-if="state.tableData.total > 0" class="pagination-wrapper mt20">
                <el-pagination
                    @size-change="onHandleSizeChange"
                    @current-change="onHandleCurrentChange"
                    :pager-count="5"
                    :page-sizes="[12, 20, 30, 50]"
                    v-model:current-page="state.tableData.param.pageNum"
                    background
                    size="default"
                    v-model:page-size="state.tableData.param.pageSize"
                    layout="total, sizes, prev, pager, next"
                    :total="state.tableData.total"
                />
            </div>
        </div>
        <BbsTopicDialog ref="bbsTopicDialogRef" @refresh="formSubmit"/>

        <!-- 评论管理抽屉 -->
        <el-drawer v-model="state.commentDrawer.visible" :title="`评论管理 - ${state.commentDrawer.topicTitle}`" size="60%" destroy-on-close>
                <div class="p15" style="height: 100%; display: flex; flex-direction: column;">
                    <el-table :data="state.commentDrawer.data" v-loading="state.commentDrawer.loading" style="width: 100%; flex: 1;">
                        <el-table-column label="用户" width="150">
                            <template #default="scope">
                                <div class="flex-c">
                                    <el-avatar :size="24" :src="scope.row.memberHeadImg" class="mr5" />
                                    <span class="text-truncate">{{ scope.row.memberNickName }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="comment" label="评论内容" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createdTime" label="时间" width="160"></el-table-column>
                        <el-table-column label="状态" width="80">
                            <template #default="scope">
                                <fast-switch
                                    v-model="scope.row.status"
                                    dict-type="SYS_STATE"
                                    size="small"
                                    @change="updateCommentStatus(scope.row)"
                                ></fast-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80" fixed="right">
                            <template #default="scope">
                                <el-button type="danger" link @click="deleteComment(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="mt15 flex-b">
                        <el-pagination
                            v-model:current-page="state.commentDrawer.param.pageNum"
                            v-model:page-size="state.commentDrawer.param.pageSize"
                            :total="state.commentDrawer.total"
                            layout="total, prev, pager, next"
                            @current-change="getCommentData"
                            small
                        />
                    </div>
                </div>
            </el-drawer>
    </div>
</template>

<script setup lang="ts" name="bbsBbsTopic">
    //ModuleName 话题
    import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
    import {ElMessage, ElMessageBox} from "element-plus";
    import {CURDEnum} from "/@/enums/CURDEnum";
    import {generateUUID, isEmpty} from "/@/utils/mms";
    import {NextLoading} from "/@/utils/loading";

    import {BbsTopicBo, BbsTopicVo} from '/@/views/bbs/bbsTopic/type';
    import {bbsTopicApi} from '/@/views/bbs/bbsTopic';
    import {bbsCommentApi} from '/@/views/bbs/bbsComment';
    import {bbsCateApi} from '/@/views/bbs/bbsCate';
    const baseApi = bbsTopicApi();
    const commentApi = bbsCommentApi();
    const cateApi = bbsCateApi();

    const bbsTopicDialogRef = ref();
    const BbsTopicDialog = defineAsyncComponent(() => import('/@/views/bbs/bbsTopic/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as BbsTopicVo[],
            total: 0,
            loading: false,
            param: {
                selectIds: "",
                pageNum: 1,
                pageSize: 10,
                cateId: '',
                title: '',
            }
        },
        categories: [] as any[],
        commentDrawer: {
            visible: false,
            loading: false,
            topicId: '',
            topicTitle: '',
            data: [],
            total: 0,
            param: {
                pageNum: 1,
                pageSize: 10,
                bbsId: ''
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

    // 获取分类数据
    const getCategories = () => {
        cateApi.list({ isAll: true }).then(res => {
            state.categories = res.data[0].children;
        });
    };
    // 打开修改用户弹窗
    const onCURD = (obj: { type: CURDEnum; ids?: string }) => {
        if (obj.type === CURDEnum.INSERT) {
            bbsTopicDialogRef.value.openDialog(obj.type);
            return false;
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              bbsTopicDialogRef.value.openDialog(obj.type, res.data);
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
    const formSubmit = (row: BbsTopicBo) => {
        if (isEmpty(row.id)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                bbsTopicDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                bbsTopicDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                bbsTopicDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
            }).catch(async err => {
                bbsTopicDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        }
    }
    // 更新状态
    const updateStatus = (row: BbsTopicVo, status: number) => {
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

    // --- 评论管理相关 ---
    const openCommentDrawer = (row: BbsTopicVo) => {
        state.commentDrawer.topicId = row.id;
        state.commentDrawer.topicTitle = row.title;
        state.commentDrawer.param.bbsId = row.id;
        state.commentDrawer.param.pageNum = 1;
        state.commentDrawer.visible = true;
        getCommentData();
    };

    const getCommentData = () => {
        state.commentDrawer.loading = true;
        commentApi.list(state.commentDrawer.param).then(res => {
            state.commentDrawer.data = res.rows;
            state.commentDrawer.total = res.total;
        }).finally(() => {
            state.commentDrawer.loading = false;
        });
    };

    const updateCommentStatus = (row: any) => {
        commentApi.edit(row).then(() => {
            ElMessage.success('更新评论状态成功');
        }).catch(err => {
            ElMessage.warning(err);
            getCommentData();
        });
    };

    const deleteComment = (row: any) => {
        ElMessageBox.confirm('\u786e\u5b9a\u8981\u5220\u9664\u8be5\u8bc4\u8bba\u5417\uff1f', '\u63d0\u793a', { type: 'warning' }).then(() => {
            commentApi.delete(row.id).then(() => {
                ElMessage.success('\u5220\u9664\u8bc4\u8bba\u6210\u529f');
                getCommentData();
            });
        });
    };

    // \u65f6\u95f4\u683c\u5f0f\u5316
    const formatTime = (time: any) => {
        if (!time) return '';
        const date = new Date(time);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return '\u5203\u5203';
        if (minutes < 60) return `${minutes}\u5206\u949f\u524d`;
        if (hours < 24) return `${hours}\u5c0f\u65f6\u524d`;
        if (days < 7) return `${days}\u5929\u524d`;
        return date.toLocaleDateString();
    };

    // \u5207\u6362\u72b6\u6001
    const toggleStatus = (row: BbsTopicVo) => {
        row.status = row.status === 1 ? 0 : 1;
        updateStatus(row, row.status);
    };

    //选择项改变
    const handleSelectionChange = (val: BbsTopicVo[]) => {
        state.tableData.param.selectIds = val.map((item: any) => item.id).join(",");
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
        getCategories();
    });
</script>

<style scoped lang="scss">
.bbs-bbsTopic-container {
    background: #f5f7fa;
    min-height: 100vh;

    .search-bar {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    }

    .waterfall-container {
        min-height: 400px;
        position: relative;

        &.is-loading {
            opacity: 0.6;
            pointer-events: none;
        }
    }

    .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
    }

    .waterfall-list {
        column-count: 4;
        column-gap: 20px;
        padding: 20px 0;

        @media (max-width: 1600px) {
            column-count: 3;
        }

        @media (max-width: 1200px) {
            column-count: 2;
        }

        @media (max-width: 768px) {
            column-count: 1;
            column-gap: 12px;
        }
    }

    .waterfall-item {
        break-inside: avoid;
        margin-bottom: 20px;
        animation: fadeInUp 0.3s ease-out;
    }

    .topic-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;

        &:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
            transform: translateY(-4px);
        }

        .card-image {
            position: relative;
            width: 100%;
            background: #f0f0f0;
            min-height: 100px;

            :deep(img) {
                width: 100%;
                display: block;
                height: auto; // 高度自适应
            }

            .image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: opacity 0.3s ease;
                display: flex;
                align-items: flex-end;
                padding: 12px;

                .status-badge {
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    backdrop-filter: blur(4px);
                    background: rgba(255, 255, 255, 0.9);

                    &.active {
                        color: #67c23a;
                    }

                    &.inactive {
                        color: #f56c6c;
                    }
                }
            }

            &:hover .image-overlay {
                opacity: 1;
            }
        }

        .card-image-empty {
            width: 100%;
            padding-bottom: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #909399;
        }
    }

    .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 16px;
        gap: 12px;

        .card-title {
            font-size: 14px;
            font-weight: 600;
            color: #1f2329;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            word-break: break-word;
        }

        .author-info {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-top: 8px;
            border-top: 1px solid #f0f0f0;

            .author-details {
                flex: 1;
                min-width: 0;

                .author-name {
                    font-size: 13px;
                    font-weight: 500;
                    color: #1f2329;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .publish-time {
                    font-size: 12px;
                    color: #909399;
                    margin-top: 2px;
                }
            }
        }

        .interaction-stats {
            display: flex;
            justify-content: space-around;
            padding: 8px 0;
            color: #606266;
            font-size: 12px;

            .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                transition: color 0.3s ease;

                :deep(.el-icon) {
                    font-size: 14px;
                }

                &:hover {
                    color: #409eff;
                }
            }
        }

        .card-actions {
            display: flex;
            gap: 4px;
            justify-content: flex-end;
            margin-top: auto;

            :deep(.el-button) {
                padding: 4px 8px;
                height: 28px;
                font-size: 12px;

                .el-icon {
                    font-size: 14px;
                }
            }
        }
    }

    .pagination-wrapper {
        display: flex;
        justify-content: center;
        padding: 20px 0;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
