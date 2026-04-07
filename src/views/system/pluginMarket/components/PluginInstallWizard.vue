<template>
  <div class="plugin-install-wizard-root">
    <!-- 弹窗：父级打开后一帧内尚未注入 file，避免空白闪屏 -->
    <div v-if="variant === 'dialog' && !installWizardFile" v-loading="true" class="plugin-install-wizard__boot" />
    <!-- 全屏页：未选 JAR 时先选包 -->
    <div v-else-if="variant === 'page' && !installWizardFile" class="plugin-install-wizard-root__intro">
      <p class="text-gray">
        在此页按步骤完成<strong>环境检测</strong>、<strong>建表 DDL</strong>、<strong>插件信息</strong>、<strong>联邦前端</strong>、<strong>安装加载</strong>与<strong>健康检查</strong>。
        若插件随 JAR 打包了联邦前端静态资源（<code>META-INF/mms/web</code>），安装并重载后即可由管理端按
        <code>plugin.json</code> 的 <code>frontend</code> 声明挂载路由；构建参见项目内 mms-plugin 技能说明。
      </p>
      <p class="text-gray mt-2">
        安装前请阅读
        <el-button link type="primary" @click="router.push('/system/pluginUsageAgreement')">《插件使用协议》</el-button>
        ；在「安装加载」步骤须勾选同意后方可执行安装。
      </p>
      <el-upload :show-file-list="false" accept=".jar" :http-request="onPagePickJar">
        <el-button type="primary">选择插件 JAR 开始</el-button>
      </el-upload>
    </div>

    <div
      v-else
      v-loading="installSchemaWizardLoading"
      class="plugin-install-wizard"
    >
      <el-steps :active="installWizardStep" finish-status="success" align-center class="plugin-install-wizard__steps">
        <el-step title="环境检测" description="数据源与宿主" />
        <el-step title="建表 DDL" description="schema.sql" />
        <el-step title="插件信息" description="plugin.json" />
        <el-step title="联邦前端" description="META-INF/mms/web" />
        <el-step title="安装加载" description="落盘并重载" />
        <el-step title="权限菜单" description="sys_function" />
        <el-step title="健康检查" description="探针" />
      </el-steps>

      <p v-if="installSchemaWizardError" class="text-danger mt-3">{{ installSchemaWizardError }}</p>

      <!-- 0 环境检测 -->
      <div v-show="installWizardStep === 0 && !installSchemaWizardError" class="plugin-install-wizard__pane">
        <el-descriptions v-if="installWizardReadiness" :column="1" border size="small">
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
          v-if="installWizardReadiness && !installWizardReadiness.pluginsRootReady"
          type="error"
          :closable="false"
          show-icon
          class="mt-3"
          title="插件根目录不可用，无法安装。请修正 mms.plugin.root-dir 或创建目录后再试。"
        />
      </div>

      <!-- 1 schema -->
      <div v-show="installWizardStep === 1 && installWizardPreview" class="plugin-install-wizard__pane">
        <el-alert
          v-if="installWizardPreview.hasSchema && installWizardPreview.bundledSchemaExecutorAvailable === false"
          type="warning"
          :closable="false"
          show-icon
          class="mb-3"
          title="当前环境无法自动执行 DDL：请先在库中手工执行 schema.sql，并在下一步安装时选择「跳过建表」。"
        />
        <div class="plugin-install-wizard__row mb-3">
          <span class="text-gray">安装时执行建表（META-INF/mms/schema.sql）</span>
          <el-switch
            v-model="installWizardRunSchema"
            :disabled="!installWizardPreview.hasSchema || !installWizardPreview.bundledSchemaExecutorAvailable"
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
      </div>

      <!-- 2 插件信息 -->
      <div v-show="installWizardStep === 2 && installWizardPreview" class="plugin-install-wizard__pane">
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
      </div>

      <!-- 3 联邦前端 -->
      <div v-show="installWizardStep === 3 && installWizardPreview" class="plugin-install-wizard__pane">
        <el-alert type="info" :closable="false" show-icon class="mb-3" title="与「管理端页面」联动的部分" />
        <p class="text-gray text-sm">
          插件 JAR 可内嵌联邦构建产物目录 <code>META-INF/mms/web</code>（通常由 <code>mms-ui</code> 的
          <code>fed:plugin-ui:build</code> 与插件模块 <code>mvn -Pfed-web</code> 打入）。<strong>安装本 JAR 并重载宿主后</strong>，这些静态资源随插件一起生效，无需再单独部署前端文件；路由前缀等在
          <code>plugin.json</code> 的 <code>frontend</code> 中声明。
        </p>
        <p class="text-gray text-sm mt-2">
          若当前包未包含该目录，仅表示本插件未提供联邦 UI，不影响后端安装；需要页面时请按插件仓库 README 或 mms-plugin 技能文档补打包后再上传安装。
        </p>
      </div>

      <!-- 4 安装加载 -->
      <div v-show="installWizardStep === 4" class="plugin-install-wizard__pane">
        <p class="text-gray">
          将上传 JAR、按第二步选项执行 DDL（若勾选）、写入插件目录、登记版本、<strong>全量重载</strong>以加载插件。
        </p>
        <p v-if="installWizardFile" class="text-sm text-gray mt-2">
          文件：<code>{{ installWizardFile.name }}</code>
        </p>
        <div class="plugin-install-wizard__agreement mt-3">
          <el-checkbox v-model="pluginUsageAgreementAccepted">
            我已阅读并同意
            <router-link
              class="plugin-install-wizard__agreement-link"
              :to="{ path: '/system/pluginUsageAgreement' }"
              target="_blank"
              @click.stop
            >
              《插件使用协议》
            </router-link>
          </el-checkbox>
        </div>
      </div>

      <!-- 5 权限菜单 -->
      <div v-show="installWizardStep === 5" class="plugin-install-wizard__pane">
        <el-result icon="success" title="安装与重载已完成" sub-title="权限与菜单由宿主按 plugin.json 处理。" />
        <p class="text-gray text-sm">
          若插件声明了 <code>menuBootstrap</code>，安装时已向 <code>sys_function</code> 写入菜单（<code>remark=plugin:插件ID</code>）并参与角色授权；未声明时需使用仓库中的
          <code>script/install.sql</code> 或手工配置菜单。
        </p>
        <template v-if="installWizardSchemaLog.length">
          <div class="plugin-install-wizard__label mt-3">本次 DDL 执行日志</div>
          <pre class="plugin-detail__pre plugin-install-wizard__log">{{ installWizardSchemaLog.join('\n') }}</pre>
        </template>
      </div>

      <!-- 6 健康 -->
      <div v-show="installWizardStep === 6" v-loading="installWizardHealthLoading" class="plugin-install-wizard__pane">
        <p class="text-gray text-sm mb-2">以下为当前已加载实例中，与本插件 ID 匹配的健康探针结果。</p>
        <el-empty
          v-if="!installWizardHealthRows.length && !installWizardHealthLoading"
          description="暂无健康数据（可能尚未 LOADED 或无 PluginHealthContributor）"
        />
        <el-table v-else :data="installWizardHealthRows" size="small" border stripe>
          <el-table-column prop="pluginId" label="插件" width="200" />
          <el-table-column prop="version" label="版本" width="120" />
          <el-table-column prop="state" label="状态" width="100" />
          <el-table-column prop="body" label="详情" min-width="240" show-overflow-tooltip />
        </el-table>
      </div>

      <div class="plugin-install-wizard__footer">
        <el-button v-if="variant === 'page' && installWizardFile" @click="reset">重新选择 JAR</el-button>
        <el-button @click="onCancel">{{ installWizardStep >= 5 ? '关闭' : '取消' }}</el-button>
        <el-button
          v-if="installWizardStep > 0 && installWizardStep < 5"
          :disabled="installWizardInstalling"
          @click="wizardPrev"
        >
          上一步
        </el-button>
        <el-button
          v-if="installWizardStep < 4"
          type="primary"
          :disabled="!canWizardNext"
          @click="wizardNext"
        >
          下一步
        </el-button>
        <el-button
          v-if="installWizardStep === 4"
          type="primary"
          :loading="installWizardInstalling"
          :disabled="!canStartWizardInstall"
          @click="runWizardInstall"
        >
          开始安装
        </el-button>
        <el-button v-if="installWizardStep === 5" type="primary" @click="wizardNext">下一步：健康检查</el-button>
        <el-button v-if="installWizardStep === 6" type="primary" @click="onDone">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  fetchPluginHostHealth,
  fetchPluginInstallReadiness,
  installPluginJar,
  previewBundledPluginSchema,
} from '../api';

