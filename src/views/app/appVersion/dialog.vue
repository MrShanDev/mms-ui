<template>
    <div class="app-appVersion-dialog-container">
        <el-dialog
            :title="state.dialog.title"
            v-model="state.dialog.isShowDialog"
            :width="dialogWidth" draggable>
            <el-form ref="dialogFormRef" :model="state.ruleForm" :rules="state.rules" size="default" label-width="150px">
                <el-row>
                    <el-col class="mt-25" :span="24">
                        <el-form-item label="平台类型" prop="platform">
                            <fast-select v-model="state.ruleForm.platform" dict-type="appType" placeholder="平台类型"></fast-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-25" :span="24">
                        <el-form-item label="用户版本号" prop="versionName">
                            <el-input v-model="state.ruleForm.versionName" placeholder="用户版本号（如：1.2.3，每个位置仅一位数字）" @input="handleVersionNameChange"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-25" :span="24">
                        <el-form-item label="内部版本号" prop="versionCode">
                            <el-input v-model="state.ruleForm.versionCode" placeholder="自动填充" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-25" :span="24">
                        <el-form-item label="下载地址">
                            <fast-file v-model="state.ruleForm.downloadUrl" :fileUrl="state.ruleForm.downloadUrl"  />
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-25" :span="24">
                        <el-form-item label="更新说明" prop="releaseNotes">
                            <div class="editor-container">
                                <fast-editor v-model:get-html="state.ruleForm.releaseNotes" v-bind:content="state.ruleForm.releaseNotes"/>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-25" :span="24">
                        <el-form-item label="是否强制更新" prop="isForceUpdate">
                            <fast-select v-model="state.ruleForm.isForceUpdate" dict-type="isForceUpdate" placeholder="是否强制更新（0-否，1-是）"></fast-select>
                        </el-form-item>
                    </el-col>

                    <el-col class="mt-25" :span="24">
                        <el-form-item label="发布状态" prop="publishStatus">
                            <fast-select v-model="state.ruleForm.publishStatus" dict-type="APPSATATE" placeholder="发布状态"></fast-select>
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
//ModuleName App版本发布表
<script setup lang="ts" name="appAppVersionDialog">
import {nextTick, reactive, ref} from "vue";
import {CURDEnum} from '/@/enums/CURDEnum';
import {ElMessage} from 'element-plus';
import {AppVersionBo, AppVersionVo} from '/@/views/app/appVersion/type';

const dialogWidth = ref('50vw');
import FastSelect from '/@/components/fast-select/src/fast-select.vue';
import FastFile from "/@/components/fast-upload/file.vue"
dialogWidth.value = '75vw';
import FastEditor from '/@/components/fast-editor/src/fast-editor.vue';
import FastSwitch from "/@/components/fast-switch/src/fast-switch.vue";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const dialogFormRef = ref();
const state = reactive({
    ruleForm: {} as AppVersionBo ,
    threeData: [] as AppVersionVo[] ,
    dialog: {
        loading: false,
        isShowDialog: false,
        type: "",
        title: "",
        submitTxt: "",
    },
    rules: {
        platform: [{ required: true, message: '请选择平台类型', trigger: 'change' }],
        versionName: [
            { required: true, message: '请输入用户版本号', trigger: 'blur' },
            {
                validator: (rule: any, value: any, callback: any) => {
                    const regex = /^\d(\.\d){0,2}$/;
                    if (!regex.test(value)) {
                        callback(new Error('格式错误！每个位置仅限1位数字，如: 1.2.3'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }
        ],
        versionCode: [{ required: true, message: '内部版本号不能为空', trigger: 'blur' }],
        downloadUrl: [{ required: true, message: '请上传安装包', trigger: 'change' }],
        isForceUpdate: [{ required: true, message: '请选择是否强制更新', trigger: 'change' }],
        publishStatus: [{ required: true, message: '请选择发布状态', trigger: 'change' }],
    }
});

// 重置
const resetForm = () => {
    state.dialog.loading = false;
    state.ruleForm = {
        id: '',
        appCode: 'mms',
        appName: '',
        platform: '',
        versionCode: '',
        versionName: '',
        buildNumber: '',
        downloadUrl: '',
        fileSize: '',
        fileMd5: '',
        releaseNotes: '',
        isForceUpdate: '',
        minRequiredVersion: '',
        publishType: '',
        publishStatus: '',
        publishTime: '',
        publishUser: '',
        status: '',
        sort: 1,
        remark: ''
    }as AppVersionBo;
}
// 打开弹窗
const openDialog = (type: string, row: AppVersionVo) => {
    resetForm();
    if (type === CURDEnum.EDIT) {
        state.ruleForm = Object.assign({}, row);
        state.dialog.title = '修改';
        state.dialog.submitTxt = '修 改';
        state.dialog.type = CURDEnum.EDIT;
    }
    if (type === CURDEnum.INSERT) {
        state.dialog.title = '新增';
        state.dialog.submitTxt = '新 增';
        state.dialog.type = CURDEnum.INSERT;
        // 清空校验痕迹，不再使用 resetFields 以免由于 initial value 机制导致回滚数据
        nextTick(() => {
            if (dialogFormRef.value) {
                dialogFormRef.value.clearValidate();
            }
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
    dialogFormRef.value.validate((valid: boolean) => {
        if (valid) {
            state.dialog.loading = true;
            emit('refresh', state.ruleForm);
        } else {
            ElMessage.error('表单校验未通过，请检查输入项');
            return false;
        }
    });
};
// 版本号格式验证
const validateVersionFormat = (version: string): boolean => {
    // 允许为空
    if (!version || version.trim() === '') {
        return true;
    }
    // 必须是 x.x.x 格式，每个位置只能是一位数字
    const versionRegex = /^\d\.\d\.\d$|^\d\.\d$|^\d$/;
    return versionRegex.test(version);
};

// 处理版本号输入变化
const handleVersionNameChange = (value: string) => {
    const input = value.trim();

    // 如果输入为空，清空内部版本号
    if (!input) {
        state.ruleForm.versionCode = '';
        return;
    }

    // 移除非法字符（只保留数字和点）
    let cleaned = input.replace(/[^\d.]/g, '');

    // 验证格式：只能是 x.x.x、x.x 或 x 这样的格式
    const parts = cleaned.split('.');

    // 检查每个部分是否都是单位数字
    const isValid = parts.every(part => part.length === 1 && /^\d$/.test(part));

    if (!isValid) {
        ElMessage.warning('版本号格式错误！每个位置只能是一位数字，如：1.2.3');
        // 恢复到上次有效的值
        return;
    }

    // 自动生成内部版本号（移除点号）
    state.ruleForm.versionCode = cleaned.replace(/\./g, '');
};

// 初始化菜单数据
const getMenuData = () => {
}
// 暴露变量
defineExpose({
    openDialog, closeDialog, resetLoading
});
</script>
