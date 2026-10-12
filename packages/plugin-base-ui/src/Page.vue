<template>
<section class="extension-page">
<header><h2>基础工具</h2><span>地区数据 · 业务编号 · 格式校验</span></header>
<el-tabs v-model="tab">
<el-tab-pane label="行政地区" name="area"><el-card><p>选择省、市、区县。地区数据为离线快照，请按业务需要更新行政区划。</p><div class="fields"><el-select v-model="province" placeholder="选择省份" @change="loadCities"><el-option v-for="x in provinces" :key="x.code" :label="x.name" :value="x.code"/></el-select><el-select v-model="city" placeholder="选择城市" @change="loadDistricts"><el-option v-for="x in cities" :key="x.code" :label="x.name" :value="x.code"/></el-select><el-select v-model="district" placeholder="选择区县"><el-option v-for="x in districts" :key="x.code" :label="x.name" :value="x.code"/></el-select></div></el-card></el-tab-pane>
<el-tab-pane label="业务编号" name="number"><el-card><div class="fields"><el-input v-model="prefix" placeholder="编号前缀，例如 ORD" maxlength="12"/><el-button type="primary" :loading="busy" @click="generate">生成编号</el-button></div><p>前缀 + UUID，全局随机唯一标识；保存业务时仍应设置数据库唯一约束。</p><pre v-if="number">{{ number }}</pre></el-card></el-tab-pane>
<el-tab-pane label="校验与脱敏" name="validate"><el-card><div class="fields"><el-select v-model="kind"><el-option label="手机号" value="phone"/><el-option label="邮箱" value="email"/></el-select><el-input v-model="value" placeholder="输入待校验内容" maxlength="254"/><el-button type="primary" :loading="busy" @click="validate">校验</el-button></div><pre v-if="result">{{ JSON.stringify(result,null,2) }}</pre></el-card></el-tab-pane>
</el-tabs></section>
</template>
<script setup lang="ts">
import {ref,onMounted} from 'vue';import {ElMessage} from 'element-plus';import {call} from './api';import './style.css';
const tab=ref('area'),province=ref(''),city=ref(''),district=ref(''),provinces=ref<any[]>([]),cities=ref<any[]>([]),districts=ref<any[]>([]),prefix=ref('ORD'),number=ref(''),kind=ref('phone'),value=ref(''),result=ref<any>(),busy=ref(false);
async function safe(fn:()=>Promise<void>){busy.value=true;try{await fn()}catch(e:any){ElMessage.error(e.message)}finally{busy.value=false}}
async function loadCities(){city.value='';district.value='';districts.value=[];await safe(async()=>{cities.value=await call('/base/v1/areas?parentCode='+province.value)})}
async function loadDistricts(){district.value='';await safe(async()=>{districts.value=await call('/base/v1/areas?parentCode='+city.value)})}
function generate(){return safe(async()=>{number.value=(await call('/base/v1/number',{prefix:prefix.value})).number})}
function validate(){return safe(async()=>{result.value=await call('/base/v1/validate',{type:kind.value,value:value.value})})}
onMounted(()=>safe(async()=>{provinces.value=await call('/base/v1/areas?parentCode=86')}));
</script>
