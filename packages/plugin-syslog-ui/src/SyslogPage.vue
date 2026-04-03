<template>
  <div class="mms-syslog-fed">
    <el-card shadow="never">
      <template #header>
        <span>运行时日志（插件）</span>
        <el-button type="primary" size="small" class="mms-syslog-fed__refresh" :loading="loading" @click="refreshFiles">
          刷新文件列表
        </el-button>
      </template>
      <el-form :inline="true" class="mms-syslog-fed__form">
        <el-form-item label="日志文件">
          <el-select v-model="selectedFile" placeholder="选择 logs 目录下 .log" filterable style="width: 280px">
            <el-option v-for="f in files" :key="f" :label="f" :value="f" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="!selectedFile" @click="loadTail">读取尾部</el-button>
        </el-form-item>
        <el-form-item label="实时缓冲">
          <el-switch v-model="liveOn" @change="toggleLive" />
        </el-form-item>
      </el-form>
      <p v-if="logsDir" class="mms-syslog-fed__meta text-gray">目录：<code>{{ logsDir }}</code></p>
      <el-input v-model="tailText" type="textarea" :rows="18" readonly placeholder="先选择文件并读取尾部，或开启实时缓冲" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import {
  ElButton,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
  ElSwitch,
} from 'element-plus';
import request from '/@/utils/request';

const PLUGIN_ID = 'com.sxpcwlkj.plugin.syslog';
const API = `/plugin/${PLUGIN_ID}/syslog`;

const loading = ref(false);
const files = ref<string[]>([]);
const logsDir = ref('');
const selectedFile = ref<string>('');
const tailText = ref('');
const liveOn = ref(false);
const sinceSeq = ref(0);
let pollTimer: ReturnType<typeof setInterval> | null = null;

async function refreshFiles() {
  loading.value = true;
  try {
    const res: any = await request({ url: `${API}/files`, method: 'get' });
    const data = res?.data != null && res?.files === undefined ? res.data : res;
    logsDir.value = data?.logsDir ?? '';
    files.value = Array.isArray(data?.files) ? data.files : [];
    if (files.value.length && !selectedFile.value) {
      selectedFile.value = files.value[0] ?? '';
    }
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false;
  }
}

async function loadTail() {
  if (!selectedFile.value) return;
  try {
    const res: any = await request({
      url: `${API}/tail`,
      method: 'get',
      params: { file: selectedFile.value, maxBytes: 131072 },
    });
    const data = res?.data != null && res?.text === undefined ? res.data : res;
    tailText.value = data?.text ?? '';
  } catch {
    /* */
  }
}

async function pollLive() {
  try {
    const res: any = await request({
      url: `${API}/live/poll`,
      method: 'get',
      params: { sinceSeq: sinceSeq.value },
    });
    const data = res?.data != null && res?.lines === undefined ? res.data : res;
    const lines: string[] = data?.lines ?? [];
    const next = data?.nextSeq ?? sinceSeq.value;
    sinceSeq.value = typeof next === 'number' ? next : sinceSeq.value;
    if (lines.length) {
      const chunk = lines.join('\n') + '\n';
      tailText.value = (tailText.value ? tailText.value + '\n' : '') + chunk;
    }
  } catch {
    /* */
  }
}

function toggleLive(on: boolean) {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (on) {
    sinceSeq.value = 0;
    tailText.value = '';
    pollLive();
    pollTimer = setInterval(pollLive, 2000);
    ElMessage.info('已开启轮询（需 plugin:syslog:live 权限）');
  }
}

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer);
  }
});

refreshFiles();
</script>

<style scoped>
.mms-syslog-fed__refresh {
  float: right;
}
.mms-syslog-fed__form {
  margin-bottom: 8px;
}
.mms-syslog-fed__meta {
  font-size: 12px;
  margin: 0 0 8px;
}
.text-gray {
  color: var(--el-text-color-secondary);
}
</style>
