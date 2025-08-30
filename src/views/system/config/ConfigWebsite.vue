<template>
  <el-form ref="dialogFormRef" :model="configRuleForm" size="default" label-width="100px">
    <el-row style="width: 60%">
      <el-col class="mt-5" :span="24">
        <el-form-item label="网站标题" prop="websiteTitle">
          <el-input v-model="configRuleForm[0].configValue" placeholder="网站标题"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-5" :span="24">
        <el-form-item label="网站副标题" prop="websiteSubheading">
          <el-input v-model="configRuleForm[1].configValue" placeholder="网站副标题"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-5" :span="24">
        <el-form-item label="网站域名" prop="websiteUrl">
          <el-input v-model="configRuleForm[2].configValue" placeholder="网站域名"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-5" :span="24">
        <el-form-item label="网站关键词" prop="websiteKeywords">
          <el-input type="textarea" v-model="configRuleForm[3].configValue"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-5" :span="24">
        <el-form-item label="网站描述" prop="websiteDescription">
          <el-input type="textarea" v-model="configRuleForm[4].configValue"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-5" :span="24">
        <el-form-item label="网站LOGO" prop="websiteLogo">
          <fast-img
            v-model="configRuleForm[5].configValue"
            :fileUrl="configRuleForm[5].configValue"
            @update:fileUrl="onUrlMainImage"
          />
        </el-form-item>
      </el-col>
      <el-col class="mt-5" :span="24">
        <el-form-item label="网站版权" prop="websiteCopyright">
          <el-input type="textarea" v-model="configRuleForm[6].configValue"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-5" :span="24">
        <el-form-item label="备案号" prop="websiteRecord">
          <el-input v-model="configRuleForm[7].configValue"></el-input>
        </el-form-item>
      </el-col>

      <el-col class="mt-5" :span="24">
        <el-form-item>
          <el-button type="primary" @click="onSubmitConfig">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
  import { onMounted, reactive } from 'vue';
  import { ElMessage } from 'element-plus';
  import { sysConfigApi } from '/@/views/system/config';
  const baseApi = sysConfigApi();

  import FastImg from '/@/components/fast-upload/img.vue';

  const configRuleForm = reactive([
    {
      index: 0,
      configName: '网站标题',
      configKey: 'website_title',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
    {
      index: 1,
      configName: '网站副标题',
      configKey: 'website_subtitle',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
    {
      index: 2,
      configName: '网站域名',
      configKey: 'website_domain',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
    {
      index: 3,
      configName: '网站关键词',
      configKey: 'website_keywords',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
    {
      index: 4,
      configName: '网站描述',
      configKey: 'website_description',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
    {
      index: 5,
      configName: '网站LOGO',
      configKey: 'website_logo',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
    {
      index: 6,
      configName: '网站版权',
      configKey: 'website_copyright',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
    {
      index: 7,
      configName: '备案号',
      configKey: 'website_record',
      configType: '1',
      valueType: 'String',
      configValue: '',
    },
  ]);
  const onUrlMainImage = (data: string) => {
    configRuleForm[5].configValue = data;
  };
  const onSubmitConfig = () => {
    baseApi.configs(configRuleForm).then((res) => {
      if (res.code === 200) {
        ElMessage.success('保存成功！');
      }
    });
  };

  const initData = () => {
    baseApi.getConfigs(configRuleForm).then((res) => {
      configRuleForm[0].configValue = res.data[0].configValue;
      configRuleForm[1].configValue = res.data[1].configValue;
      configRuleForm[2].configValue = res.data[2].configValue;
      configRuleForm[3].configValue = res.data[3].configValue;
      configRuleForm[4].configValue = res.data[4].configValue;
      configRuleForm[5].configValue = res.data[5].configValue;
      configRuleForm[6].configValue = res.data[6].configValue;
      configRuleForm[7].configValue = res.data[7].configValue;
    });
  };
  onMounted(() => {
    initData();
  });
  // 暴露变量
  defineExpose({
    initData,
  });
</script>
