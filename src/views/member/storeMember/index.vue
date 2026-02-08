<template>
    <div class="block">
                <!-- 功能栏  -->
        <div class="views-tool">
            <div class="tool-left">
                <el-form :inline="true" size="default" :model="state.tableData.param" class="form-tool" @keyup.enter="getTableData">
                        <el-form-item>
                            <el-input v-model="state.tableData.param.phone" size="default" placeholder="手机号" style="max-width: 180px" clearable ></el-input>
                        </el-form-item>
                    <el-form-item>
                        <el-button size="default" type="primary" @click="getTableData" v-auth="'member:storeMember:list'">
                            <SvgIcon name="iconfont icon-search1" />{{ $t("message.form.search") }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- Table  -->
        <div class="member-storeMember-container layout-padding   p-t-0">
            <el-card shadow="hover" class="layout-padding-auto">
                <el-container>
                    <el-main>
                        <!-- Table -->
                        <el-table :data="state.tableData.data"
                                  v-loading="state.tableData.loading"
                                  style="width: 100%"
                                  @selection-change="handleSelectionChange"
                        >
                            <el-table-column  type="selection" header-align="center" align="center" width="50"></el-table-column>
                            <el-table-column v-if="false" prop="id" label="ID" header-align="center" align="center"></el-table-column>
                            <el-table-column prop="nickname" label="昵称" header-align="center" align="center">
                                <template #default="scope">
                                    {{ scope.row.nickname==null||scope.row.nickname==''?'未设置':scope.row.nickname }}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop="account" label="账号" header-align="center" align="center"></el-table-column> -->
                            <fast-table-column prop="sex" label="性别" dict-type="SYS_SEX"></fast-table-column>
                            <el-table-column prop="phone" label="手机号" header-align="center" align="center">
                                <template #default="scope">
                                    {{ scope.row.phone==null||scope.row.phone==''?'未设置':scope.row.phone }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="headPortrait" label="头像" header-align="center" align="center" show-overflow-tooltip>
                                    <template #default="scope">
                                        <el-image
                                            style="height: 50px"
                                            :src="scope.row.headPortrait"
                                            :zoom-rate="1.2"
                                            :max-scale="7"
                                            :min-scale="0.2"
                                            :preview-src-list="[scope.row.headPortrait]"
                                            :initial-index="1"
                                            preview-teleported
                                            fit="cover"
                                        />
                                    </template>
                                </el-table-column>
                            <fast-table-column prop="reputationScore" label="会员等级" dict-type="MEMBER_LEVEL"></fast-table-column>
                            <fast-table-column prop="status" label="状态" dict-type="SYS_STATE"></fast-table-column>
                            <el-table-column prop="nickname" label="收货地址" header-align="center" align="center">
                                <template #default="scope">
                                    <el-link type="primary" @click="lookAddress(scope.row.id)" >查看</el-link>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width=" 100 ">
                                <template #default="scope">
                                    <el-tooltip placement="top" :content="$t('message.form.edit')">
                                        <el-icon class="mr10" color="blue" v-auths="['member:storeMember:query', 'member:storeMember:edit']" @click="onCURD({ type: curdEnum.EDIT, ids: scope.row.id })">
                                            <ele-Edit />
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
            <StoreMemberDialog ref="storeMemberDialogRef" @refresh="formSubmit"/>
            <el-dialog title="收货地址" v-model="state.dialogVisible" width="70%">
                <el-table :data="state.addressData" v-loading="state.addressLoading">
                    <el-table-column prop="name" label="收货人" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="phone" label="收货手机号" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="country" label="国家" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="province" label="省" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="city" label="市" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="district" label="区/县" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="address" label="详细地址" header-align="center" align="center"></el-table-column>
                    <fast-table-column prop="tolerant" label="是否默认" dict-type="SYS_IS"></fast-table-column>
                    <fast-table-column prop="status" label="状态" dict-type="SYS_STATE"></fast-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>
//ModuleName 会员列表
<script setup lang="ts" name="memberStoreMember">
import {defineAsyncComponent, onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {CURDEnum} from "/@/enums/CURDEnum";
import {generateUUID, isEmpty} from "/@/utils/mms";
import {NextLoading} from "/@/utils/loading";

import {StoreMemberBo, StoreMemberVo} from '/@/views/member/storeMember/type';
import {storeMemberApi} from '/@/views/member/storeMember';
import FastTableColumn from "/@/components/fast-table-column/src/fast-table-column.vue";

    const baseApi = storeMemberApi();

    import {StoreMemberAddressBo, StoreMemberAddressVo} from '/@/views/member/storeMemberAddress/type';
    import {storeMemberAddressApi} from '/@/views/member/storeMemberAddress';

    const storeMemberAddressBaseApi = storeMemberAddressApi();

    const storeMemberDialogRef = ref();
    const StoreMemberDialog = defineAsyncComponent(() => import('/@/views/member/storeMember/dialog.vue'));
    const TableTool = defineAsyncComponent(() => import("/@/components/table-tool/index.vue"));

    const curdEnum = CURDEnum;
    const tableToolRef = ref();
    const componentKey = ref(generateUUID());
    const state = reactive({
        tableData:{
            data: [] as StoreMemberVo[],
            total: 0,
            loading: false,
            param: {
                selectIds: "",
                pageNum: 1,
                pageSize: 10,
                account: '',
                phone: ''
            }
        },
        dialogVisible: false,
        addressData: [] as StoreMemberAddressVo[],
        addressLoading: false
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
            storeMemberDialogRef.value.openDialog(obj.type);
            return false;
        }
        // 编辑操作
        if (obj.type === CURDEnum.EDIT) {
            baseApi.query(obj.ids).then((res) => {
              storeMemberDialogRef.value.openDialog(obj.type, res.data);
           }).catch(async (err) => {
              ElMessage.warning(err);
           }).finally(() => {
                setTimeout(() => {
                    getTableData();
                }, 1000);
            });
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
    const formSubmit = (row: StoreMemberBo) => {
        if (isEmpty(row.id)) {
            //新增
            NextLoading.open();
            baseApi.insert(row).then(row => {
                storeMemberDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                storeMemberDialogRef.value.resetLoading();
                ElMessage.warning(err);
            }).finally(() => {
                NextLoading.close();
            })
        } else {
            //更新
            NextLoading.open();
            baseApi.edit(row).then(row => {
                storeMemberDialogRef.value.closeDialog();
                ElMessage.success(row.msg)
                setTimeout(() => {
                    getTableData();
                }, 1000)
            }).catch(async err => {
                storeMemberDialogRef.value.resetLoading();
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
    const handleSelectionChange = (val: StoreMemberVo[]) => {
        state.tableData.param.selectIds = val.map((item: any) => item.id).join(",");
    };
    //查看地址
    const lookAddress = (id: string) => {
        storeMemberAddressBaseApi.list({
            memberId: id,
            pageNum: 1,
            pageSize: 100
        }).then(res => {
            state.dialogVisible = true;
            state.addressData = res.rows;
        }).catch(async err => {
            ElMessage.warning(err);
        }).finally(() => {
            state.addressLoading = false;
        })
    }
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
