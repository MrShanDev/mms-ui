<template>
  <div class="plugin-install-wizard-root">
    <div v-loading="installSchemaWizardLoading" class="plugin-install-wizard">
      <el-steps
        :active="stepsActiveIndex"
        finish-status="success"
        process-status="process"
        align-center
        class="plugin-install-wizard__steps"
      >
        <el-step title="插件协议" description="阅读并同意" />
        <el-step title="上传与预览" description="插件信息/环境检测" />
        <el-step title="安装插件" description="Java类/管理页面/SQL/权限" />
        <el-step
          title="安装结果"
          description="结果健康检测"
          :status="installResultStepStatus"
        />
      </el-steps>

      <div class="plugin-install-wizard__step-head">
        <div class="plugin-install-wizard__step-title">
          <span class="plugin-install-wizard__step-index">STEP {{ installWizardStep + 1 }}</span>
          <strong>{{ currentStepMeta.title }}</strong>
        </div>
        <span class="plugin-install-wizard__step-desc">{{ currentStepMeta.description }}</span>
      </div>

      <p v-if="installSchemaWizardError" class="text-danger mt-3">{{ installSchemaWizardError }}</p>

      <!-- 0 协议 -->
      <div v-show="installWizardStep === 0" class="plugin-install-wizard__pane">
        <el-alert type="warning" :closable="false" show-icon title="安装前请先阅读并同意《插件使用协议》" />
        <div class="plugin-install-wizard__agreement-scroll mt-3">
          <PluginUsageAgreementContent />
        </div>
        <el-checkbox v-model="pluginUsageAgreementAccepted">我已阅读并同意《插件使用协议》</el-checkbox>
      </div>

      <!-- 1 上传 + 环境 + 预览（本地上传选包后立即解析预览） -->
      <div
        v-show="installWizardStep === 1 && !installSchemaWizardError"
        class="plugin-install-wizard__pane plugin-install-wizard__pane--preview"
      >
        <el-alert
          type="info"
          :closable="false"
          show-icon
          title="本地上传：选择 JAR 后将自动拉取环境并解析包内预览；URL：请先填写地址并点击「加载环境信息」。"
        />
        <div class="plugin-install-wizard__source-layout mt-3">
          <div class="plugin-install-wizard__source-main">
            <el-tabs
              v-model="installSourceType"
              type="card"
              class="plugin-install-wizard__source-tabs"
              @tab-change="onInstallSourceTypeChange"
            >
              <el-tab-pane label="本地上传 JAR" name="local" />
              <el-tab-pane label="URL 远程下载" name="url" />
            </el-tabs>
            <div v-if="installSourceType === 'local'" class="plugin-install-wizard__source-panel">
              <el-upload :show-file-list="false" accept=".jar" :http-request="onPagePickJar">
                <el-button type="primary">选择插件 JAR</el-button>
              </el-upload>
            </div>
            <div v-else class="plugin-install-wizard__source-panel">
              <el-input
                v-model="installRemoteUrl"
                type="textarea"
                :rows="3"
                placeholder="例如 https://releases.example.com/mms-plugin-demo-21.jar"
                @change="onRemoteUrlChange"
              />
              <div class="plugin-install-wizard__source-action">
                <el-button type="success" plain :disabled="!installRemoteUrl.trim()" @click="onUrlLoadEnv">
                  加载环境信息
                </el-button>
              </div>
            </div>
          </div>
          <div class="plugin-install-wizard__source-side">
            <div class="plugin-install-wizard__source-title">当前选择</div>
            <p class="text-sm text-gray">
              来源：<strong>{{ installSourceType === 'local' ? '本地上传 JAR' : 'URL 远程下载' }}</strong>
            </p>
            <p v-if="installSourceType === 'local' && installWizardFile" class="text-sm text-gray mt-2">
              文件：<code>{{ installWizardFile.name }}</code>
            </p>
            <p v-else-if="installSourceType === 'url' && installRemoteUrl.trim()" class="text-sm text-gray mt-2">
              URL：<code class="plugin-install-wizard__code">{{ installRemoteUrl.trim() }}</code>
            </p>
            <p v-else class="text-sm text-gray mt-2">尚未选择安装包。</p>
            <el-divider />
            <p class="text-xs text-gray">本地上传会自动解析预览；URL 模式请先加载环境信息，再进入下一步安装。</p>
          </div>
        </div>

        <template v-if="installWizardReadiness">
          <el-divider content-position="left">环境检测</el-divider>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="插件根目录就绪">
              <el-tag :type="installWizardReadiness.pluginsRootReady ? 'success' : 'danger'" size="small">
                {{ installWizardReadiness.pluginsRootReady ? '是' : '否' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="解析路径">
              <code class="plugin-install-wizard__code">{{ installWizardReadiness.resolvedPluginsRoot }}</code>
            </el-descriptions-item>
            <el-descriptions-item label="JdbcTemplate（数据源）">
              <el-tag :type="installWizardReadiness.jdbcAvailable ? 'success' : 'danger'" size="small">
                {{ installWizardReadiness.jdbcAvailable ? '可用' : '不可用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="DDL 执行器">
              <el-tag :type="installWizardReadiness.bundledSchemaExecutorAvailable ? 'success' : 'info'" size="small">
                {{ installWizardReadiness.bundledSchemaExecutorAvailable ? '可用' : '不可用' }}
              </el-tag>
              <span class="text-gray text-sm ml-2">（自动执行 JAR 内 schema.sql 时需要）</span>
            </el-descriptions-item>
            <el-descriptions-item label="插件库表桥接">
              <el-tag :type="installWizardReadiness.pluginDbBridgeAvailable ? 'success' : 'danger'" size="small">
                {{ installWizardReadiness.pluginDbBridgeAvailable ? '可用' : '不可用' }}
              </el-tag>
              <span class="text-gray text-sm ml-2">（安装登记、menuBootstrap 写菜单时需要）</span>
            </el-descriptions-item>
            <el-descriptions-item label="宿主 MMS revision">
              {{ installWizardReadiness.hostMmsRevision ?? '—' }}
            </el-descriptions-item>
          </el-descriptions>
          <el-alert
            v-if="!installWizardReadiness.pluginsRootReady"
            type="error"
            :closable="false"
            show-icon
            class="mt-3"
            title="插件根目录不可用，无法安装。请修正 mms.plugin.root-dir 或创建目录后再试。"
          />
        </template>

        <template v-if="installWizardPreview">
          <el-divider content-position="left">包内容预览</el-divider>
          <div class="plugin-install-wizard__section-title">建表 DDL（schema.sql）</div>
          <el-alert
            v-if="installWizardPreview?.hasSchema && installWizardPreview?.bundledSchemaExecutorAvailable === false"
            type="warning"
            :closable="false"
            show-icon
            class="mb-3"
            title="当前环境无法自动执行 DDL：请先在库中手工执行 schema.sql，并在安装时选择「跳过建表」。"
          />
          <div class="plugin-install-wizard__row mb-3">
            <span class="text-gray">安装时执行建表（META-INF/mms/schema.sql）</span>
            <el-switch
              v-model="installWizardRunSchema"
              :disabled="!installWizardPreview?.hasSchema || !installWizardPreview?.bundledSchemaExecutorAvailable"
              inline-prompt
              active-text="执行"
              inactive-text="跳过"
            />
          </div>
          <template v-if="installWizardPreview.hasSchema">
            <p v-if="installWizardPreview.truncated" class="text-warning text-sm">预览已截断，完整内容见 JAR。</p>
            <pre class="plugin-detail__pre plugin-install-wizard__sql">{{ installWizardPreview.schemaSql || '（空）' }}</pre>
          </template>
          <el-empty v-else description="本 JAR 未包含 schema.sql，将跳过建表步骤。" :image-size="72" />

          <el-divider content-position="left">插件信息（plugin.json）</el-divider>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="插件 ID">
              <code>{{ installWizardPreview.pluginId }}</code>
            </el-descriptions-item>
            <el-descriptions-item label="版本">
              <code>{{ installWizardPreview.version }}</code>
            </el-descriptions-item>
            <el-descriptions-item label="名称">{{ installWizardPreview.name || '—' }}</el-descriptions-item>
            <el-descriptions-item label="运行模式">{{ installWizardPreview.runtimeMode || '—' }}</el-descriptions-item>
            <el-descriptions-item label="requiresMms.revisionMin">
              {{ installWizardPreview.requiresMmsRevisionMin ?? '—' }}
              <span class="text-gray text-sm">（宿主 revision：{{ installWizardReadiness?.hostMmsRevision ?? '—' }}）</span>
            </el-descriptions-item>
            <el-descriptions-item label="menuBootstrap">
              <el-tag :type="installWizardPreview.hasMenuBootstrap ? 'success' : 'info'" size="small">
                {{ installWizardPreview.hasMenuBootstrap ? '已声明（安装后自动写菜单）' : '未声明（需手工或 install.sql）' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="描述">
              <span class="plugin-install-wizard__desc">{{ installWizardPreview.description || '—' }}</span>
            </el-descriptions-item>
          </el-descriptions>
          <div v-if="installWizardPreview.dependencies?.length" class="mt-3">
            <div class="plugin-install-wizard__label">依赖插件</div>
            <el-table :data="installWizardPreview.dependencies" size="small" border stripe class="mt-1">
              <el-table-column prop="id" label="插件 ID" min-width="200" />
              <el-table-column prop="versionRange" label="版本区间" min-width="140" />
              <el-table-column label="可选" width="80">
                <template #default="{ row }">{{ row.optional === false ? '必选' : '可选' }}</template>
              </el-table-column>
            </el-table>
          </div>

          <el-divider content-position="left">联邦前端（META-INF/mms/web）</el-divider>
          <el-alert type="info" :closable="false" show-icon class="mb-3" title="与「管理端页面」联动的部分" />
          <p class="text-gray text-sm">
            插件 JAR 可内嵌联邦构建产物目录 <code>META-INF/mms/web</code>。安装并重载宿主后，静态资源随插件生效；路由等在
            <code>plugin.json</code> 的 <code>frontend</code> 中声明。
          </p>
        </template>
      </div>

      <!-- 2 安装执行 -->
      <div v-show="installWizardStep === 2" class="plugin-install-wizard__pane">
        <el-alert type="warning" :closable="false" show-icon title="即将执行安装" class="mb-3" />
        <p class="text-gray">
          将按上一步中的选项执行：<strong>建表（若勾选）</strong>、<strong>JAR 落盘与类加载</strong>、<strong>版本登记与全量重载</strong>；若插件声明
          <code>menuBootstrap</code> 或提供 <code>install.sql</code>，将同步 <strong>菜单与权限</strong>；若包含
          <code>META-INF/mms/web</code>，重载后 <strong>管理端联邦页面资源</strong> 一并生效。
        </p>
        <p v-if="installSourceType === 'local' && installWizardFile" class="text-sm text-gray mt-2">
          文件：<code>{{ installWizardFile.name }}</code>
        </p>
        <p v-else-if="installSourceType === 'url' && installRemoteUrl.trim()" class="text-sm text-gray mt-2">
          URL：<code class="plugin-install-wizard__code">{{ installRemoteUrl.trim() }}</code>
        </p>
      </div>

      <!-- 3 结果 + 健康 -->
      <div v-show="installWizardStep === 3" v-loading="installWizardHealthLoading" class="plugin-install-wizard__pane">
        <template v-if="installOutcome === 'success'">
          <el-result icon="success" title="安装成功" sub-title="宿主已重载插件；请在下表查看健康状态。" />
        </template>
        <template v-else-if="installOutcome === 'failure'">
          <el-result icon="error" title="安装失败" sub-title="请根据接口提示或后端日志排查后重试。" />
        </template>
        <template v-else>
          <el-empty description="尚未执行安装" :image-size="72" />
        </template>

        <template v-if="installWizardSchemaLog.length && installOutcome === 'success'">
          <div class="plugin-install-wizard__label mt-3">本次 DDL 执行日志</div>
          <pre class="plugin-detail__pre plugin-install-wizard__log">{{ installWizardSchemaLog.join('\n') }}</pre>
        </template>

        <div class="plugin-install-wizard__label mt-3">健康检测（当前实例中与插件 ID 匹配）</div>
        <p class="text-gray text-sm mb-2">插件 ID：{{ resolvedPluginIdForHealth || '—' }}</p>
        <el-empty
          v-if="!installWizardHealthRows.length && !installWizardHealthLoading && installOutcome"
          description="暂无健康数据（可能尚未 LOADED 或无 PluginHealthContributor）"
        />
        <el-table v-else-if="installWizardHealthRows.length" :data="installWizardHealthRows" size="small" border stripe>
          <el-table-column prop="pluginId" label="插件" width="200" />
          <el-table-column prop="version" label="版本" width="120" />
          <el-table-column prop="state" label="状态" width="100" />
          <el-table-column prop="body" label="详情" min-width="240" show-overflow-tooltip />
        </el-table>
      </div>

      <div class="plugin-install-wizard__footer">
        <el-button v-if="variant === 'page' && installWizardStep >= 1" @click="reset">重新开始</el-button>
        <el-button @click="onCancel">{{ installWizardStep >= 3 ? '关闭' : '取消' }}</el-button>
        <el-button
          v-if="installWizardStep > 0 && installWizardStep < 3"
          :disabled="installWizardInstalling"
          @click="wizardPrev"
        >
          上一步
        </el-button>
        <el-button v-if="installWizardStep < 2" type="primary" :disabled="!canWizardNext" @click="wizardNext">下一步</el-button>
        <el-button
          v-if="installWizardStep === 2"
          type="primary"
          :loading="installWizardInstalling"
          :disabled="!canStartWizardInstall"
          @click="runWizardInstall"
        >
          开始安装
        </el-button>
        <el-button v-if="installWizardStep === 3" type="primary" @click="onDone">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PluginUsageAgreementContent from './PluginUsageAgreementContent.vue';
import {
  fetchPluginHostHealth,
  fetchPluginInstallReadiness,
  installPluginFromUrl,
  installPluginJar,
  previewBundledPluginSchema,
} from '../api';

const props = withDefaults(
  defineProps<{
    /** dialog：随插件市场弹窗；page：独立全屏页 */
    variant?: 'dialog' | 'page';
    /** 是否在“安装加载”步骤显示并强制勾选协议 */
    requireAgreementAtInstallStep?: boolean;
    /** 由 PluginInstallUnifiedFlow 嵌套时：不再展示本组件自带的「选 JAR」引导页 */
    embeddedInUnifiedFlow?: boolean;
  }>(),
  { variant: 'dialog', requireAgreementAtInstallStep: true, embeddedInUnifiedFlow: false }
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'installed'): void;
}>();

const router = useRouter();

const installSchemaWizardLoading = ref(false);
const installWizardInstalling = ref(false);
const installSchemaWizardError = ref('');
const installWizardStep = ref(0);
const installWizardReadiness = ref<any>(null);
const installWizardPreview = ref<any>(null);
const installWizardRunSchema = ref(false);
const installWizardSchemaLog = ref<string[]>([]);
const installWizardHealthRows = ref<any[]>([]);
const installWizardHealthLoading = ref(false);
const installWizardFile = ref<File | null>(null);
const installSourceType = ref<'local' | 'url'>('local');
const installRemoteUrl = ref('');
const pluginUsageAgreementAccepted = ref(false);

/** 安装接口返回或预览中的插件 ID，用于健康过滤 */
const installResolvedPluginId = ref<string | null>(null);
const installOutcome = ref<'success' | 'failure' | null>(null);

const resolvedPluginIdForHealth = computed(
  () => installResolvedPluginId.value ?? installWizardPreview.value?.pluginId ?? null
);

/** el-steps 的 active 必须为 number；最后一步在结果页用 status 强制高亮（成功/失败/进行中） */
const stepsActiveIndex = computed(() => {
  const n = Number(installWizardStep.value);
  if (Number.isNaN(n)) {
    return 0;
  }
  return Math.min(Math.max(n, 0), 3);
});

const installResultStepStatus = computed(() => {
  if (installWizardStep.value !== 3) {
    return undefined;
  }
  if (installOutcome.value === 'success') {
    return 'success' as const;
  }
  if (installOutcome.value === 'failure') {
    return 'error' as const;
  }
  return 'process' as const;
});

const canWizardNext = computed(() => {
  if (installSchemaWizardError.value) {
    return false;
  }
  if (installWizardStep.value === 0) {
    return pluginUsageAgreementAccepted.value;
  }
  if (installWizardStep.value === 1) {
    if (installSourceType.value === 'local') {
      if (!installWizardFile.value) {
        return false;
      }
    } else if (!installRemoteUrl.value.trim()) {
      return false;
    }
    if (!installWizardReadiness.value) {
      return false;
    }
    const r = installWizardReadiness.value;
    return !!(r.pluginsRootReady && r.jdbcAvailable && r.pluginDbBridgeAvailable);
  }
  return true;
});

const canStartWizardInstall = computed(
  () =>
    !installSchemaWizardError.value &&
    !!installWizardReadiness.value?.pluginsRootReady &&
    !!installWizardReadiness.value?.jdbcAvailable &&
    !!installWizardReadiness.value?.pluginDbBridgeAvailable &&
    pluginUsageAgreementAccepted.value
);

const stepMetas = [
  { title: '插件协议', description: '阅读并同意《插件使用协议》' },
  { title: '上传与预览', description: '选择 JAR 或 URL，查看环境与包内容' },
  { title: '安装插件', description: '建表、加载、菜单权限与联邦页面' },
  { title: '安装结果', description: '结果与健康探针' },
] as const;

const currentStepMeta = computed(() => stepMetas[installWizardStep.value] ?? stepMetas[0]);

function reset() {
  installWizardFile.value = null;
  installWizardPreview.value = null;
  installWizardReadiness.value = null;
  installWizardStep.value = 0;
  installWizardRunSchema.value = false;
  installWizardSchemaLog.value = [];
  installWizardHealthRows.value = [];
  installSchemaWizardError.value = '';
  pluginUsageAgreementAccepted.value = false;
  installSourceType.value = 'local';
  installRemoteUrl.value = '';
  installResolvedPluginId.value = null;
  installOutcome.value = null;
}

async function loadInstallReadiness() {
  const res: any = await fetchPluginInstallReadiness();
  installWizardReadiness.value = res?.data ?? null;
}

async function startWithFile(file: File) {
  installWizardFile.value = file;
  installSourceType.value = 'local';
  installRemoteUrl.value = '';
  installWizardStep.value = 0;
  installWizardPreview.value = null;
  installWizardReadiness.value = null;
  installWizardRunSchema.value = false;
  installWizardSchemaLog.value = [];
  installWizardHealthRows.value = [];
  installSchemaWizardError.value = '';
  pluginUsageAgreementAccepted.value = false;
  installResolvedPluginId.value = null;
  installOutcome.value = null;
}

async function onPagePickJar(opt: UploadRequestOptions) {
  const file = opt.file as File;
  installWizardFile.value = file;
  installWizardPreview.value = null;
  installWizardReadiness.value = null;
  installSchemaWizardError.value = '';
  installResolvedPluginId.value = null;
  installOutcome.value = null;
  await prepareByFile(file);
}

function onInstallSourceTypeChange() {
  installWizardReadiness.value = null;
  installWizardPreview.value = null;
  installSchemaWizardError.value = '';
  installResolvedPluginId.value = null;
  installOutcome.value = null;
}

function onRemoteUrlChange() {
  installWizardReadiness.value = null;
}

async function onUrlLoadEnv() {
  const u = installRemoteUrl.value.trim();
  if (!u) {
    ElMessage.warning('请输入 URL');
    return;
  }
  installSchemaWizardLoading.value = true;
  try {
    await loadInstallReadiness();
    installWizardPreview.value = null;
    installSchemaWizardError.value = '';
  } finally {
    installSchemaWizardLoading.value = false;
  }
}

function wizardPrev() {
  if (installWizardStep.value <= 0) {
    return;
  }
  if (installWizardStep.value >= 3) {
    installOutcome.value = null;
    installWizardHealthRows.value = [];
    installResolvedPluginId.value = null;
  }
  if (installWizardStep.value === 1) {
    installWizardReadiness.value = null;
    installWizardPreview.value = null;
    installSchemaWizardError.value = '';
  }
  installWizardStep.value--;
}

async function prepareByFile(file: File) {
  installSchemaWizardLoading.value = true;
  try {
    await Promise.all([
      loadInstallReadiness(),
      (async () => {
        const res: any = await previewBundledPluginSchema(file);
        installWizardPreview.value = res?.data ?? null;
      })(),
    ]);
    installSchemaWizardError.value = '';
  } catch {
    installWizardReadiness.value = null;
    installWizardPreview.value = null;
    installSchemaWizardError.value = '无法读取安装前置信息（请查看接口提示）';
  } finally {
    installSchemaWizardLoading.value = false;
  }
}

async function wizardNext() {
  if (installSchemaWizardError.value) {
    return;
  }
  if (installWizardStep.value === 0) {
    installWizardStep.value = 1;
    if (installSourceType.value === 'local' && installWizardFile.value && !installWizardReadiness.value) {
      await prepareByFile(installWizardFile.value);
    }
    return;
  }
  if (installWizardStep.value === 1) {
    if (!installWizardReadiness.value) {
      if (installSourceType.value === 'local') {
        if (!installWizardFile.value) {
          ElMessage.warning('请先选择插件 JAR 文件');
          return;
        }
        await prepareByFile(installWizardFile.value);
      } else {
        await onUrlLoadEnv();
      }
      if (!installWizardReadiness.value) {
        return;
      }
    }
    if (!installWizardReadiness.value?.pluginsRootReady) {
      ElMessage.warning('插件根目录不可用');
      return;
    }
    if (!installWizardReadiness.value?.jdbcAvailable) {
      ElMessage.warning('数据源不可用，无法完成安装登记');
      return;
    }
    if (!installWizardReadiness.value?.pluginDbBridgeAvailable) {
      ElMessage.warning('插件库表桥接不可用，无法写入版本与菜单');
      return;
    }
    if (
      installWizardPreview.value?.hasSchema &&
      installWizardRunSchema.value &&
      !installWizardPreview.value?.bundledSchemaExecutorAvailable
    ) {
      ElMessage.warning('当前无法自动执行 DDL：请关闭「执行建表」或先在库中手工执行 schema.sql');
      return;
    }
  }
  installWizardStep.value++;
}

function pickPluginIdFromInstallResponse(res: any): string | null {
  const d = res?.data;
  if (!d || typeof d !== 'object') {
    return null;
  }
  const id = d.pluginId ?? d.plugin_id ?? d.id;
  if (id != null && String(id).length) {
    return String(id);
  }
  const inner = d.data;
  if (inner && typeof inner === 'object') {
    const id2 = inner.pluginId ?? inner.plugin_id;
    if (id2 != null && String(id2).length) {
      return String(id2);
    }
  }
  return null;
}

async function loadWizardHealth() {
  const pid = resolvedPluginIdForHealth.value;
  if (!pid) {
    installWizardHealthRows.value = [];
    return;
  }
  installWizardHealthLoading.value = true;
  try {
    const res: any = await fetchPluginHostHealth();
    const rows = res?.data ?? res;
    const list = Array.isArray(rows) ? rows : [];
    installWizardHealthRows.value = list.filter((r: any) => r && String(r.pluginId ?? '') === String(pid));
  } finally {
    installWizardHealthLoading.value = false;
  }
}

async function runWizardInstall() {
  const skipSchema = !installWizardRunSchema.value;
  installWizardInstalling.value = true;
  installOutcome.value = null;
  const loading = ElLoading.service({
    lock: true,
    text: '正在上传并安装…',
    background: 'rgba(0, 0, 0, 0.35)',
  });
  try {
    let res: any = null;
    if (installSourceType.value === 'local') {
      const file = installWizardFile.value;
      if (!file) {
        ElMessage.warning('请先选择插件 JAR 文件');
        return;
      }
      res = await installPluginJar(file, {
        skipBundledSchemaExecution: skipSchema,
        onUploadProgress: (evt) => {
          const { loaded, total } = evt;
          if (total && total > 0) {
            const pct = Math.min(100, Math.round((loaded * 100) / total));
            loading.setText(
              pct >= 100 ? '上传完成，正在校验、执行 DDL（若开启）与安装…' : `正在上传 ${pct}%…`
            );
          }
        },
      });
    } else {
      const u = installRemoteUrl.value.trim();
      if (!u) {
        ElMessage.warning('请输入 URL');
        return;
      }
      loading.setText('正在从 URL 下载并安装…');
      res = await installPluginFromUrl(u);
    }
    const log = res?.data?.bundledSchemaExecutionLog;
    installWizardSchemaLog.value = Array.isArray(log) ? log : [];
    installResolvedPluginId.value =
      pickPluginIdFromInstallResponse(res) ?? (installWizardPreview.value?.pluginId != null ? String(installWizardPreview.value.pluginId) : null);
    installOutcome.value = 'success';
    installWizardStep.value = 3;
    ElMessage.success(props.variant === 'page' ? '安装完成，可返回插件市场查看卡片状态' : '安装完成');
    emit('installed');
    await loadWizardHealth();
  } catch {
    installResolvedPluginId.value =
      installWizardPreview.value?.pluginId != null ? String(installWizardPreview.value.pluginId) : null;
    installOutcome.value = 'failure';
    installWizardSchemaLog.value = [];
    installWizardStep.value = 3;
    await loadWizardHealth();
  } finally {
    loading.close();
    installWizardInstalling.value = false;
  }
}

function onCancel() {
  if (props.variant === 'page') {
    router.push('/system/pluginMarket');
    return;
  }
  emit('close');
}

function onDone() {
  if (props.variant === 'page') {
    router.push('/system/pluginMarket');
  } else {
    emit('close');
  }
}

defineExpose({ startWithFile, reset });
</script>

<style scoped>
.plugin-install-wizard__boot {
  min-height: 160px;
}
.plugin-install-wizard__agreement-scroll {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-lighter);
  max-height: 280px;
  overflow: auto;
}
.plugin-install-wizard-root__intro {
  max-width: 720px;
}
.plugin-install-wizard-root__intro .mt-2 {
  margin-top: 8px;
}
.plugin-install-wizard-root__intro p {
  margin: 0 0 16px;
  line-height: 1.6;
  font-size: 14px;
}
.plugin-install-wizard__footer {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
.plugin-install-wizard__steps {
  margin-bottom: 12px;
  padding: 14px 14px 8px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background: var(--el-fill-color-extra-light);
}
.plugin-install-wizard__step-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  padding: 0 2px;
}
.plugin-install-wizard__step-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 16px;
  color: var(--el-text-color-primary);
}
.plugin-install-wizard__step-index {
  font-size: 12px;
  line-height: 1;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 999px;
  padding: 3px 8px;
}
.plugin-install-wizard__step-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.plugin-install-wizard__pane {
  min-height: 220px;
  padding: 14px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background: var(--el-bg-color);
  box-shadow: 0 1px 2px rgb(0 0 0 / 2%);
}
.plugin-install-wizard__pane--preview {
  max-height: min(58vh, 620px);
  overflow: auto;
}
.plugin-install-wizard__section-title {
  font-weight: 600;
  font-size: 14px;
  margin: 4px 0 10px;
  color: var(--el-text-color-primary);
}
.plugin-install-wizard__source-layout {
  display: grid;
  grid-template-columns: minmax(340px, 1.1fr) minmax(280px, 0.9fr);
  gap: 14px;
}
.plugin-install-wizard__source-main,
.plugin-install-wizard__source-side {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-fill-color-extra-light);
  padding: 12px;
}
.plugin-install-wizard__source-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.plugin-install-wizard__source-panel {
  margin-top: 18px;
}
.plugin-install-wizard__source-action {
  margin-top: 14px;
}
.text-xs {
  font-size: 12px;
}
.plugin-install-wizard__source-tabs {
  margin-bottom: 4px;
}
:deep(.plugin-install-wizard__source-tabs .el-tabs__header) {
  margin: 0;
}
:deep(.plugin-install-wizard__source-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.plugin-install-wizard__source-tabs .el-tabs__item) {
  height: 42px;
  line-height: 42px;
  padding: 0 18px;
}
:deep(.plugin-install-wizard__source-tabs .el-tabs__content) {
  display: none;
}
.plugin-install-wizard__code {
  word-break: break-all;
  font-size: 12px;
}
.plugin-install-wizard__sql {
  max-height: 280px;
  overflow: auto;
  font-size: 12px;
  margin: 0;
}
.plugin-install-wizard__log {
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  margin-top: 8px;
}
.plugin-install-wizard__label {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
}
.plugin-install-wizard__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--el-fill-color-extra-light);
}
.plugin-install-wizard__desc {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.5;
}
.plugin-detail__pre {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  font-size: 12px;
  overflow: auto;
  max-height: min(48vh, 360px);
}
:deep(.plugin-install-wizard__pane .el-alert) {
  margin-bottom: 12px;
}
:deep(.plugin-install-wizard__pane .el-descriptions),
:deep(.plugin-install-wizard__pane .el-table),
:deep(.plugin-install-wizard__pane .el-empty) {
  margin-top: 6px;
}
:deep(.plugin-install-wizard__pane .el-checkbox) {
  margin-top: 12px;
}
/* 缩小 steps 圆圈中的数字/图标，避免视觉过重 */
:deep(.plugin-install-wizard__steps .el-step__icon) {
  width: 34px;
  height: 34px;
}
:deep(.plugin-install-wizard__steps .el-step__icon-inner) {
  font-size: 12px;
  font-weight: 500;
}
/* 连线也略细一点，和小图标更协调 */
:deep(.plugin-install-wizard__steps .el-step__line-inner) {
  border-width: 1px !important;
}
@media (max-width: 960px) {
  .plugin-install-wizard__source-layout {
    grid-template-columns: 1fr;
  }
}
</style>
