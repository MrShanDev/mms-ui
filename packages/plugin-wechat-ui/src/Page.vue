<template><section class="extension-page"><header><h2>企业微信机器人</h2><el-button :loading="busy" @click="refresh">刷新状态</el-button></header><el-card><el-descriptions :column="3"><el-descriptions-item label="配置">{{meta.configured?'已配置':'未配置'}}</el-descriptions-item><el-descriptions-item label="机器人数量">{{meta.webhookCount||0}}</el-descriptions-item><el-descriptions-item label="生命周期通知">{{meta.lifecycleNotifyEnabled?'开启':'关闭'}}</el-descriptions-item></el-descriptions><p>在插件市场「插件参数」设置 Webhook 地址与通知开关，保存后刷新即可生效。</p></el-card>
<el-card><template #header>消息发送</template><el-radio-group v-model="type"><el-radio-button value="text">文本</el-radio-button><el-radio-button value="markdown">Markdown</el-radio-button></el-radio-group><el-input v-model="content" type="textarea" :rows="8" placeholder="输入消息内容" style="margin:16px 0"/><el-button type="primary" :disabled="!meta.configured||!content.trim()" :loading="busy" @click="send">发送到已配置的群</el-button><pre v-if="result">{{JSON.stringify(result,null,2)}}</pre><p>发送结果以企业微信返回的 errcode 为准；0 表示成功。</p></el-card></section></template>
<script setup lang="ts">
import {ref,onMounted} from 'vue';import {ElMessage,ElMessageBox} from 'element-plus';import {call} from './api';import './style.css';
const meta=ref<any>({}),busy=ref(false),type=ref('text'),content=ref(''),result=ref<any>();
async function run(fn:()=>Promise<void>){busy.value=true;try{await fn()}catch(e:any){if(e!=='cancel'&&e!=='close')ElMessage.error(e.message)}finally{busy.value=false}}
function refresh(){return run(async()=>{meta.value=await call('/bot/status')})}
function send(){return run(async()=>{await ElMessageBox.confirm('将向全部已配置企业微信群发送这条消息，是否发送？','发送确认');result.value=await call('/bot/send',{type:type.value,content:content.value})})}
onMounted(refresh);
</script>
