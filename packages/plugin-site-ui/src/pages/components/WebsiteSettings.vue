<template>
  <el-form v-loading="loading" :model="configRuleForm" size="default" label-width="100px">
    <el-row class="website-settings-form">
      <el-col class="mt-15" :span="24">
        <el-form-item label="网站标题" prop="websiteTitle">
          <el-input v-model="configRuleForm[0].configValue" placeholder="网站标题"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-15" :span="24">
        <el-form-item label="网站副标题" prop="websiteSubheading">
          <el-input v-model="configRuleForm[1].configValue" placeholder="网站副标题"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-15" :span="24">
        <el-form-item label="网站域名" prop="websiteUrl">
          <el-input v-model="configRuleForm[2].configValue" placeholder="网站域名"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-15" :span="24">
        <el-form-item label="网站关键词" prop="websiteKeywords">
          <el-input type="textarea" v-model="configRuleForm[3].configValue"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-15" :span="24">
        <el-form-item label="网站描述" prop="websiteDescription">
          <el-input type="textarea" v-model="configRuleForm[4].configValue"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-15" :span="24">
        <el-form-item label="网站LOGO" prop="websiteLogo">
          <fast-img
            v-model="configRuleForm[5].configValue"
            :fileUrl="configRuleForm[5].configValue"
            @update:fileUrl="onUrlMainImage"
          />
        </el-form-item>
      </el-col>
      <el-col class="mt-15" :span="24">
        <el-form-item label="网站版权" prop="websiteCopyright">
          <el-input type="textarea" v-model="configRuleForm[6].configValue"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="mt-15" :span="24">
        <el-form-item label="备案号" prop="websiteRecord">
          <el-input v-model="configRuleForm[7].configValue"></el-input>
        </el-form-item>
      </el-col>

      <el-col class="mt-15" :span="24">
        <el-form-item>
          <el-button type="primary" :loading="saving" :disabled="loading || !loaded" @click="onSubmitConfig">保存</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { websiteSettingsApi } from '../../api/websiteSettings';
  const baseApi = websiteSettingsApi();

  import FastImg from './WebsiteLogoUpload.vue';

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
  const loading = ref(false);
  const saving = ref(false);
  const loaded = ref(false);
  const onSubmitConfig = async () => {
    if (saving.value || !loaded.value) return;
    saving.value = true;
    try {
      const res = await baseApi.configs(configRuleForm);
      if (res.code === 200) ElMessage.success('保存成功！');
    } catch {
      ElMessage.error('保存失败，请检查权限或稍后重试');
    } finally {
      saving.value = false;
    }
  };

  const initData = async () => {
    loading.value = true;
    try {
      const res = await baseApi.getConfigs(configRuleForm);
      if (res.code !== 200 || !Array.isArray(res.data)) return;
      for (const item of configRuleForm) {
        item.configValue = res.data.find((value: { configKey: string }) => value.configKey === item.configKey)?.configValue ?? '';
      }
      loaded.value = true;
    } catch {
      ElMessage.error('网站配置加载失败，请刷新后重试');
    } finally {
      loading.value = false;
    }
  };
  onMounted(initData);

</script>

<style scoped lang="scss">
  .website-settings-form { width: min(100%, 640px); }
  @media (max-width: 600px) {
    :deep(.el-form-item) { flex-direction: column; }
    :deep(.el-form-item__label) { width: auto !important; justify-content: flex-start; }
    :deep(.el-form-item__content) { margin-left: 0 !important; width: 100%; }
  }
</style>
