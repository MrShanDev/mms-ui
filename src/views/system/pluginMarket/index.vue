<template>
  <div class="plugin-market layout-padding layout-padding-auto">
    <div class="plugin-market__hero">
      <div>
        <h2 class="plugin-market__title">插件市场</h2>
        <p class="plugin-market__subtitle">
          <strong>安装</strong>：校验 JAR 内 <code>plugin.json</code> 与宿主版本；通过后写入磁盘并登记版本、激活，再全量重载。
          <strong>卸载</strong>：只删除<strong>磁盘</strong>上的插件安装目录（所有版本）并重载；<em>不会</em>移除库表里的市场/版本登记，也<em>不等于</em>从市场里「删除插件」那条目。卸载后可随时用本卡「安装」或页顶上传<strong>重新安装</strong>。
          <strong>删除</strong>：只移除<strong>库表</strong>中的市场展示与版本登记（<code>sys_plugins</code> / <code>sys_plugin_version</code>）并重载；<em>不删磁盘</em>。要从登记里去掉插件、仍保留盘上文件时用它；盘上也要清掉时请先<strong>卸载</strong>再<strong>删除</strong>（或按需只做其中一步）。
          卡片上点<strong>详情</strong>查看完整信息与回切版本。已<strong>运行中</strong>的插件不展示「安装」「删除」，升级可页顶上传或先卸载再装。
        </p>
        <p v-if="statusBody" class="plugin-market__meta text-gray">
          宿主启用：<b :class="statusBody.enabled ? 'text-success' : 'text-warning'">{{
            statusBody.enabled ? '是' : '否'
          }}</b>
          · MMS 版本：<b>{{ statusBody.hostMmsRevision ?? '—' }}</b>
          · 配置目录：{{ statusBody.rootDir || '默认 user.dir/mms-plugins' }}
          <template v-if="statusBody.resolvedPluginsRoot">
            · 解析路径：<code class="plugin-market__code">{{ statusBody.resolvedPluginsRoot }}</code>
          </template>
        </p>
      </div>
      <div class="plugin-market__actions">
        <el-button type="primary" :loading="loading" @click="loadAll">刷新</el-button>
        <el-button type="warning" :loading="reloading" @click="onReloadAll">全量重载</el-button>
        <el-upload :show-file-list="false" accept=".jar" :http-request="onUpload">
          <el-button type="success">上传插件包（安装）</el-button>
        </el-upload>
      </div>
    </div>

    <el-alert
      v-if="statusBody && statusBody.pluginsRootReady === false"
      type="error"
      :closable="false"
      show-icon
      class="plugin-market__alert"
      title="插件根目录不可用"
    >
      <p class="plugin-market__alert-p">
        当前解析路径不是已存在的目录，宿主已跳过磁盘扫描与加载。请创建目录或修正
        <code>mms.plugin.root-dir</code>。下方卡片「磁盘」列将统一标记异常。
      </p>
      <p class="plugin-market__alert-p"><code>{{ statusBody.resolvedPluginsRoot }}</code></p>
    </el-alert>

    <el-empty v-if="!loading && cards.length === 0" description="暂无上架插件，请执行 sys_plugins 脚本并维护上架数据" />

    <el-row v-else :gutter="16" class="plugin-market__grid">
      <el-col v-for="row in cards" :key="row.pluginId" :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="plugin-card" shadow="hover">
          <div class="plugin-card__media">
            <el-image
              v-if="row.iconUrl"
              :src="row.iconUrl"
              fit="cover"
              class="plugin-card__img"
              lazy
            >
              <template #error>
                <div class="plugin-card__placeholder"><span class="plugin-card__ph-text">MMS</span></div>
              </template>
            </el-image>
            <div v-else class="plugin-card__placeholder"><span class="plugin-card__ph-text">插件</span></div>
          </div>
          <div class="plugin-card__body">
            <div class="plugin-card__head">
              <span class="plugin-card__name" :title="row.name">{{ row.name }}</span>
              <el-tag size="small" type="info" effect="plain">{{ row.displayVersion }}</el-tag>
            </div>
            <div class="plugin-card__tags">
              <span class="plugin-card__tag-l">安装</span>
              <el-tag :type="installTagType(row.runtimeState)" size="small">
                {{ installLabel(row.runtimeState) }}
              </el-tag>
            </div>
            <div v-if="row.diskLayoutWarning" class="plugin-card__tags">
              <span class="plugin-card__tag-l">磁盘</span>
              <el-tag :type="diskLayoutTagType(row.diskLayoutWarning)" size="small" effect="dark">
                {{ diskLayoutLabel(row.diskLayoutWarning) }}
              </el-tag>
            </div>
            <div v-if="row.runtimeState === 'LOADED'" class="plugin-card__tags">
              <span class="plugin-card__tag-l">健康</span>
              <el-tag :type="healthTagType(row.healthState)" size="small">
                {{ healthLabel(row.healthState) }}
              </el-tag>
            </div>
            <div v-else-if="row.runtimeState === 'ON_DISK'" class="plugin-card__tags plugin-card__tags--muted">
              <span class="plugin-card__tag-l">健康</span>
              <span class="plugin-card__muted">未运行时不探测</span>
            </div>
            <p class="plugin-card__desc text-gray">{{ brief(row.description) }}</p>
          </div>
          <div class="plugin-card__foot" @click.stop>
            <el-button type="primary" link @click="openDetail(row)">详情</el-button>
            <el-upload
              v-if="row.runtimeState !== 'LOADED'"
              class="plugin-card__upload"
              :show-file-list="false"
              accept=".jar"
              :http-request="(opt) => onUploadForRow(opt, row)"
            >
              <el-button type="success" link>安装</el-button>
            </el-upload>
            <el-button
              v-if="row.runtimeState !== 'NOT_INSTALLED'"
              type="warning"
              link
              title="仅删除磁盘上的安装目录，不动库表；卸除后可重新安装"
              @click="onUninstall(row, false)"
            >
              卸载
            </el-button>
            <el-button
              v-if="row.runtimeState !== 'LOADED'"
              type="danger"
              link
              title="仅移除库表市场/版本登记，不删磁盘文件"
              @click="onRemoveCatalog(row, false)"
            >
              删除
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="detailVisible"
      :title="detail?.name || '插件详情'"
      width="640px"
      destroy-on-close
      class="plugin-detail-dialog"
    >
      <template v-if="detail">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="插件 ID">{{ detail.pluginId }}</el-descriptions-item>
          <el-descriptions-item label="展示版本">{{ detail.displayVersion }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.catalogActiveVersion" label="库表激活版本">
            {{ detail.catalogActiveVersion }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="detail.recordedVersions?.length"
            label="已登记版本"
          >
            {{ detail.recordedVersions.join('、') }}
          </el-descriptions-item>
          <el-descriptions-item label="安装状态">{{ installLabel(detail.runtimeState) }}</el-descriptions-item>
          <el-descriptions-item label="健康状态">
            {{
              detail.runtimeState === 'LOADED'
                ? healthLabel(detail.healthState)
                : detail.runtimeState === 'ON_DISK'
                  ? '未运行（无）'
                  : '未安装（无）'
            }}
          </el-descriptions-item>
          <el-descriptions-item label="磁盘版本">{{ detail.diskVersionsLine }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.diskLayoutWarning" label="磁盘布局">
            <el-tag :type="diskLayoutTagType(detail.diskLayoutWarning)" size="small">
              {{ diskLayoutLabel(detail.diskLayoutWarning) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="宿主启用">{{ detail.hostEnabled ? '是' : '否' }}</el-descriptions-item>
        </el-descriptions>
        <div
          v-if="detail.recordedVersions?.length > 0"
          class="plugin-detail__rollback"
        >
          <span class="mr-2">回切版本（磁盘上需已有对应目录）</span>
          <el-select v-model="rollbackVer" placeholder="选择版本" size="small" style="width: 160px">
            <el-option
              v-for="v in detail.recordedVersions"
              :key="v"
              :label="v"
              :value="v"
            />
          </el-select>
          <el-button
            type="warning"
            size="small"
            class="ml-2"
            :loading="rollbacking"
            :disabled="!rollbackVer || rollbackVer === detail.catalogActiveVersion"
            @click="onRollback(detail)"
          >
            切换并重载
          </el-button>
        </div>
        <p v-if="detail.runtimeState === 'NOT_INSTALLED'" class="plugin-detail__hint">
          当前为<strong>未安装</strong>：请使用页面顶部上传与该插件 ID 匹配的 JAR；服务端会先校验再通过再入库。
        </p>
        <h4 class="mt-4 mb-2">功能介绍</h4>
        <p class="plugin-detail__intro">{{ detail.description || '—' }}</p>
        <template v-if="detail.manifest">
          <h4 class="mt-4 mb-2">Manifest（plugin.json）</h4>
          <pre class="plugin-detail__pre">{{ JSON.stringify(detail.manifest, null, 2) }}</pre>
        </template>
        <template v-if="detail.healthBody">
          <h4 class="mt-4 mb-2">健康检查详情</h4>
          <pre class="plugin-detail__pre">{{ detail.healthBody }}</pre>
        </template>
      </template>
      <template #footer>
        <div v-if="detail" class="plugin-detail__footer">
          <el-upload
            v-if="detail.runtimeState !== 'LOADED'"
            :show-file-list="false"
            accept=".jar"
            :http-request="(opt) => onUploadForRow(opt, detail)"
          >
            <el-button type="success" size="small">安装（上传 JAR）</el-button>
          </el-upload>
          <el-button
            v-if="detail.runtimeState !== 'NOT_INSTALLED'"
            type="warning"
            size="small"
            title="仅删除磁盘安装目录，不动库表；可再安装"
            @click="onUninstall(detail, true)"
          >
            卸载
          </el-button>
          <el-button
            v-if="detail.runtimeState !== 'LOADED'"
            type="danger"
            size="small"
            title="仅移除库表登记，不删磁盘"
            @click="onRemoveCatalog(detail, true)"
          >
            删除（库表）
          </el-button>
          <el-button size="small" @click="detailVisible = false">关闭</el-button>
        </div>
        <el-button v-else size="small" @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemPluginMarket">
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import {
  activatePluginVersion,
  fetchPluginHostStatus,
  fetchPluginMarketCards,
  installPluginJar,
  reloadPlugins,
  removePluginCatalog,
  uninstallPlugin,
} from './api';

const loading = ref(false);
const reloading = ref(false);
const statusBody = reactive<any>({});
const cards = ref<any[]>([]);
const detailVisible = ref(false);
const detail = ref<any>(null);
const rollbackVer = ref<string>('');
const rollbacking = ref(false);

function installLabel(s: string) {
  if (s === 'LOADED') return '运行中';
  if (s === 'ON_DISK') return '已安装（未加载）';
  return '未安装';
}

function installTagType(s: string): 'success' | 'warning' | 'info' {
  if (s === 'LOADED') return 'success';
  if (s === 'ON_DISK') return 'warning';
  return 'info';
}

function healthLabel(h: string) {
  if (h === 'NORMAL') return '正常';
  if (h === 'ABNORMAL') return '异常';
  if (h === 'NO_SPI') return '无探测';
  if (h === 'UNKNOWN') return '未知';
  return '—';
}

function healthTagType(h: string): 'success' | 'danger' | 'info' | 'warning' {
  if (h === 'NORMAL') return 'success';
  if (h === 'ABNORMAL') return 'danger';
  if (h === 'NO_SPI') return 'info';
  if (h === 'UNKNOWN') return 'warning';
  return 'info';
}

function diskLayoutLabel(code: string | null | undefined) {
  if (!code) return '—';
  const m: Record<string, string> = {
    ROOT_NOT_DIRECTORY: '根目录不可用',
    VERSION_DIR_MISSING: '版本目录缺失',
    LIB_DIR_MISSING: 'lib 目录缺失',
    JAR_NOT_FOUND: 'JAR 未找到',
  };
  return m[code] || code;
}

function diskLayoutTagType(code: string): 'danger' | 'warning' | 'info' {
  if (code === 'ROOT_NOT_DIRECTORY') return 'danger';
  if (code === 'JAR_NOT_FOUND') return 'warning';
  return 'warning';
}

function brief(text: string | null | undefined) {
  if (!text) return '';
  return text.length > 72 ? text.slice(0, 72) + '…' : text;
}

function openDetail(row: any) {
  detail.value = row;
  rollbackVer.value = row.catalogActiveVersion || row.recordedVersions?.[0] || '';
  detailVisible.value = true;
}

async function onRollback(row: any) {
  if (!rollbackVer.value) return;
  try {
    rollbacking.value = true;
    await activatePluginVersion(row.pluginId, rollbackVer.value);
    ElMessage.success('已切换激活版本并重载');
    detailVisible.value = false;
    await loadAll();
  } catch {
    /* */
  } finally {
    rollbacking.value = false;
  }
}

async function onUploadForRow(opt: UploadRequestOptions, row: any) {
  const pid = row?.pluginId;
  if (pid) {
    try {
      await ElMessageBox.confirm(
        `将安装到本插件：请确保所上传 JAR 内 plugin.json 的 id 为「${pid}」，否则校验失败。是否继续？`,
        '手动安装',
        { type: 'warning' }
      );
    } catch {
      return;
    }
  }
  try {
    await installPluginJar(opt.file as File);
    ElMessage.success('已安装并重载');
    detailVisible.value = false;
    await loadAll();
  } catch {
    /* */
  }
}

async function loadAll() {
  loading.value = true;
  try {
    const sres: any = await fetchPluginHostStatus();
    Object.assign(statusBody, sres?.data ?? {});
    const cres: any = await fetchPluginMarketCards();
    cards.value = cres?.data ?? [];
  } catch {
    /* 拦截器已提示 */
  } finally {
    loading.value = false;
  }
}

async function onReloadAll() {
  reloading.value = true;
  try {
    await reloadPlugins();
    ElMessage.success('已全量重载');
    await loadAll();
  } finally {
    reloading.value = false;
  }
}

async function onUpload(opt: UploadRequestOptions) {
  try {
    await installPluginJar(opt.file as File);
    ElMessage.success('已安装并重载');
    await loadAll();
  } catch {
    /* */
  }
}

async function onUninstall(row: any, closeDetail: boolean) {
  try {
    await ElMessageBox.confirm(
      `「卸载」仅删除「${row.name}」在插件根目录下的<strong>磁盘安装文件</strong>（所有版本），全量重载宿主。<br/><br/>不会移除库表中的市场/版本登记；这不是点「删除」那种操作。<br/>卸载后可用本页「安装」或页顶上传同一插件 ID 的 JAR 随时<strong>重新安装</strong>。<br/><br/>是否继续？`,
      '卸除磁盘文件',
      {
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }
    );
    await uninstallPlugin(row.pluginId, null);
    ElMessage.success('已卸除磁盘文件并重载，可重新安装');
    if (closeDetail) detailVisible.value = false;
    await loadAll();
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  }
}

async function onRemoveCatalog(row: any, closeDetail: boolean) {
  try {
    await ElMessageBox.confirm(
      `「删除」才会从<strong>库表</strong>移除该插件的市场展示与版本登记（sys_plugins / sys_plugin_version），并全量重载；<strong>不删磁盘</strong>文件。<br/><br/>若仅需清空盘上安装包，请用「卸载」；卸载后仍可重新安装。若既要清盘又要去掉登记，建议先「卸载」再「删除」。<br/><br/>插件：${row.name}（${row.pluginId}）`,
      '删除库表登记',
      {
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }
    );
    await removePluginCatalog(row.pluginId);
    ElMessage.success('已移除库表登记并重载');
    if (closeDetail) detailVisible.value = false;
    await loadAll();
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  }
}

onMounted(() => loadAll());
</script>

<style scoped lang="scss">
.plugin-market__hero {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px 22px;
  border-radius: 12px;
  background: linear-gradient(120deg, var(--el-fill-color-light) 0%, var(--el-bg-color) 100%);
  border: 1px solid var(--el-border-color-lighter);
}
.plugin-market__title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
}
.plugin-market__subtitle {
  margin: 0 0 10px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  max-width: 720px;
  line-height: 1.55;
}
.plugin-market__meta {
  margin: 0;
  font-size: 12px;
}
.plugin-market__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.plugin-market__grid {
  margin-top: 8px;
}
.plugin-market__alert {
  margin-bottom: 16px;
}
.plugin-market__alert-p {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.55;
  &:last-child {
    margin-bottom: 0;
  }
}
.plugin-market__code {
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--el-fill-color);
}
.plugin-card {
  margin-bottom: 16px;
  border-radius: 12px;
  cursor: default;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  &:hover {
    transform: translateY(-2px);
  }
}
.plugin-card__upload {
  display: inline-block;
  vertical-align: middle;
}
.plugin-detail__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}
.plugin-card__media {
  margin: -12px -12px 12px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 132px;
  background: var(--el-fill-color-dark);
}
.plugin-card__img {
  width: 100%;
  height: 132px;
  display: block;
}
.plugin-card__placeholder {
  height: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%);
}
.plugin-card__ph-text {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  opacity: 0.9;
}
.plugin-card__body {
  min-height: 96px;
}
.plugin-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.plugin-card__name {
  font-weight: 600;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.plugin-card__tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.plugin-card__tag-l {
  flex: 0 0 2em;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.plugin-card__tags--muted {
  opacity: 0.85;
}
.plugin-card__muted {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}
.plugin-card__desc {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.45;
}
.plugin-card__foot {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.plugin-detail__intro {
  margin: 0;
  line-height: 1.65;
  color: var(--el-text-color-regular);
  white-space: pre-wrap;
}
.plugin-detail__rollback {
  margin: 12px 0;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.plugin-detail__hint {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-regular);
}
.plugin-detail__pre {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  font-size: 12px;
  overflow: auto;
  max-height: 240px;
}
.text-gray {
  color: var(--el-text-color-secondary);
}
.text-success {
  color: var(--el-color-success);
}
.text-warning {
  color: var(--el-color-warning);
}
.mt-4 {
  margin-top: 16px;
}
.mb-2 {
  margin-bottom: 8px;
}
.mr-2 {
  margin-right: 8px;
}
.ml-2 {
  margin-left: 8px;
}
</style>