const props = withDefaults(
  defineProps<{
    /** dialog：随插件市场弹窗；page：独立全屏页 */
    variant?: 'dialog' | 'page';
  }>(),
  { variant: 'dialog' }
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
/** 安装加载步骤须勾选，与《插件使用协议》一致 */
const pluginUsageAgreementAccepted = ref(false);

const canWizardNext = computed(() => {
  if (installSchemaWizardError.value) {
    return false;
  }
  if (installWizardStep.value !== 0) {
    return true;
  }
  const r = installWizardReadiness.value;
  if (!r) {
    return false;
  }
  return !!(r.pluginsRootReady && r.jdbcAvailable && r.pluginDbBridgeAvailable);
});

const canStartWizardInstall = computed(
  () =>
    !installSchemaWizardError.value &&
    !!installWizardReadiness.value?.pluginsRootReady &&
    pluginUsageAgreementAccepted.value
);

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
}

async function loadInstallReadiness() {
  const res: any = await fetchPluginInstallReadiness();
  installWizardReadiness.value = res?.data ?? null;
}

async function startWithFile(file: File) {
  installWizardFile.value = file;
  installWizardStep.value = 0;
  installWizardPreview.value = null;
  installWizardReadiness.value = null;
  installWizardRunSchema.value = false;
  installWizardSchemaLog.value = [];
  installWizardHealthRows.value = [];
  installSchemaWizardError.value = '';
  pluginUsageAgreementAccepted.value = false;
  installSchemaWizardLoading.value = true;
  try {
    await Promise.all([
      loadInstallReadiness(),
      (async () => {
        const res: any = await previewBundledPluginSchema(file);
        installWizardPreview.value = res?.data ?? null;
      })(),
    ]);
  } catch {
    // 并行请求其一失败时，另一项可能已写入状态；若不清理，步骤 0 仍可能「下一步」进入空步骤
    installWizardReadiness.value = null;
    installWizardPreview.value = null;
    installSchemaWizardError.value = '无法读取安装前置信息（请查看接口提示）';
  } finally {
    installSchemaWizardLoading.value = false;
  }
}

