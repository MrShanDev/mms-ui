<template>
  <div class="plugin-market layout-padding layout-padding-auto">
    <div class="plugin-market__hero">
      <div>
        <h2 class="plugin-market__title">插件市场</h2>
        <p class="plugin-market__subtitle">
          <strong>安装</strong>：校验 JAR 内 <code>plugin.json</code> 与宿主版本；通过后写入磁盘并登记版本、激活，再全量重载。
          <strong>停用</strong>（运行中）：只取消库表中的<strong>激活</strong>标记并重载，插件不再加载；<em>不删磁盘</em>、不移除市场卡片，可在详情里切换版本再激活或覆盖上传。
          <strong>删除</strong>：删除<strong>磁盘</strong>上该插件全部安装目录，并移除<strong>库表</strong>中的版本与市场登记（<code>sys_plugin_version</code> / <code>sys_plugins</code>）后重载；等同于彻底下架并清盘。
          <strong>仅清库表</strong>（未安装磁盘时）：仍可用详情中的「删除库表登记」，只删登记、不动磁盘（若盘上无文件则与删除效果一致）。
          <strong>日志</strong>：运行控制区或详情中打开「日志」可查看独立日志文件尾部（默认 <code>logs/plugins/</code><em>插件ID@版本</em><code>.log</code>，仅含插件 MDC 下 INFO 及以上条目）。
          点击卡片<strong>封面图</strong>打开完整信息与回切版本。
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
          <template v-if="statusBody.activateVersionReloadScope === 'SINGLE_TARGET'">
            · 激活版本重载：<b class="text-warning">仅目标插件</b>（多插件依赖请改
            <code>mms.plugin.activate-version-reload-scope=FULL</code>
            或页顶「全量重载」）
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
          <div
            class="plugin-card__media plugin-card__media--clickable"
            title="点击查看详情"
            @click="openDetail(row)"
          >
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
            <div class="plugin-card__tags-row">
              <div class="plugin-card__tags-col">
                <span class="plugin-card__tag-l">安装</span>
                <el-tag :type="installTagType(row.runtimeState)" size="small">
                  {{ installLabel(row.runtimeState) }}
                </el-tag>
              </div>
              <div
                class="plugin-card__tags-col"
                :class="{ 'plugin-card__tags-col--muted': row.runtimeState === 'ON_DISK' }"
              >
                <span class="plugin-card__tag-l">健康</span>
                <template v-if="row.runtimeState === 'LOADED'">
                  <el-tag :type="healthTagType(row.healthState)" size="small">
                    {{ healthLabel(row.healthState) }}
                  </el-tag>
                </template>
                <span v-else-if="row.runtimeState === 'ON_DISK'" class="plugin-card__muted">未运行时不探测</span>
                <span v-else class="plugin-card__muted">—</span>
              </div>
            </div>
            <div v-if="row.diskLayoutWarning" class="plugin-card__tags">
              <span class="plugin-card__tag-l">磁盘</span>
              <el-tag :type="diskLayoutTagType(row.diskLayoutWarning)" size="small" effect="dark">
                {{ diskLayoutLabel(row.diskLayoutWarning) }}
              </el-tag>
            </div>
            <div
              v-if="
                row.runtimeState === 'LOADED' &&
                row.subprocessLaunchEnabled &&
                row.manifest?.runtimeMode === 'INDEPENDENT_PROCESS'
              "
              class="plugin-card__tags"
            >
              <span class="plugin-card__tag-l">子进程</span>
              <el-tag type="warning" size="small" effect="plain">
                {{ subprocessCardLabel(row) }}
              </el-tag>
            </div>
            <p class="plugin-card__desc text-gray" :title="descTitle(row.description)">
              {{ row.description || '' }}
            </p>
            <div
              v-if="row.runtimeState === 'LOADED' || row.runtimeState === 'ON_DISK'"
              class="plugin-card__power"
              @click.stop
            >
              <div class="plugin-card__power-head">
                <span class="plugin-card__power-title">运行控制</span>
              </div>
              <div class="plugin-card__power-actions">
                <div v-if="powerShowEnable(row)" class="plugin-card__power-item">
                  <el-tooltip placement="top" content="恢复库表激活并重载（磁盘须已有该版本）">
                    <el-button
                      circle
                      size="small"
                      type="success"
                      plain
                      :disabled="powerRowLocked(row)"
                      :loading="powerLoading(row, 'enable')"
                      @click="onEnable(row, false)"
                    >
                      <el-icon><VideoPlay /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <span class="plugin-card__power-caption">启动</span>
                </div>
                <div v-if="powerShowDeactivate(row)" class="plugin-card__power-item">
                  <el-tooltip placement="top" content="取消库表激活并重载，不删磁盘">
                    <el-button
                      circle
                      size="small"
                      type="warning"
                      plain
                      :disabled="powerRowLocked(row)"
                      :loading="powerLoading(row, 'deactivate')"
                      @click="onDeactivate(row, false)"
                    >
                      <el-icon><SwitchButton /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <span class="plugin-card__power-caption">停止</span>
                </div>
                <div v-if="powerShowRestart(row)" class="plugin-card__power-item">
                  <el-tooltip placement="top" content="先停止再按当前版本重新激活（仅运行中）">
                    <el-button
                      circle
                      size="small"
                      type="primary"
                      plain
                      :disabled="powerRowLocked(row)"
                      :loading="powerLoading(row, 'restart')"
                      @click="onRestart(row)"
                    >
                      <el-icon><RefreshRight /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <span class="plugin-card__power-caption">重启</span>
                </div>
                <div v-if="pluginLogVersion(row)" class="plugin-card__power-item">
                  <el-tooltip placement="top" content="查看插件独立日志（logs/plugins）">
                    <el-button
                      circle
                      size="small"
                      type="info"
                      plain
                      :disabled="powerRowLocked(row)"
                      @click="openPluginLog(row)"
                    >
                      <el-icon><Document /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <span class="plugin-card__power-caption">日志</span>
                </div>
                <div v-if="row.runtimeState === 'ON_DISK'" class="plugin-card__power-item">
                  <el-tooltip
                    placement="top"
                    content="删除磁盘安装目录并清除库表与市场登记（不可撤销）；运行中请先在宿主停用"
                  >
                    <el-button
                      circle
                      size="small"
                      type="danger"
                      plain
                      :disabled="powerRowLocked(row)"
                      :loading="powerLoading(row, 'purge')"
                      @click="onPurge(row, false)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <span class="plugin-card__power-caption">删除</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="cardFootVisible(row)" class="plugin-card__foot" @click.stop>
            <el-upload
              v-if="row.runtimeState === 'NOT_INSTALLED'"
              class="plugin-card__upload"
              :show-file-list="false"
              accept=".jar"
              :http-request="(opt) => onUploadForRow(opt, row)"
            >
              <el-button type="success" link>安装</el-button>
            </el-upload>
            <el-button
              v-if="row.runtimeState === 'NOT_INSTALLED' && pluginLogVersion(row)"
              type="info"
              link
              @click="openPluginLog(row)"
            >
              日志
            </el-button>
            <el-button
              v-if="row.runtimeState === 'NOT_INSTALLED'"
              type="danger"
              link
              title="仅移除库表登记（无本地安装目录时）"
              @click="onRemoveCatalog(row, false)"
            >
              删除库表
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
          <el-descriptions-item label="库表激活版本">
            <span v-if="detail.catalogActiveVersion">{{ detail.catalogActiveVersion }}</span>
            <span v-else class="text-gray">未激活（可点「启用」恢复）</span>
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
          <el-descriptions-item
            v-if="
              detail.runtimeState === 'LOADED' &&
              detail.subprocessLaunchEnabled &&
              detail.manifest?.runtimeMode === 'INDEPENDENT_PROCESS'
            "
            label="独立子进程"
          >
            <span v-if="detail.subprocessPort != null">监听端口 {{ detail.subprocessPort }}</span>
            <span v-else>监听端口 —</span>
            <template v-if="detail.subprocessHostLeasedPort != null">
              <span class="mx-1">·</span>
              <span>租约登记 {{ detail.subprocessHostLeasedPort }}</span>
            </template>
            <template v-if="detail.subprocessTcpPortAppearsBound === true">
              <span class="mx-1">·</span>
              <span class="text-warning">端口已被占用(探测)</span>
            </template>
            <template v-else-if="detail.subprocessTcpPortAppearsBound === false && detail.subprocessPort != null">
              <span class="mx-1">·</span>
              <span class="text-gray">端口未监听(探测)</span>
            </template>
            <span class="mx-1">·</span>
            <span v-if="detail.subprocessPid != null">PID {{ detail.subprocessPid }}</span>
            <span v-else>PID —</span>
            <span class="mx-1">·</span>
            <span>{{ subprocessAliveLabel(detail) }}</span>
            <div v-if="detail.subprocessLastError" class="text-warning mt-1">
              {{ detail.subprocessLastError }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="磁盘版本">{{ detail.diskVersionsLine }}</el-descriptions-item>
          <el-descriptions-item v-if="detail.diskLayoutWarning" label="磁盘布局">
            <el-tag :type="diskLayoutTagType(detail.diskLayoutWarning)" size="small">
              {{ diskLayoutLabel(detail.diskLayoutWarning) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="宿主启用">{{ detail.hostEnabled ? '是' : '否' }}</el-descriptions-item>
        </el-descriptions>
        <el-alert
          v-if="statusBody.activateVersionReloadScope === 'SINGLE_TARGET'"
          type="warning"
          :closable="false"
          show-icon
          class="mb-2"
          title="当前为「仅重载目标插件」模式"
        >
          切换激活版本<strong>不会</strong>按全局依赖拓扑重载其它插件；若插件之间存在 dependencies，可能出现未加载依赖。请改用配置
          <code>FULL</code>
          或使用页顶「全量重载」。说明见仓库
          <code>version/v2.0.5-插件子进程Peer契约与激活重载边界.md</code>
          §5。
        </el-alert>
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
    </el-dialog>

    <el-dialog
      v-model="logVisible"
      title="插件独立日志"
      width="80%"
      top="5vh"
      destroy-on-close
      class="plugin-log-dialog"
      @closed="onLogDialogClosed"
    >
      <div class="plugin-log-toolbar">
        <el-button size="small" :loading="logLoading" @click="loadPluginLogTail(true)">刷新</el-button>
        <el-button size="small" type="warning" :disabled="!logContext" @click="onClearPluginLog">清空日志</el-button>
        <span class="plugin-log-toolbar__gap" />
        <span class="plugin-log-toolbar__label text-gray">自动监听</span>
        <el-switch v-model="logWatchEnabled" size="small" />
        <span class="plugin-log-toolbar__label text-gray">间隔</span>
        <el-input-number
          v-model="logWatchIntervalMs"
          :min="1500"
          :max="60000"
          :step="500"
          size="small"
          controls-position="right"
          class="plugin-log-toolbar__interval"
        />
        <span class="text-gray plugin-log-toolbar__hint">ms（轮询尾部）</span>
      </div>
      <div v-loading="logLoading" class="plugin-log-body">
        <template v-if="logData">
          <p v-if="logData.fileMissing" class="plugin-log-meta text-warning">未找到日志文件（可能尚未产生带插件 MDC 的日志）。</p>
          <p v-else class="plugin-log-meta text-gray">
            <span v-if="logData.truncated" class="text-warning">仅显示文件末尾一段 · </span>
            <code>{{ logData.logPath }}</code>
          </p>
          <el-input
            ref="logTextareaRef"
            :model-value="logData.text || ''"
            type="textarea"
            :rows="24"
            readonly
            class="plugin-log-textarea"
          />
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemPluginMarket">
import { Delete, Document, RefreshRight, SwitchButton, VideoPlay } from '@element-plus/icons-vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import {
  activatePluginVersion,
  clearPluginLog,
  deactivatePlugin,
  fetchPluginHostStatus,
  fetchPluginLogTail,
  fetchPluginMarketCards,
  installPluginJar,
  purgePlugin,
  reloadPlugins,
  removePluginCatalog,
} from './api';

const loading = ref(false);
const reloading = ref(false);
const statusBody = reactive<any>({});
const cards = ref<any[]>([]);
const detailVisible = ref(false);
const detail = ref<any>(null);
const rollbackVer = ref<string>('');
const rollbacking = ref(false);
const logVisible = ref(false);
const logLoading = ref(false);
const logData = ref<any>(null);
const logContext = ref<{ pluginId: string; version: string } | null>(null);
const logTextareaRef = ref();
const logWatchEnabled = ref(true);
const logWatchIntervalMs = ref(2500);
let logPollTimer: ReturnType<typeof setInterval> | null = null;
/** 卡片运行控制：仅当前操作的按钮显示 loading */
const powerBusy = ref<{
  pluginId: string;
  op: 'enable' | 'deactivate' | 'restart' | 'purge';
} | null>(null);

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

/** 超出省略时 hover 可看全文；无内容不显示原生 title */
function descTitle(text: string | null | undefined) {
  if (!text || !String(text).trim()) return undefined;
  return String(text);
}

/** 仅未安装卡片需要底栏（安装 / 日志 / 删除库表）；已安装项均在运行控制区 */
function cardFootVisible(row: any): boolean {
  return row?.runtimeState === 'NOT_INSTALLED';
}

function subprocessAliveLabel(row: any) {
  if (row.subprocessAlive === true) return '运行中';
  if (row.subprocessPid != null) return '已退出';
  return '未记录';
}

function subprocessCardLabel(row: any) {
  const p = row.subprocessPort != null ? `:${row.subprocessPort}` : '';
  const lease =
    row.subprocessHostLeasedPort != null ? ` 租${row.subprocessHostLeasedPort}` : '';
  const occ = row.subprocessTcpPortAppearsBound === true ? ' 占' : '';
  if (row.subprocessLastError) return `异常${p}${lease}${occ}`;
  if (row.subprocessAlive === true) return `运行中${p}${lease}${occ}`;
  if (row.subprocessPid != null) return `已退出${p}${lease}${occ}`;
  return `未起进程${p}${lease}${occ}`;
}

function openDetail(row: any) {
  detail.value = row;
  rollbackVer.value = row.catalogActiveVersion || row.recordedVersions?.[0] || '';
  detailVisible.value = true;
}

/** 用于解析 pluginLogTail 的版本（与磁盘日志文件名 pluginId@version 一致） */
function pluginLogVersion(row: any): string | null {
  if (!row?.pluginId) return null;
  const mv = row.manifest?.version;
  if (mv && String(mv).trim() && mv !== '—') return String(mv).trim();
  const ca = row.catalogActiveVersion;
  if (ca && String(ca).trim() && ca !== '—') return String(ca).trim();
  const dv = row.displayVersion;
  if (dv && String(dv).trim() && dv !== '—') return String(dv).trim();
  const rv = row.recordedVersions?.[0];
  if (rv && String(rv).trim()) return String(rv).trim();
  return null;
}

/** 库表是否已标记某一版本为激活（停用后为空） */
function hasCatalogActive(row: any): boolean {
  const v = row?.catalogActiveVersion;
  return v != null && String(v).trim() !== '' && v !== '—';
}

/** 一键启用时使用的版本：优先已登记列表中的最新一条，否则展示版本 */
function resolveEnableVersion(row: any): string | null {
  const rv0 = row.recordedVersions?.[0];
  if (rv0 && String(rv0).trim()) return String(rv0).trim();
  const dv = row.displayVersion;
  if (dv && String(dv).trim() && dv !== '—') return String(dv).trim();
  return null;
}

function canPluginEnable(row: any): boolean {
  if (hasCatalogActive(row)) return false;
  if (row.runtimeState !== 'LOADED' && row.runtimeState !== 'ON_DISK') return false;
  return resolveEnableVersion(row) != null;
}

/** 运行中且库表已激活，可做完整重启 */
function canPluginRestart(row: any): boolean {
  return row.runtimeState === 'LOADED' && hasCatalogActive(row);
}

/** 仅展示可点的「启动」：已激活/运行中则隐藏；请求进行中保留以防闪一下消失 */
function powerShowEnable(row: any): boolean {
  return canPluginEnable(row) || powerLoading(row, 'enable');
}

/** 仅展示可点的「停止」：库表无激活时隐藏 */
function powerShowDeactivate(row: any): boolean {
  return hasCatalogActive(row) || powerLoading(row, 'deactivate');
}

/** 仅展示可点的「重启」：非运行中或未激活时隐藏 */
function powerShowRestart(row: any): boolean {
  return canPluginRestart(row) || powerLoading(row, 'restart');
}

function powerLoading(row: any, op: 'enable' | 'deactivate' | 'restart' | 'purge'): boolean {
  return (
    row?.pluginId != null &&
    powerBusy.value?.pluginId === row.pluginId &&
    powerBusy.value?.op === op
  );
}

function powerRowLocked(row: any): boolean {
  return row?.pluginId != null && powerBusy.value?.pluginId === row.pluginId;
}

function resolveRestartVersion(row: any): string | null {
  const ca = row.catalogActiveVersion;
  if (ca && String(ca).trim() && ca !== '—') return String(ca).trim();
  const mv = row.manifest?.version;
  if (mv && String(mv).trim() && mv !== '—') return String(mv).trim();
  return resolveEnableVersion(row);
}

function stopLogPoll() {
  if (logPollTimer != null) {
    clearInterval(logPollTimer);
    logPollTimer = null;
  }
}

function scheduleLogPoll() {
  stopLogPoll();
  if (!logVisible.value || !logWatchEnabled.value || !logContext.value) {
    return;
  }
  const ms = Math.min(Math.max(logWatchIntervalMs.value, 1500), 60000);
  logPollTimer = setInterval(() => {
    void loadPluginLogTailSilent();
  }, ms);
}

watch([logVisible, logWatchEnabled, logWatchIntervalMs], () => {
  scheduleLogPoll();
});

onBeforeUnmount(() => {
  stopLogPoll();
});

function onLogDialogClosed() {
  stopLogPoll();
  logContext.value = null;
  logData.value = null;
}

async function scrollLogToBottom() {
  await nextTick();
  const wrap = logTextareaRef.value as any;
  const ta = wrap?.$el?.querySelector?.('textarea') as HTMLTextAreaElement | undefined;
  if (ta) {
    ta.scrollTop = ta.scrollHeight;
  }
}

/** @param showSpinner 为 false 时用于轮询，不挡整个弹窗 */
async function loadPluginLogTail(showSpinner: boolean) {
  if (!logContext.value) return;
  if (showSpinner) logLoading.value = true;
  try {
    const res: any = await fetchPluginLogTail(logContext.value.pluginId, logContext.value.version);
    logData.value = res?.data ?? res;
    await scrollLogToBottom();
  } finally {
    if (showSpinner) logLoading.value = false;
  }
}

async function loadPluginLogTailSilent() {
  if (!logContext.value || !logVisible.value) return;
  try {
    const res: any = await fetchPluginLogTail(logContext.value.pluginId, logContext.value.version);
    logData.value = res?.data ?? res;
    await scrollLogToBottom();
  } catch {
    /* 轮询失败不反复打断 */
  }
}

async function onClearPluginLog() {
  if (!logContext.value) return;
  try {
    await ElMessageBox.confirm(
      '将<strong>截断清空</strong>当前插件独立日志文件（仅该文件，不影响其它系统日志）。Logback 会继续向同一文件写入新日志。<br/><br/>是否继续？',
      '清空插件日志',
      { type: 'warning', dangerouslyUseHTMLString: true }
    );
    await clearPluginLog(logContext.value.pluginId, logContext.value.version);
    ElMessage.success('已清空');
    await loadPluginLogTail(false);
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  }
}

async function openPluginLog(row: any) {
  const ver = pluginLogVersion(row);
  if (!ver) {
    ElMessage.warning('无法解析插件版本，请在详情中确认库表/展示版本或先加载插件');
    return;
  }
  logContext.value = { pluginId: row.pluginId, version: ver };
  logVisible.value = true;
  logData.value = null;
  try {
    await loadPluginLogTail(true);
  } catch {
    logVisible.value = false;
    logContext.value = null;
  }
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

/** 大文件上传：全屏 loading + 进度文案；结束后由调用方处理成功提示与刷新 */
async function installJarWithProgress(file: File): Promise<void> {
  const loading = ElLoading.service({
    lock: true,
    text: '准备上传…',
    background: 'rgba(0, 0, 0, 0.35)',
  });
  try {
    await installPluginJar(file, {
      onUploadProgress: (evt) => {
        const { loaded, total } = evt;
        if (total && total > 0) {
          const pct = Math.min(100, Math.round((loaded * 100) / total));
          if (pct >= 100) {
            loading.setText('上传已完成，正在等待服务器校验与安装…');
          } else {
            loading.setText(`正在上传 ${pct}%…`);
          }
        } else {
          loading.setText('正在上传…');
        }
      },
    });
  } finally {
    loading.close();
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
    await installJarWithProgress(opt.file as File);
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
    await installJarWithProgress(opt.file as File);
    ElMessage.success('已安装并重载');
    await loadAll();
  } catch {
    /* */
  }
}

async function onDeactivate(row: any, closeDetail: boolean) {
  try {
    await ElMessageBox.confirm(
      `将对「${row.name}」执行<strong>停用</strong>：清除库表中的激活版本标记并重载，插件当下不再运行。<br/><br/><strong>不会</strong>删除磁盘文件，<strong>不会</strong>移除市场展示；稍后可再切换激活版本或重新上传安装。<br/><br/>是否继续？`,
      '停用插件',
      {
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }
    );
    powerBusy.value = { pluginId: row.pluginId, op: 'deactivate' };
    await deactivatePlugin(row.pluginId);
    ElMessage.success('已停用并重载');
    if (closeDetail) detailVisible.value = false;
    await loadAll();
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  } finally {
    powerBusy.value = null;
  }
}

async function onEnable(row: any, closeDetail: boolean) {
  const ver = resolveEnableVersion(row);
  if (!ver) {
    ElMessage.warning('没有可启用的版本，请确认库表有登记或磁盘已安装');
    return;
  }
  try {
    await ElMessageBox.confirm(
      `将「${row.name}」的<strong>库表激活版本</strong>设为 <code>${ver}</code> 并重载宿主。<br/><br/>磁盘上须已有该版本目录，否则激活会失败。<br/><br/>是否继续？`,
      '启用插件',
      { type: 'info', dangerouslyUseHTMLString: true }
    );
    powerBusy.value = { pluginId: row.pluginId, op: 'enable' };
    await activatePluginVersion(row.pluginId, ver);
    ElMessage.success('已启用并重载');
    if (closeDetail) detailVisible.value = false;
    await loadAll();
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  } finally {
    powerBusy.value = null;
  }
}

async function onRestart(row: any) {
  const ver = resolveRestartVersion(row);
  if (!ver) {
    ElMessage.warning('无法解析当前运行版本');
    return;
  }
  try {
    await ElMessageBox.confirm(
      `将「${row.name}」<strong>重启</strong>：先停止再按版本 <code>${ver}</code> 重新激活并重载。<br/><br/>是否继续？`,
      '重启插件',
      { type: 'warning', dangerouslyUseHTMLString: true }
    );
    powerBusy.value = { pluginId: row.pluginId, op: 'restart' };
    await deactivatePlugin(row.pluginId);
    await activatePluginVersion(row.pluginId, ver);
    ElMessage.success('已重启');
    await loadAll();
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  } finally {
    powerBusy.value = null;
  }
}

async function onPurge(row: any, closeDetail: boolean) {
  try {
    await ElMessageBox.confirm(
      `将对「${row.name}」（${row.pluginId}）执行<strong>删除</strong>：<strong>删除磁盘</strong>上该插件全部安装目录，并<strong>清除库表</strong>中的版本与市场登记，然后全量重载。<br/><br/>此操作不可从界面撤销，请确认。<br/><br/>是否继续？`,
      '删除插件（磁盘 + 库表）',
      {
        type: 'error',
        dangerouslyUseHTMLString: true,
      }
    );
    powerBusy.value = { pluginId: row.pluginId, op: 'purge' };
    await purgePlugin(row.pluginId);
    ElMessage.success('已删除安装目录与库表登记并重载');
    if (closeDetail) detailVisible.value = false;
    await loadAll();
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  } finally {
    powerBusy.value = null;
  }
}

async function onRemoveCatalog(row: any, closeDetail: boolean) {
  try {
    await ElMessageBox.confirm(
      `仅从<strong>库表</strong>移除「${row.name}」的市场展示与版本登记（sys_plugins / sys_plugin_version），并全量重载。<strong>不删磁盘</strong>。<br/><br/>适用于尚未安装到磁盘、只上了架的场景。<br/><br/>插件：${row.pluginId}`,
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
.plugin-card__media {
  margin: -12px -12px 12px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 132px;
  background: var(--el-fill-color-dark);
}
.plugin-card__media--clickable {
  cursor: pointer;
}
.plugin-card__media--clickable:hover .plugin-card__img,
.plugin-card__media--clickable:hover .plugin-card__placeholder {
  filter: brightness(0.95);
}
.plugin-card__media--clickable:active .plugin-card__img,
.plugin-card__media--clickable:active .plugin-card__placeholder {
  filter: brightness(0.88);
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
.plugin-card__tags-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.plugin-card__tags-col {
  flex: 1 1 50%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.plugin-card__tags-col .plugin-card__tag-l {
  flex: 0 0 2em;
}
.plugin-card__tags-col .el-tag {
  flex: 0 1 auto;
  max-width: 100%;
}
.plugin-card__tags-col .plugin-card__muted {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.plugin-card__tags-col--muted {
  opacity: 0.88;
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
/* 固定 3 行高，超出省略号（WebKit line-clamp） */
.plugin-card__desc {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.45;
  height: calc(1.45em * 3);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-break: break-word;
}
.plugin-card__power {
  margin-top: 12px;
  padding: 10px 8px 8px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
}
.plugin-card__power-head {
  margin-bottom: 8px;
  padding: 0 2px;
}
.plugin-card__power-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  letter-spacing: 0.02em;
}
.plugin-card__power-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
}
.plugin-card__power-item {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.plugin-card__power-caption {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  line-height: 1.2;
  text-align: center;
}
.plugin-card__power :deep(.el-button.is-circle) {
  padding: 8px;
}
/* 可点击时：图标/边框更深更饱和；禁用时保持系统默认灰淡 */
.plugin-card__power :deep(.el-button.is-plain.el-button--success:not(.is-disabled)) {
  color: var(--el-color-success-dark-2);
  border-color: var(--el-color-success);
  background-color: var(--el-color-success-light-9);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--success:not(.is-disabled):hover) {
  color: #fff;
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--warning:not(.is-disabled)) {
  color: var(--el-color-warning-dark-2);
  border-color: var(--el-color-warning);
  background-color: var(--el-color-warning-light-9);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--warning:not(.is-disabled):hover) {
  color: #fff;
  background-color: var(--el-color-warning);
  border-color: var(--el-color-warning);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--primary:not(.is-disabled)) {
  color: var(--el-color-primary-dark-2);
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--primary:not(.is-disabled):hover) {
  color: #fff;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--info:not(.is-disabled)) {
  color: var(--el-color-info-dark-2);
  border-color: var(--el-color-info);
  background-color: var(--el-color-info-light-9);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--info:not(.is-disabled):hover) {
  color: #fff;
  background-color: var(--el-color-info);
  border-color: var(--el-color-info);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--danger:not(.is-disabled)) {
  color: var(--el-color-danger-dark-2);
  border-color: var(--el-color-danger);
  background-color: var(--el-color-danger-light-9);
}
.plugin-card__power :deep(.el-button.is-plain.el-button--danger:not(.is-disabled):hover) {
  color: #fff;
  background-color: var(--el-color-danger);
  border-color: var(--el-color-danger);
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
.plugin-log-dialog :deep(.el-dialog__body) {
  padding-top: 8px;
}
.plugin-log-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.plugin-log-toolbar__gap {
  flex: 1;
  min-width: 4px;
}
.plugin-log-toolbar__label {
  font-size: 12px;
}
.plugin-log-toolbar__interval {
  width: 118px;
}
.plugin-log-toolbar__hint {
  font-size: 12px;
}
.plugin-log-meta {
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
}
.plugin-log-textarea :deep(textarea) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
}
</style>
