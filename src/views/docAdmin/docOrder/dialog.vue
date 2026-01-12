<template>
  <div class="docAdmin-docOrder-dialog-container">
    <el-dialog
      :title="state.dialog.title"
      v-model="state.dialog.isShowDialog"
      :width="dialogWidth"
      draggable
    >
      <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
        <el-row>
          <el-col v-show="false" class="mt-5" :span="24">
            <el-form-item v-show="false" label="订单编号" prop="orderId">
              <el-input v-model="state.ruleForm.orderId" placeholder="订单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="用户编号" prop="uid">
              <el-input v-model="state.ruleForm.uid" placeholder="用户编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="订单金额" prop="txnAmt">
              <el-input v-model="state.ruleForm.txnAmt" placeholder="订单金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="支付商户号" prop="payMchid">
              <el-input v-model="state.ruleForm.payMchid" placeholder="支付商户号"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="支付平台流水号" prop="payNo">
              <el-input v-model="state.ruleForm.payNo" placeholder="支付平台流水号"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="支付超时时间" prop="payTimeout">
              <el-input v-model="state.ruleForm.payTimeout" placeholder="支付超时时间"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="产品编号" prop="prodId">
              <el-input v-model="state.ruleForm.prodId" placeholder="产品编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="产品名称" prop="prodName">
              <el-input v-model="state.ruleForm.prodName" placeholder="产品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="产品价格" prop="prodPrice">
              <el-input v-model="state.ruleForm.prodPrice" placeholder="产品价格"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="产品类型" prop="prodType">
              <el-input v-model="state.ruleForm.prodType" placeholder="产品类型"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="创建时间" prop="ctime">
              <el-input v-model="state.ruleForm.ctime" placeholder="创建时间"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="更新时间" prop="mtime">
              <el-input v-model="state.ruleForm.mtime" placeholder="更新时间"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="订单状态" prop="status">
              <!--unpaid：待支付 paysuc：已支付 refund：已退款 cancel：已取消 finish：已完成-->
              <fast-switch
                v-model="state.ruleForm.status"
                dict-type="SYS_STATE"
                placeholder="状态"
              ></fast-switch>
            </el-form-item>
          </el-col>
          <el-col class="mt-5" :span="24">
            <el-form-item label="排序" prop="sort">
              <el-input-number
                v-model="state.ruleForm.sort"
                :min="1"
                label="排序"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">
            {{ state.dialog.submitTxt }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
//ModuleName 文档订单
<script setup lang="ts" name="docAdminDocOrderDialog">
  import { reactive, ref, nextTick } from 'vue';
  import { CURDEnum } from '/@/enums/CURDEnum';
  import { DocOrderBo, DocOrderVo } from '/@/views/docAdmin/docOrder/type';
  const dialogWidth = ref('50vw');
  import FastSwitch from '/@/components/fast-switch/src/fast-switch.vue';
  // 定义子组件向父组件传值/事件
  const emit = defineEmits(['refresh']);
  const dialogFormRef = ref();
  const state = reactive({
    ruleForm: {} as DocOrderBo,
    threeData: [] as DocOrderVo[],
    dialog: {
      loading: false,
      isShowDialog: false,
      type: '',
      title: '',
      submitTxt: '',
    },
  });

  // 重置
  const resetForm = () => {
    state.dialog.loading = false;
    state.ruleForm = {
      orderId: '',
      uid: '',
      txnAmt: '',
      payMchid: '',
      payNo: '',
      payTimeout: '',
      prodId: '',
      prodName: '',
      prodPrice: '',
      prodType: '',
      ctime: '',
      mtime: '',
      status: 0,
      sort: 1,
      remark: '',
    } as DocOrderBo;
  };
  // 打开弹窗
  const openDialog = (type: string, row: DocOrderVo) => {
    resetForm();
    if (type === CURDEnum.EDIT) {
      state.ruleForm = row;
      state.dialog.title = '修改';
      state.dialog.submitTxt = '修 改';
      state.dialog.type = CURDEnum.EDIT;
    }
    if (type === CURDEnum.INSERT) {
      state.dialog.title = '新增';
      state.dialog.submitTxt = '新 增';
      state.dialog.type = CURDEnum.INSERT;
      // 清空表单，此项需加表单验证才能使用
      nextTick(() => {
        dialogFormRef.value.resetFields();
      });
    }
    getMenuData();
    state.dialog.isShowDialog = true;
  };
  // 关闭弹窗
  const closeDialog = () => {
    state.dialog.loading = false;
    state.dialog.isShowDialog = false;
  };
  // 重置Loading
  const resetLoading = () => {
    state.dialog.loading = false;
  };
  // 提交
  const onSubmit = () => {
    state.dialog.loading = true;
    emit('refresh', state.ruleForm);
  };
  // 初始化菜单数据
  const getMenuData = () => {};
  // 暴露变量
  defineExpose({
    openDialog,
    closeDialog,
    resetLoading,
  });
</script>