function onPagePickJar(opt: UploadRequestOptions) {
  startWithFile(opt.file as File);
}

function wizardPrev() {
  if (installWizardStep.value <= 0 || installWizardStep.value >= 5) {
    return;
  }
  installWizardStep.value--;
}

async function wizardNext() {
  if (installSchemaWizardError.value) {
    return;
  }
  if (installWizardStep.value === 0) {
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
  }
  if (installWizardStep.value === 1) {
    if (
      installWizardPreview.value?.hasSchema &&
      installWizardRunSchema.value &&
      !installWizardPreview.value?.bundledSchemaExecutorAvailable
    ) {
      ElMessage.warning('当前无法自动执行 DDL：请关闭「执行建表」或先在库中手工执行 schema.sql');
      return;
    }
  }
  if (installWizardStep.value === 5) {
    installWizardStep.value = 6;
    await loadWizardHealth();
    return;
  }
  installWizardStep.value++;
}

async function loadWizardHealth() {
  const pid = installWizardPreview.value?.pluginId;
  if (!pid) {
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
  const file = installWizardFile.value;
  if (!file) {
    return;
  }
  if (!pluginUsageAgreementAccepted.value) {
    ElMessage.warning('请先阅读并勾选同意《插件使用协议》');
    return;
  }
  const skipSchema = !installWizardRunSchema.value;
  installWizardInstalling.value = true;
  const loading = ElLoading.service({
    lock: true,
    text: '正在上传并安装…',
    background: 'rgba(0, 0, 0, 0.35)',
  });
  try {
    const res: any = await installPluginJar(file, {
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
    const log = res?.data?.bundledSchemaExecutionLog;
    installWizardSchemaLog.value = Array.isArray(log) ? log : [];
    installWizardStep.value = 5;
    ElMessage.success(
      props.variant === 'page' ? '安装完成，可返回插件市场查看卡片状态' : '安装完成'
    );
    emit('installed');
  } catch {
    /* 拦截器已提示 */
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
.plugin-install-wizard__agreement {
  padding: 8px 0 0;
}
.plugin-install-wizard__agreement-link {
  color: var(--el-color-primary);
  text-decoration: none;
}
.plugin-install-wizard__agreement-link:hover {
  text-decoration: underline;
}
.plugin-install-wizard__boot {
  min-height: 160px;
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
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.plugin-install-wizard__steps {
  margin-bottom: 20px;
}
.plugin-install-wizard__pane {
  min-height: 180px;
  padding: 4px 0 12px;
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
}
.plugin-install-wizard__desc {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.5;
}
/* 与插件市场详情弹窗内 pre 块一致（原在 index.vue scoped，组件抽离后需自带） */
.plugin-detail__pre {
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  font-size: 12px;
  overflow: auto;
  max-height: min(48vh, 360px);
}
</style>
