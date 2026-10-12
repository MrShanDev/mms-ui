<template><section class="extension-page"><header><h2>Redis 预览</h2><div class="actions"><el-button @click="loadMeta">刷新状态</el-button><el-button type="primary" :loading="busy" @click="ping">连接测试</el-button></div></header>
<el-alert v-if="!meta.configured" title="请在插件市场的插件参数中配置 Redis 连接，再刷新状态。" type="info" :closable="false"/>
<el-card><el-descriptions :column="3"><el-descriptions-item label="连接">{{meta.host||'未配置'}}:{{meta.port||'-'}}</el-descriptions-item><el-descriptions-item label="数据库">{{meta.database??'-'}}</el-descriptions-item><el-descriptions-item label="状态">{{status}}</el-descriptions-item></el-descriptions></el-card>
<el-card><div class="fields"><el-input v-model="prefix" placeholder="键前缀或匹配模式"/><el-button type="primary" :loading="busy" :disabled="!meta.configured" @click="scan(true)">搜索</el-button><el-button :loading="busy" :disabled="done||!meta.configured" @click="scan(false)">继续扫描</el-button><span>已获取 {{keys.length}} 个键 · {{done?'扫描结束':'尚有后续游标'}}</span></div>
<el-table :data="keys.map(key=>({key}))"><el-table-column prop="key" label="键名"/><el-table-column label="操作" width="100"><template #default="s"><el-button link type="primary" @click="detail(s.row.key)">预览</el-button></template></el-table-column></el-table></el-card>
<el-dialog v-model="showDetail" title="键详情" width="min(720px,94vw)"><pre>{{ JSON.stringify(selected,null,2) }}</pre></el-dialog></section></template>
<script setup lang="ts">
import {ref,onMounted} from 'vue';import {ElMessage} from 'element-plus';import {call} from './api';import './style.css';
const meta=ref<any>({}),status=ref('未测试'),busy=ref(false),prefix=ref(''),cursor=ref('0'),done=ref(true),keys=ref<string[]>([]),selected=ref<any>(),showDetail=ref(false);
async function run(fn:()=>Promise<void>){busy.value=true;try{await fn()}catch(e:any){ElMessage.error(e.message)}finally{busy.value=false}}
function loadMeta(){return run(async()=>{meta.value=await call('/ri/meta')})}
function ping(){return run(async()=>{const x=await call('/ri/ping');status.value=x.pong;ElMessage.success('Redis 连接正常')})}
function scan(reset:boolean){return run(async()=>{if(reset){keys.value=[];cursor.value='0'}const x=await call('/ri/scan?prefix='+encodeURIComponent(prefix.value)+'&cursor='+cursor.value+'&count=100');keys.value=[...new Set([...keys.value,...x.keys])];cursor.value=x.cursor;done.value=x.done})}
function detail(k:string){return run(async()=>{selected.value=await call('/ri/key?k='+encodeURIComponent(k));showDetail.value=true})}
onMounted(loadMeta);
</script>
