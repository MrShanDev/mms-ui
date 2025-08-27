<template>
    <div class="block">
        <div class="docAdmin-docProduct-container layout-padding  mt-5  p-t-15">
            <el-row :gutter="15">
                <el-col v-for="(v, k) in state.tableData.data" :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                    <Animate>
                        <el-card class="text-center mb-5" style="height: 500px;border-radius: 20px;" :style="{'backgroundColor': k==0?'#bacac6':k==1?'#ffa631':k==2?'#ed5736':'#a4e2c6'}">
                                <el-container>
                                <el-header class="p-t-20 f-w-700" style="height: 150px;color: #fff; font-size: 2.5rem;">{{ v.prodName }}</el-header>
                                <el-main style="padding: 20px 0">
                                    <p class="f-30" style="color: #fff">{{ v.unitPrice/100 }}元</p>
                                    <p class="m-t-20" >{{ v.type }}</p>
                                </el-main>
                                <el-footer>
                                    <el-button style="text-align: center;text-indent: 16px;font-size: 16px;letter-spacing: 12px;height: 40px;width: 80%;color: #ff2626;background-color: #ffffff;border-color: #ffffff;" size="small" @click="onCURD({ type: curdEnum.EDIT, ids: v.prodId })">修改</el-button>
                                </el-footer>
                            </el-container>   
                        </el-card>
                    </Animate>
                </el-col>

                <!-- 添加卡项 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
                    <Animate>
                        <el-card @click="onCURD({ type: curdEnum.INSERT })" class="text-center mb-5" style="height: 500px; line-height: 500px;">
                            <div class="icon ">
                                <el-icon style="font-size: 4rem;" color="#c9c9c9"><ele-CirclePlusFilled /></el-icon>
                            </div>
                        </el-card>
                    </Animate>
                </el-col>
            </el-row>  
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
    import {docProductApi} from '/@/views/docAdmin/docProduct';
    import {DocProductBo,DocProductVo } from '/@/views/docAdmin/docProduct/type';
    const baseApi = docProductApi();
    const docProductDialogRef = ref();
    const DocProductDialog = defineAsyncComponent(() => import('/@/views/docAdmin/docProduct/dialog.vue'));
    const curdEnum = CURDEnum;
    // 引入组件
    const Animate = defineAsyncComponent(
        () => import("/@/components/animate/index.vue")
    );
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
    const onCURD = (obj: { type: CURDEnum; ids?: number }) => {
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
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>

<style scoped lang="scss">

</style>
