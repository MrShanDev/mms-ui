<template>
    <div class="ad-storeAdvertising-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
                <el-row>
                    <el-col v-show="false" class="mt-15" :span="24">
                        <el-form-item v-show="false" label="ID" prop="id">
                            <el-input v-model="state.ruleForm.id" placeholder="ID"></el-input>
                        </el-form-item>
                    </el-col>
                <el-col class="mt-15" :span="24">
                    <el-form-item label="广告位" prop="advertisingId">
                        <el-select v-model="state.ruleForm.advertisingId" placeholder="请选择广告位">
                            <el-option
                                v-for="item in state.locationList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="时间范围" prop="timeRange">
                            <el-date-picker
                                v-model="timeRange"
                                type="datetimerange"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                range-separator="到"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                @change="handleTimeRangeChange">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="路由地址" prop="routeUrl">
                            <el-input type="textarea" v-model="state.ruleForm.routeUrl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="路由参数" prop="routeParameter">
                            <el-input type="textarea" v-model="state.ruleForm.routeParameter"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="图片地址" prop="imageUrl">
                            <fast-img v-model="state.ruleForm.imageUrl" :fileUrl="state.ruleForm.imageUrl" />
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="扩展参数一" prop="extendedParameterOne">
                            <el-input type="textarea" v-model="state.ruleForm.extendedParameterOne"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="扩展参数二" prop="extendedParameterTwo">
                            <el-input type="textarea" v-model="state.ruleForm.extendedParameterTwo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="扩展参数三" prop="extendedParameterThree">
                            <el-input type="textarea" v-model="state.ruleForm.extendedParameterThree"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="扩展参数四" prop="extendedParameterFour">
                            <el-input type="textarea" v-model="state.ruleForm.extendedParameterFour"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="扩展参数五" prop="extendedParameterFive">
                            <el-input type="textarea" v-model="state.ruleForm.extendedParameterFive"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="状态" prop="status">
                            <fast-switch v-model="state.ruleForm.status" dict-type="SYS_STATE" placeholder="字典状态"></fast-switch>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-15" :span="24">
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="state.ruleForm.sort" :min="1" label="排序"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="closeDialog" size="default">取 消</el-button>
                <el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
//ModuleName 广告
<script setup lang="ts" name="adStoreAdvertisingDialog">
import {nextTick, reactive, ref, onMounted} from "vue";
import {CURDEnum} from '/@/enums/CURDEnum';
import {ElMessage} from "element-plus";
import {StoreAdvertisingBo, StoreAdvertisingVo} from '/@/views/ad/storeAdvertising/type';
import {storeAdvertisingLocationApi} from '/@/views/ad/storeAdvertisingLocation';
import {StoreAdvertisingLocationVo} from '/@/views/ad/storeAdvertisingLocation/type';

const dialogWidth = ref('50vw');
import FastImg from "/@/components/fast-upload/img.vue"
import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";

const storeAdvertisingLocationApi_instance = storeAdvertisingLocationApi();

// 广告位回戱选择动态变量
const timeRange = ref<[string, string] | null>(null);

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const dialogFormRef = ref();
const state = reactive({
    ruleForm: {} as StoreAdvertisingBo ,
    threeData: [] as StoreAdvertisingVo[] ,
    locationList: [] as StoreAdvertisingLocationVo[],
    dialog: {
        loading: false,
        isShowDialog: false,
        type: "",
        title: "",
        submitTxt: "",
    },
});

// 计算1年后的日期
const getOneYearLater = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
};

// 重置
const resetForm = () => {
    state.dialog.loading = false;
    const now = new Date();
    const oneYearLater = getOneYearLater();
    state.ruleForm = {
        id: '',
        advertisingId: '',
        startTime: formatDateTime(now),
        endTime: formatDateTime(oneYearLater),
        routeUrl: '',
        routeParameter: '',
        imageUrl: '',
        extendedParameterOne: '',
        extendedParameterTwo: '',
        extendedParameterThree: '',
        extendedParameterFour: '',
        extendedParameterFive: '',
        status: 1,
        pushIndex: 0,
        sort: 1,
        remark: ''
    }as StoreAdvertisingBo;
}

// 格式化日期时间
const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 不加载广告位列表
const loadAdvertisingLocations = async () => {
    try {
        const response = await storeAdvertisingLocationApi_instance.list({});
        state.locationList = response.rows || [];
    } catch (error) {
        console.error('加载广告位列表失败:', error);
    }
};

// 时间范围变化处理
const handleTimeRangeChange = () => {
    if (timeRange.value && timeRange.value.length === 2) {
        state.ruleForm.startTime = timeRange.value[0];
        state.ruleForm.endTime = timeRange.value[1];
    }
};

// 打开弹窗
const openDialog = (type: string, row: StoreAdvertisingVo) => {
    resetForm();
    if (type === CURDEnum.EDIT) {
        state.ruleForm = Object.assign({}, row);
        timeRange.value = [row.startTime, row.endTime] as [string, string];
        state.dialog.title = '修改';
        state.dialog.submitTxt = '修 改';
        state.dialog.type = CURDEnum.EDIT;
    }
    if (type === CURDEnum.INSERT) {
        const now = new Date();
        const oneYearLater = getOneYearLater();
        timeRange.value = [formatDateTime(now), formatDateTime(oneYearLater)] as [string, string];
        state.dialog.title = '新增';
        state.dialog.submitTxt = '新 增';
        state.dialog.type = CURDEnum.INSERT;
        // 清空表单，此项需加表单验证才能使用
        nextTick(() => {
            dialogFormRef.value.clearValidate();
        });
    }
    loadAdvertisingLocations();
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
// 暴露变量
defineExpose({
    openDialog, closeDialog, resetLoading
});
</script>
