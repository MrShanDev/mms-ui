<template>
    <div class="block">
                <!-- 功能栏  -->
        <div class="views-tool">
            <div class="tool-left">
                <el-form :inline="true" size="default" :model="state.tableData.param" class="form-tool" @keyup.enter="getTableData">
                        <el-form-item>
                            <el-input v-model="state.tableData.param.memberId" size="default" placeholder="会员ID" style="max-width: 180px" clearable ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="state.tableData.param.phone" size="default" placeholder="收货手机号" style="max-width: 180px" clearable ></el-input>
                        </el-form-item>
                    <el-form-item>
                        <el-button size="default" type="primary" @click="getTableData" v-auth="'member:storeMemberAddress:list'">
                            <SvgIcon name="iconfont icon-search1" />{{ $t("message.form.search") }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- Table  -->
        <div class="member-storeMemberAddress-container layout-padding  m-t-0  p-t-0">
            <el-card shadow="hover" class="layout-padding-auto">
                <el-container>
                    <el-header>
                        <!-- 新增/导入/导出/打印 -->
                        <TableTool ref="tableToolRef"
                                   tableComment="会员收货地址"
                                   functionName="storeMemberAddress"
                                   modelName="member"
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
                            <el-table-column v-if="false" prop="id" label="ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="memberId" label="会员ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="name" label="收货人" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="phone" label="收货手机号" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="country" label="国家" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="province" label="省" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="city" label="市" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="district" label="区/县" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="address" label="详细地址" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="isDef" label="是否默认" header-align="center" align="center"></el-table-column>
                            <fast-table-column prop="status" label="状态" dict-type="SYS_STATE"></fast-table-column>
                            <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
                            <el-table-column fixed="right" label="操作" width=" 100 ">
                                <template #default="scope">
                                    <el-tooltip placement="top" :content="$t('message.form.edit')">
                                        <el-icon class="mr10" color="blue" v-auths="['member:storeMemberAddress:query', 'member:storeMemberAddress:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })">
                                            <ele-Edit />
                                        </el-icon>
                                    </el-tooltip>
                                    <el-tooltip placement="top" :content="$t('message.form.delete')">
                                        <el-icon class="mr10" color="blue"  v-auth="'member:storeMemberAddress:delete'" @click="onCURD({ type: curdEnum.DELETE, ids: scope.row.id })" >
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
            <StoreMemberAddressDialog ref="storeMemberAddressDialogRef" @refresh="formSubmit"/>
        </div>
    </div>
</template>
//ModuleName 会员收货地址
<script setup lang="ts" name="memberStoreMemberAddress">
import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {CURDEnum} from "/@/enums/CURDEnum";
import {generateUUID, isEmpty} from "/@/utils/mms";
import {NextLoading} from "/@/utils/loading";

import {StoreMemberAddressBo, StoreMemberAddressVo} from '/@/views/member/storeMemberAddress/type';
import {storeMemberAddressApi} from '/@/views/member/storeMemberAddress';

const baseApi = storeMemberAddressApi();

    const storeMemberAddressDialogRef = ref();
    const StoreMemberAddressDialog = defineAsyncComponent(() => import('/@/views/member/storeMemberAddress/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as StoreMemberAddressVo[],
            total: 0,
            loading: false,
            param: {
                selectIds: "",
                pageNum: 1,
                pageSize: 10,
                memberId: '',
                phone: ''
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
            storeMemberAddressDialogRef.value.openDialog(obj.type);
            return false;
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              storeMemberAddressDialogRef.value.openDialog(obj.type, res.data);
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
    const formSubmit = (row: StoreMemberAddressBo) => {
        if (isEmpty(row.id)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                storeMemberAddressDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                storeMemberAddressDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                storeMemberAddressDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
            }).catch(async err => {
                storeMemberAddressDialogRef.value.resetLoading();
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
    const handleSelectionChange = (val: StoreMemberAddressVo[]) => {
        state.tableData.param.selectIds = val.map((item: any) => item.id).join(",");
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
