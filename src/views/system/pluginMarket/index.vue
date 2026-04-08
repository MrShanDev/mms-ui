<template>
  <div class="plugin-market layout-padding layout-padding-auto">
    <div class="plugin-market__hero">
      <div>
        <h2 class="plugin-market__title">插件市场</h2>
        <p class="plugin-market__subtitle">
          <strong>安装</strong>：校验 JAR 内 <code>plugin.json</code> 与宿主版本；通过后写入磁盘并登记版本、激活，再全量重载。
          <strong>停用</strong>（运行中）：只取消库表中的<strong>激活</strong>标记并重载，插件不再加载；<em>不删磁盘</em>、不移除市场卡片，可在详情里切换版本再激活或覆盖上传。
          <strong>删除/彻底卸载</strong>：删除<strong>磁盘</strong>上该插件全部安装目录，并移除<strong>库表</strong>中的版本与市场登记（<code>sys_plugin_version</code> / <code>sys_plugins</code>）后重载；运行中也可使用（服务端先卸载再删盘）。等同于彻底下架并清盘。
          <strong>仅清库表</strong>（未安装磁盘时）：仍可用详情中的「删除库表登记」，只删登记、不动磁盘（若盘上无文件则与删除效果一致）。
          <strong>日志</strong>：运行控制区或详情中打开「日志」可查看独立日志文件尾部（默认 <code>logs/plugins/</code><em>插件ID@版本</em><code>.log</code>，仅含插件 MDC 下 INFO 及以上条目）。
          点击卡片<strong>封面图</strong>打开完整信息；回切激活版本与维护参数均在「插件配置」页签中完成。
        </p>
        <p v-if="statusBody" class="plugin-market__meta text-gray">
          宿主启用：<b :class="statusBody.enabled ? 'text-success' : 'text-warning'">{{
            statusBody.enabled ? '是' : '否'
          }}</b>
          · MMS 版本：<b>{{ statusBody.hostMmsRevision ?? '—' }}</b>
          <template v-if="pluginRootConfigDiffers">
            · 读盘路径（与启动日志「跳过加载」同源）：<code class="plugin-market__code">{{
              statusBody.resolvedPluginsRoot || '—'
            }}</code>
            · <code>mms.plugin.root-dir</code>：<code class="plugin-market__code text-warning">{{
              statusBody.rootDir || '—'
            }}</code>
            <span class="plugin-market__root-hint text-warning">
              （不一致时请核对 MMS_PLUGIN_ROOT_DIR / 是否连错后端实例）
            </span>
          </template>
          <template v-else>
            · 插件根目录：<code class="plugin-market__code">{{
              statusBody.resolvedPluginsRoot || statusBody.rootDir || '—'
            }}</code>
            <span class="plugin-market__root-hint">（读盘与配置相同；与日志中「跳过加载」路径一致）</span>
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
        <el-button type="success" @click="openInstallWizardDialog">安装插件</el-button>
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
              v-if="resolvePluginMarketIconUrl(row.iconUrl)"
              :src="resolvePluginMarketIconUrl(row.iconUrl)"
              fit="contain"
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
      width="720px"
      destroy-on-close
      class="plugin-detail-dialog"
    >
      <template v-if="detail">
        <el-tabs v-model="detailActiveTab" class="plugin-detail-tabs">
          <el-tab-pane label="概览" name="overview">
            <div class="plugin-detail__summary plugin-detail__tab-body">
              <div class="plugin-detail__summary-row">
                <span class="plugin-detail__summary-k">插件名称：</span>
                <span class="plugin-detail__summary-v">{{ detail.name || '—' }}</span>
              </div>
              <div class="plugin-detail__summary-row">
                <span class="plugin-detail__summary-k">插件简介：</span>
                <span class="plugin-detail__summary-v">{{
                  (detail.manifest?.description && String(detail.manifest.description).trim()) || '—'
                }}</span>
              </div>
              <div class="plugin-detail__summary-row plugin-detail__summary-row--block">
                <span class="plugin-detail__summary-k">插件详情：</span>
                <p class="plugin-detail__summary-detail">{{ detail.description || '—' }}</p>
              </div>
            </div>
            <el-descriptions :column="1" border size="small" class="mt-3">
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
                <template
                  v-else-if="detail.subprocessTcpPortAppearsBound === false && detail.subprocessPort != null"
                >
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
              class="mt-3 mb-0"
              title="当前为「仅重载目标插件」模式"
            >
              切换激活版本<strong>不会</strong>按全局依赖拓扑重载其它插件；若插件之间存在 dependencies，可能出现未加载依赖。请改用配置
              <code>FULL</code>
              或使用页顶「全量重载」。说明见仓库
              <code>version/v2.0.5-插件子进程Peer契约与激活重载边界.md</code>
              §5。
            </el-alert>
            <p v-if="detail.runtimeState === 'NOT_INSTALLED'" class="plugin-detail__hint mt-3 mb-0">
              当前为<strong>未安装</strong>：请使用页面顶部上传与该插件 ID 匹配的 JAR；服务端会先校验再通过再入库。
            </p>
          </el-tab-pane>
          <el-tab-pane label="插件配置" name="sysConfig" lazy>
            <div v-loading="pluginSysConfigLoading" class="plugin-sys-config">
              <template v-if="detail.recordedVersions?.length > 0">
                <div class="plugin-sys-config__rollback plugin-detail__tab-body">
                  <div class="plugin-sys-config__section-title">回切版本</div>
                  <div class="plugin-detail__rollback">
                    <span class="mr-2">选择版本（磁盘上需已有对应目录）</span>
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
                </div>
              </template>
              <div class="plugin-sys-config__params plugin-detail__tab-body">
                <div class="plugin-sys-config__section-title">
                  参数配置
                  <template v-if="!pluginSysConfigLoading && pluginSysConfigItems.length > 0">
                    <span class="plugin-sys-config__section-count">
                      （{{ pluginSysConfigItems.length }} 项）
                    </span>
                  </template>
                </div>
                <el-empty
                  v-if="!pluginSysConfigLoading && pluginSysConfigItems.length === 0"
                  :description="pluginSysConfigEmptyDescription"
                />
                <template v-else>
                  <el-form
                    class="plugin-sys-config-form"
                    label-position="top"
                    size="small"
                    @submit.prevent
                  >
                    <el-form-item
                      v-for="row in pluginSysConfigItems"
                      :key="row.keySuffix"
                      class="plugin-sys-config-form__item"
                      :label="row.configName"
                    >
                    <div class="plugin-sys-config-form__control">
                      <el-switch
                        v-if="row.valueType === 'switch'"
                        :model-value="String(row.configValue).toLowerCase() === 'true'"
                        size="small"
                        @update:model-value="
                          (v: boolean) => {
                            row.configValue = v ? 'true' : 'false';
                          }
                        "
                      />
                      <el-select
                        v-else-if="row.valueType === 'select'"
                        v-model="row.configValue"
                        filterable
                        clearable
                        size="small"
                        class="plugin-sys-config__control"
                      >
                        <el-option
                          v-for="(opt, idx) in row.options || []"
                          :key="idx"
                          :label="optionLabel(opt)"
                          :value="opt.value"
                        />
                      </el-select>
                      <el-select
                        v-else-if="row.valueType === 'multiselect'"
                        :model-value="parseMultiselectValues(row.configValue)"
                        multiple
                        filterable
                        clearable
                        size="small"
                        class="plugin-sys-config__control"
                        @update:model-value="
                          (v: string[]) => {
                            row.configValue = JSON.stringify(v ?? []);
                          }
                        "
                      >
                        <el-option
                          v-for="(opt, idx) in row.options || []"
                          :key="idx"
                          :label="optionLabel(opt)"
                          :value="opt.value"
                        />
                      </el-select>
                      <el-input-number
                        v-else-if="row.valueType === 'number'"
                        :model-value="toInputNumberModel(row.configValue)"
                        size="small"
                        class="plugin-sys-config__control"
                        controls-position="right"
                        @update:model-value="
                          (v: number | undefined) => {
                            row.configValue =
                              v == null || Number.isNaN(v) ? '' : String(v);
                          }
                        "
                      />
                      <el-color-picker
                        v-else-if="row.valueType === 'color'"
                        :model-value="row.configValue || null"
                        show-alpha
                        size="small"
                        @update:model-value="(v: string | null) => { row.configValue = v ?? '' }"
                      />
                      <el-date-picker
                        v-else-if="row.valueType === 'date'"
                        :model-value="row.configValue || null"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        size="small"
                        class="plugin-sys-config__control"
                        @update:model-value="(v: string | null) => { row.configValue = v ?? '' }"
                      />
                      <div
                        v-else-if="shouldUseListEditor(row) && pluginListDrafts[row.keySuffix]"
                        class="plugin-sys-config-list-editor"
                      >
                        <div
                          v-for="(_line, li) in pluginListDrafts[row.keySuffix]"
                          :key="`${row.keySuffix}-${li}`"
                          class="plugin-sys-config-list-editor__row"
                        >
                          <el-input
                            v-model="pluginListDrafts[row.keySuffix][li]"
                            size="small"
                            class="plugin-sys-config-list-editor__input"
                            :type="row.valueType === 'password' ? 'password' : 'text'"
                            :show-password="row.valueType === 'password'"
                            @input="() => flushListDraftToRow(row)"
                          />
                          <el-button
                            type="danger"
                            plain
                            circle
                            size="small"
                            :icon="Minus"
                            title="删除本条"
                            :disabled="(pluginListDrafts[row.keySuffix]?.length ?? 0) <= 1"
                            @click="removeListRow(row, li)"
                          />
                        </div>
                        <el-button
                          type="primary"
                          link
                          size="small"
                          :icon="Plus"
                          class="plugin-sys-config-list-editor__add"
                          @click="addListRow(row)"
                        >
                          添加一条
                        </el-button>
                      </div>
                      <el-input
                        v-else-if="row.valueType === 'password'"
                        v-model="row.configValue"
                        type="password"
                        show-password
                        size="small"
                      />
                      <el-input
                        v-else-if="row.valueType === 'textarea' || row.valueType === 'json'"
                        v-model="row.configValue"
                        type="textarea"
                        size="small"
                        class="plugin-sys-config__textarea"
                        :autosize="textareaAutosize(row)"
                      />
                      <el-input
                        v-else
                        v-model="row.configValue"
                        size="small"
                        class="plugin-sys-config__control"
                      />
                    </div>
                    </el-form-item>
                  </el-form>
                  <el-button
                    type="primary"
                    size="small"
                    class="plugin-sys-config-form__submit"
                    :loading="pluginSysConfigSaving"
                    :disabled="pluginSysConfigItems.length === 0"
                    @click="savePluginSysConfig"
                  >
                    保存配置
                  </el-button>
                </template>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="detail.runtimeState === 'LOADED'" label="健康检查" name="health" lazy>
            <div class="plugin-health-check plugin-detail__tab-body">
              <div class="plugin-health-check__actions">
                <el-button
                  type="primary"
                  circle
                  size="large"
                  class="plugin-health-check__run-btn"
                  :loading="healthCheckRunning"
                  :disabled="healthCheckRunning"
                  title="立即检测"
                  @click="runPluginHealthCheck"
                >
                  <el-icon v-if="!healthCheckRunning" :size="22"><Search /></el-icon>
                </el-button>
                <span class="plugin-health-check__run-label">立即检测</span>
              </div>
              <template v-if="healthCheckRunning || healthCheckFinished">
                <el-progress
                  :percentage="healthCheckProgress"
                  :status="
                    healthCheckRunning
                      ? undefined
                      : healthCheckFinished
                        ? healthCheckOk
                          ? 'success'
                          : 'exception'
                        : undefined
                  "
                  striped
                  :striped-flow="healthCheckRunning"
                  class="plugin-health-check__progress"
                />
                <p v-if="healthCheckPhase" class="plugin-health-check__phase text-gray">{{ healthCheckPhase }}</p>
              </template>
              <div v-if="healthCheckFinished" class="plugin-health-check__result">
                <el-tag :type="healthCheckOk ? 'success' : 'danger'" effect="dark" round size="large">
                  {{ healthCheckOk ? '正常' : '异常' }}
                </el-tag>
              </div>
              <div class="plugin-health-check__log-title">检测日志</div>
              <pre class="plugin-detail__pre plugin-health-check__log">{{
                healthCheckLog || '点击上方「立即检测」向宿主请求 /system/pluginHost/health 并查看本插件探针结果。'
              }}</pre>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template
        v-if="detail && (detail.runtimeState === 'LOADED' || detail.runtimeState === 'ON_DISK')"
        #footer
      >
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          type="danger"
          :loading="powerLoading(detail, 'purge')"
          :disabled="powerRowLocked(detail)"
          @click="onPurge(detail, true)"
        >
          彻底卸载
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="logVisible"
      title="插件独立日志"
      width="80%"
      top="5vh"
      destroy-on-close
      class="plugin-log-dialog"
      :fullscreen="logFullscreen"
      @closed="onLogDialogClosed"
    >
      <div class="plugin-log-dialog-inner plugin-log-panel" :class="{ 'plugin-log-panel--fullscreen': logFullscreen }">
        <el-button v-if="logFullscreen" type="primary" class="plugin-log-exit-fullscreen" @click="logFullscreen = false">
          退出全屏
        </el-button>
        <div v-show="!logFullscreen" class="plugin-log-toolbar">
          <el-button size="small" :loading="logLoading" @click="loadPluginLogTail(true)">刷新</el-button>
          <el-button size="small" type="warning" :disabled="!logContext" @click="onClearPluginLog">清空日志</el-button>
          <el-button size="small" @click="logFullscreen = !logFullscreen">
            {{ logFullscreen ? '退出全屏' : '全屏预览' }}
          </el-button>
          <el-radio-group v-model="logTheme" size="small" class="plugin-log-theme-switch">
            <el-radio-button label="eye-care">护眼</el-radio-button>
            <el-radio-button label="dark">深色</el-radio-button>
          </el-radio-group>
          <el-button
            size="small"
            type="primary"
            plain
            :disabled="!logContext || logData?.fileMissing"
            :loading="logDownloadLoading"
            @click="downloadPluginLogFile"
          >
            下载日志
          </el-button>
          <el-button
            size="small"
            type="primary"
            plain
            :disabled="!logContext || logData?.fileMissing || !logPlainText.trim()"
            @click="copyPluginLogText"
          >
            复制日志
          </el-button>
          <span class="plugin-log-toolbar__gap" />
          <span class="plugin-log-toolbar__label text-gray">跟随底部</span>
          <el-switch v-model="logFollowBottom" size="small" @change="onLogFollowSwitch" />
          <span v-if="!logFollowBottom" class="plugin-log-toolbar__hint text-warning">已暂停 · 30s 无操作后恢复</span>
          <span class="plugin-log-toolbar__gap plugin-log-toolbar__gap--sm" />
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
            <!-- 路径说明与日志正文同一滚动容器，避免只能滚到 pre/code、外层 div 无滚动条 -->
            <div
              ref="logScrollRef"
              class="plugin-log-scroll"
              :class="`plugin-log-theme--${logTheme}`"
              @scroll.passive="onPluginLogScroll"
            >
              <p v-if="logData.fileMissing" class="plugin-log-meta text-warning">未找到日志文件（可能尚未产生带插件 MDC 的日志）。</p>
              <p v-else class="plugin-log-meta plugin-log-meta--path text-gray">
                <span v-if="logData.truncated" class="text-warning">仅显示文件末尾一段 · </span>
                <code class="plugin-log-path">{{ logData.logPath }}</code>
              </p>
              <pre class="plugin-log-pre"><code class="plugin-log-code language-log" v-html="logHighlightedHtml" /></pre>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="installFlowVisible"
      :title="installFlowTitle"
      width="70vw"
      destroy-on-close
      class="plugin-install-flow-dialog"
      @closed="onInstallFlowClosed"
    >
      <PluginInstallUnifiedFlow
        v-if="installFlowVisible"
        variant="dialog"
        :flow-mode="installFlowMode"
        :initial-file="pendingInstallFile"
        @close="installFlowVisible = false"
        @installed="onInstallFlowInstalled"
      />
    </el-dialog>

  </div>
</template>

<script setup lang="ts" name="systemPluginMarket">
import {
  Document,
  Minus,
  Plus,
  RefreshRight,
  Search,
  SwitchButton,
  VideoPlay,
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import { saveAs } from 'file-saver';
import { usePluginLogViewer } from '/@/composables/usePluginLogViewer';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useUserInfo } from '/@/stores/userInfo';
import { Session } from '/@/utils/storage';
import { userApi } from '/@/views/system/user';
import {
  activatePluginVersion,
  clearPluginLog,
  deactivatePlugin,
  fetchPluginHostStatus,
  fetchPluginHostHealth,
  fetchPluginLogTail,
  fetchPluginMarketCards,
  fetchPluginManifests,
  purgePlugin,
  reloadPlugins,
  removePluginCatalog,
  fetchPluginMarketSysConfig,
  savePluginMarketSysConfig,
} from './api';
import PluginInstallUnifiedFlow from './components/PluginInstallUnifiedFlow.vue';
import { getEnv } from '/@/utils/mms';

/** 市场卡片封面：相对路径拼 API base，便于 dev 代理与跨端口部署下 img 正常加载 */
function resolvePluginMarketIconUrl(url: string | undefined | null): string {
  if (url == null) {
    return '';
  }
  const u = String(url).trim();
  if (!u) {
    return '';
  }
  if (/^https?:\/\//i.test(u)) {
    return u;
  }
  if (u.startsWith('//')) {
    return u;
  }
  if (u.startsWith('/')) {
    let base = getEnv('VITE_APP_BASE_API');
    if (base.endsWith('/')) {
      base = base.slice(0, -1);
    }
    return base + u;
  }
  return u;
}

function escapeHtmlLog(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 日志行语法高亮（正则 + 与 Prism Tomorrow 协调的配色） */
function highlightPluginLogText(text: string): string {
  if (!text) return '';
  return text.split('\n').map((line) => highlightPluginLogLine(line)).join('\n');
}

function highlightPluginLogLine(line: string): string {
  let s = escapeHtmlLog(line);
  s = s.replace(
    /^(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:[.,:]\d{1,9})?)/,
    '<span class="plugin-log-hl-ts">$1</span>'
  );
  s = s.replace(/\b(ERROR|FATAL)\b/g, '<span class="plugin-log-hl-err">$1</span>');
  s = s.replace(/\b(WARN|WARNING)\b/g, '<span class="plugin-log-hl-warn">$1</span>');
  s = s.replace(/\bINFO\b/g, '<span class="plugin-log-hl-info">$1</span>');
  s = s.replace(/\b(DEBUG|TRACE)\b/g, '<span class="plugin-log-hl-debug">$1</span>');
  return s;
}

const loading = ref(false);
const reloading = ref(false);
const statusBody = reactive<any>({});
const pluginRootConfigDiffers = computed(() => {
  const r = statusBody.resolvedPluginsRoot as string | undefined;
  const c = statusBody.rootDir as string | undefined;
  return !!(c && r && c !== r);
});
const cards = ref<any[]>([]);
const detailVisible = ref(false);
/** 详情弹窗 Tab：打开详情时重置为概览 */
const detailActiveTab = ref('overview');
const detail = ref<any>(null);
const pluginSysConfigItems = ref<
  Array<{
    keySuffix: string;
    configName: string;
    configValue: string;
    fullConfigKey?: string;
    description?: string;
    valueType: string;
    /** 存库形态：scalar | list | object（与后端 valueCardinality 一致；multiselect 视为 list） */
    valueCardinality: string;
    options: Array<{ label?: string; value: string }>;
  }>
>([]);
/** 无表单时的说明：部分插件（如文档站）未声明 plugin.json sysConfig，业务配置在自有菜单 */
const pluginSysConfigEmptyDescription = computed(() => {
  const pid = detail.value?.pluginId;
  if (pid === 'mms.plugin.doc') {
    return '该插件无此项配置，请到「文档管理 → 文档配置」维护。';
  }
  return '当前无配置项（请确认 JAR 内 plugin.json 已声明 sysConfig）。';
});
/** list 形态且非 multiselect/json 时：多行草稿，与 configValue JSON 数组互相同步 */
const pluginListDrafts = reactive<Record<string, string[]>>({});
const pluginSysConfigLoading = ref(false);
const pluginSysConfigSaving = ref(false);
const rollbackVer = ref<string>('');
const rollbacking = ref(false);
/** 健康检查：立即检测流程 */
const healthCheckRunning = ref(false);
const healthCheckProgress = ref(0);
const healthCheckPhase = ref('');
const healthCheckFinished = ref(false);
const healthCheckOk = ref(false);
const healthCheckLog = ref('');
const logVisible = ref(false);
const logLoading = ref(false);
const logData = ref<any>(null);
const logContext = ref<{ pluginId: string; version: string } | null>(null);
const logPlainText = computed(() => String(logData.value?.text ?? ''));
const {
  logScrollRef,
  logTheme,
  logFullscreen,
  logFollowBottom,
  logLastScrollAwayAt,
  logDownloadLoading,
  logHighlightedHtml,
  scrollLogToBottom,
  onPluginLogScroll,
  onLogFollowSwitch,
  resetPluginLogPanel,
} = usePluginLogViewer({ panelActive: logVisible, text: logPlainText });
const logWatchEnabled = ref(true);
const logWatchIntervalMs = ref(2500);
let logPollTimer: ReturnType<typeof setInterval> | null = null;
/** 卡片运行控制：仅当前操作的按钮显示 loading */
const powerBusy = ref<{
  pluginId: string;
  op: 'enable' | 'deactivate' | 'restart' | 'purge';
} | null>(null);


/** 与后端 PluginDescriptorValidator 中 SYS_CONFIG_VALUE_TYPES 一致 */
const PLUGIN_SYS_CONFIG_VALUE_TYPES = new Set([
  'text',
  'textarea',
  'password',
  'number',
  'switch',
  'select',
  'multiselect',
  'json',
  'file',
  'image',
  'color',
  'date',
]);

function normalizePluginSysConfigValueType(raw: unknown): string {
  const s = String(raw ?? '')
    .trim()
    .toLowerCase();
  return PLUGIN_SYS_CONFIG_VALUE_TYPES.has(s) ? s : 'text';
}

/** 与 plugin.json valueCardinality 一致；array 等同于 list；multiselect 固定为 list */
function normalizeValueCardinalityField(valueType: unknown, raw: unknown): string {
  if (String(valueType ?? '').trim().toLowerCase() === 'multiselect') return 'list';
  const s = String(raw ?? '').trim().toLowerCase();
  if (s === 'list' || s === 'array') return 'list';
  if (s === 'object') return 'object';
  return 'scalar';
}

function effectiveCardinality(row: {
  valueType?: string;
  valueCardinality?: string;
}): string {
  return normalizeValueCardinalityField(row.valueType, row.valueCardinality);
}

/** textarea/json：minRows 随形态，maxRows 封顶；内容增高时在区间内自适应 */
function textareaAutosize(row: { valueType?: string; valueCardinality?: string }): { minRows: number; maxRows: number } {
  const c = effectiveCardinality(row);
  const vt = String(row.valueType ?? '').toLowerCase();
  if (vt === 'json' || c === 'list' || c === 'object') {
    return { minRows: 5, maxRows: 28 };
  }
  return { minRows: 3, maxRows: 16 };
}

/** 存库形态为 list 时用「添加一条 / 删除」编辑 JSON 数组（排除 multiselect 与整段 json） */
function shouldUseListEditor(row: { valueType?: string; valueCardinality?: string }): boolean {
  if (effectiveCardinality(row) !== 'list') return false;
  const vt = String(row.valueType ?? '').toLowerCase();
  if (vt === 'multiselect' || vt === 'json') return false;
  return true;
}

function listEditorInputType(row: { valueType?: string }): 'text' | 'textarea' | 'password' {
  const vt = String(row.valueType ?? '').toLowerCase();
  if (vt === 'password') return 'password';
  if (vt === 'textarea') return 'textarea';
  return 'text';
}

/** list 每行：textarea 时启用高度自适应；其它类型关闭 */
function listEditorAutosize(row: { valueType?: string }): { minRows: number; maxRows: number } | undefined {
  if (String(row.valueType ?? '').toLowerCase() === 'textarea') {
    return { minRows: 2, maxRows: 12 };
  }
  return undefined;
}

function parseStringListForListEditor(raw: string | undefined): string[] {
  if (raw == null || !String(raw).trim()) return [''];
  try {
    const a = JSON.parse(String(raw));
    if (!Array.isArray(a)) return [''];
    const strs = a.map((x) => String(x));
    return strs.length > 0 ? strs : [''];
  } catch {
    return [''];
  }
}

function flushListDraftToRow(row: { keySuffix: string; configValue?: string }) {
  const ks = row.keySuffix;
  const lines = pluginListDrafts[ks];
  if (!lines) return;
  const nonEmpty = lines.map((s) => String(s ?? '').trim()).filter((s) => s.length > 0);
  row.configValue = JSON.stringify(nonEmpty);
}

function syncPluginListDraftsFromItems() {
  Object.keys(pluginListDrafts).forEach((k) => delete pluginListDrafts[k]);
  for (const item of pluginSysConfigItems.value) {
    if (shouldUseListEditor(item)) {
      pluginListDrafts[item.keySuffix] = parseStringListForListEditor(item.configValue);
    }
  }
}

function addListRow(row: { keySuffix: string; configValue?: string }) {
  const ks = row.keySuffix;
  if (!pluginListDrafts[ks]) {
    pluginListDrafts[ks] = [''];
  }
  pluginListDrafts[ks].push('');
  flushListDraftToRow(row);
}

function removeListRow(row: { keySuffix: string; configValue?: string }, index: number) {
  const ks = row.keySuffix;
  const arr = pluginListDrafts[ks];
  if (!arr) return;
  if (arr.length > 1) {
    arr.splice(index, 1);
  } else {
    arr[0] = '';
  }
  flushListDraftToRow(row);
}

function optionLabel(opt: { label?: string; value: string }) {
  const l = opt?.label != null ? String(opt.label).trim() : '';
  return l || opt.value;
}

function parseMultiselectValues(v: unknown): string[] {
  if (v == null || !String(v).trim()) return [];
  try {
    const a = JSON.parse(String(v));
    if (!Array.isArray(a)) return [];
    return a.map((x) => String(x));
  } catch {
    return [];
  }
}

function toInputNumberModel(v: unknown): number | undefined {
  if (v == null || !String(v).trim()) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

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

function resetHealthCheckPanel() {
  healthCheckRunning.value = false;
  healthCheckProgress.value = 0;
  healthCheckPhase.value = '';
  healthCheckFinished.value = false;
  healthCheckOk.value = false;
  healthCheckLog.value = '';
}

function appendHealthCheckLog(line: string) {
  const t = new Date().toLocaleString();
  healthCheckLog.value =
    (healthCheckLog.value ? `${healthCheckLog.value}\n` : '') + `[${t}] ${line}`;
}

function extractPluginHostHealthRows(res: any): any[] {
  const d = res?.data;
  return Array.isArray(d) ? d : [];
}

async function runPluginHealthCheck() {
  const row = detail.value;
  if (!row?.pluginId || row.runtimeState !== 'LOADED') {
    ElMessage.warning('仅已加载插件可执行健康检测');
    return;
  }
  const pid = String(row.pluginId).trim();
  healthCheckRunning.value = true;
  healthCheckFinished.value = false;
  healthCheckProgress.value = 0;
  healthCheckPhase.value = '正在连接宿主…';
  healthCheckLog.value = '';
  appendHealthCheckLog(
    `开始检测插件「${pid}」（版本 ${row.displayVersion ?? row.manifest?.version ?? '—'}）`
  );
  try {
    await new Promise((r) => setTimeout(r, 120));
    healthCheckProgress.value = 22;
    healthCheckPhase.value = '正在请求 GET /system/pluginHost/health …';
    const res: any = await fetchPluginHostHealth();
    const allRows = extractPluginHostHealthRows(res);
    healthCheckProgress.value = 68;
    healthCheckPhase.value = '正在解析探针结果…';
    await new Promise((r) => setTimeout(r, 90));
    const rows = allRows.filter((r: any) => r && String(r.pluginId ?? '').trim() === pid);
    appendHealthCheckLog(`宿主聚合健康行 ${allRows.length} 条，本插件匹配 ${rows.length} 条`);
    for (const r of rows) {
      appendHealthCheckLog(`--- ${r.pluginId} @ ${r.version} ---`);
      appendHealthCheckLog(`state: ${r.state ?? '—'}`);
      appendHealthCheckLog(
        `body: ${r.body != null && String(r.body).length > 0 ? String(r.body) : '（空）'}`
      );
    }
    const hasErr = rows.some((r: any) => r.state === 'ERROR');
    const hasOk = rows.some((r: any) => r.state === 'OK');
    const onlyNoSpi =
      rows.length > 0 && rows.every((r: any) => r.state === 'NO_HEALTH_SPI');
    let ok = false;
    if (rows.length === 0) {
      appendHealthCheckLog('结论：未匹配到该插件的健康行（可尝试刷新市场后重试）。');
      ok = false;
    } else if (hasErr) {
      appendHealthCheckLog('结论：存在 ERROR，探针失败或抛错。');
      ok = false;
    } else if (hasOk) {
      appendHealthCheckLog('结论：存在 OK，探针返回正常。');
      ok = true;
    } else if (onlyNoSpi) {
      appendHealthCheckLog('结论：未注册 PluginHealthContributor，无自定义探针输出（视为未异常）。');
      ok = true;
    } else {
      appendHealthCheckLog(
        `结论：状态 ${rows.map((x: any) => x.state).join(', ')}，按异常处理。`
      );
      ok = false;
    }
    healthCheckOk.value = ok;
    healthCheckFinished.value = true;
    healthCheckProgress.value = 100;
    healthCheckPhase.value = '检测完成';
  } catch (e: any) {
    appendHealthCheckLog(`请求失败：${e?.message ?? e ?? '未知错误'}`);
    healthCheckOk.value = false;
    healthCheckFinished.value = true;
    healthCheckProgress.value = 100;
    healthCheckPhase.value = '检测中断';
  } finally {
    healthCheckRunning.value = false;
  }
}

async function openDetail(row: any) {
  detail.value = row;
  resetHealthCheckPanel();
  rollbackVer.value = row.catalogActiveVersion || row.recordedVersions?.[0] || '';
  detailActiveTab.value = 'overview';
  detailVisible.value = true;
  await loadPluginSysConfig(row);
}

async function loadPluginSysConfig(row: any) {
  if (!row?.pluginId) {
    pluginSysConfigItems.value = [];
    Object.keys(pluginListDrafts).forEach((k) => delete pluginListDrafts[k]);
    return;
  }
  const pluginId = row.pluginId;
  pluginSysConfigLoading.value = true;
  try {
    const res: any = await fetchPluginMarketSysConfig(pluginId);
    const list = res?.data ?? [];
    let schemaRaw = row.sysConfigSchema ?? row.manifest?.sysConfig;
    let schema = Array.isArray(schemaRaw) ? schemaRaw : [];
    // 卡片 JSON 偶发未带齐 sysConfigSchema/manifest.sysConfig 时，已加载插件可从 /pluginHost/manifests 补一份
    if (schema.length === 0 && row.runtimeState === 'LOADED') {
      try {
        const mres: any = await fetchPluginManifests();
        const manifests = Array.isArray(mres?.data) ? mres.data : [];
        const hit = manifests.find((m: any) => String(m?.id ?? '') === String(pluginId));
        if (hit && Array.isArray(hit.sysConfig) && hit.sysConfig.length > 0) {
          schema = hit.sysConfig;
        }
      } catch {
        /* manifests 失败则仍走库表 list */
      }
    }
    if (schema.length > 0) {
      const bySuffix = new Map(list.map((r: any) => [String(r.keySuffix ?? '').trim(), r]));
      pluginSysConfigItems.value = schema.map((def: any) => {
        const ks = String(def.keySuffix ?? '').trim();
        const hit = bySuffix.get(ks);
        const nameFromDef =
          def.configName != null && String(def.configName).trim()
            ? String(def.configName).trim()
            : '';
        return {
          keySuffix: ks,
          configName: nameFromDef || hit?.configName || ks,
          configValue: hit?.configValue ?? (def.defaultValue != null ? String(def.defaultValue) : ''),
          fullConfigKey: hit?.fullConfigKey,
          description: def.description != null ? String(def.description) : '',
          valueType: normalizePluginSysConfigValueType(def.valueType),
          valueCardinality: normalizeValueCardinalityField(def.valueType, def.valueCardinality),
          options: Array.isArray(def.options) ? def.options : [],
        };
      });
    } else {
      pluginSysConfigItems.value = list.map((r: any) => ({
        keySuffix: r.keySuffix ?? '',
        configName: r.configName ?? '',
        configValue: r.configValue ?? '',
        fullConfigKey: r.fullConfigKey,
        description: '',
        valueType: 'text',
        valueCardinality: 'scalar',
        options: [],
      }));
    }
    syncPluginListDraftsFromItems();
  } catch {
    pluginSysConfigItems.value = [];
    Object.keys(pluginListDrafts).forEach((k) => delete pluginListDrafts[k]);
  } finally {
    pluginSysConfigLoading.value = false;
  }
}

async function savePluginSysConfig() {
  if (!detail.value?.pluginId) return;
  for (const r of pluginSysConfigItems.value) {
    if (shouldUseListEditor(r)) {
      flushListDraftToRow(r);
    }
  }
  pluginSysConfigSaving.value = true;
  try {
    await savePluginMarketSysConfig({
      pluginId: detail.value.pluginId,
      items: pluginSysConfigItems.value
        .filter((r) => String(r.keySuffix ?? '').trim())
        .map((r) => ({
          keySuffix: String(r.keySuffix).trim(),
          configName: r.configName?.trim() || undefined,
          configValue: r.configValue ?? '',
        })),
    });
    ElMessage.success('已保存');
    if (detail.value) await loadPluginSysConfig(detail.value);
  } catch {
    /* 拦截器已提示 */
  } finally {
    pluginSysConfigSaving.value = false;
  }
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
  // 仅「已安装未加载」可启动；LOADED 时即便库表未带回 catalogActiveVersion 也不应出现「启动」
  if (row.runtimeState !== 'ON_DISK') return false;
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

/** 仅展示可点的「停止」：库表有激活，或宿主已加载该插件（与 catalog 字段缺失时仍可停用） */
function powerShowDeactivate(row: any): boolean {
  return (
    hasCatalogActive(row) ||
    row.runtimeState === 'LOADED' ||
    powerLoading(row, 'deactivate')
  );
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
  resetPluginLogPanel();
  logContext.value = null;
  logData.value = null;
}

/** @param showSpinner 为 false 时用于轮询，不挡整个弹窗 */
async function loadPluginLogTail(showSpinner: boolean) {
  if (!logContext.value) return;
  if (showSpinner) logLoading.value = true;
  try {
    const res: any = await fetchPluginLogTail(logContext.value.pluginId, logContext.value.version);
    logData.value = res?.data ?? res;
    if (logFollowBottom.value) await scrollLogToBottom();
  } finally {
    if (showSpinner) logLoading.value = false;
  }
}

async function loadPluginLogTailSilent() {
  if (!logContext.value || !logVisible.value) return;
  try {
    const res: any = await fetchPluginLogTail(logContext.value.pluginId, logContext.value.version);
    logData.value = res?.data ?? res;
    if (logFollowBottom.value) await scrollLogToBottom();
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

/** 与宿主 pluginLogTail 一致：单次最多读取末尾约 2MB 再保存为 .log 文件 */
async function downloadPluginLogFile() {
  if (!logContext.value) return;
  logDownloadLoading.value = true;
  try {
    const res: any = await fetchPluginLogTail(logContext.value.pluginId, logContext.value.version, 2_097_152);
    const data = res?.data ?? res;
    if (data?.fileMissing) {
      ElMessage.warning('暂无日志文件');
      return;
    }
    const text = String(data?.text ?? '');
    const name = `${logContext.value.pluginId}@${logContext.value.version}.log`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, name);
    if (data?.truncated) {
      ElMessage.info('文件较大，下载内容为文件末尾至多约 2MB');
    } else {
      ElMessage.success('已开始下载');
    }
  } catch {
    /* 拦截器已提示 */
  } finally {
    logDownloadLoading.value = false;
  }
}

async function copyPluginLogText() {
  const text = logPlainText.value;
  if (!text.trim()) {
    ElMessage.warning('暂无可复制的日志内容');
    return;
  }
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      ElMessage.success('已复制到剪贴板');
      return;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', 'true');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) {
      ElMessage.success('已复制到剪贴板');
    } else {
      ElMessage.warning('复制失败，请手动复制');
    }
  } catch {
    ElMessage.warning('复制失败，请手动复制');
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
  logFollowBottom.value = true;
  logLastScrollAwayAt.value = 0;
  logFullscreen.value = false;
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

const installFlowVisible = ref(false);
const installFlowMode = ref<'install' | 'agreement'>('install');
const pendingInstallFile = ref<File | null>(null);

const installFlowTitle = computed(() =>
  installFlowMode.value === 'agreement' ? '插件使用协议' : '插件安装'
);
const baseUserApi = userApi();

function openInstallWizardDialog() {
  installFlowMode.value = 'install';
  pendingInstallFile.value = null;
  installFlowVisible.value = true;
}

async function beginPluginInstallWithSchemaWizard(file: File) {
  installFlowMode.value = 'install';
  pendingInstallFile.value = file;
  installFlowVisible.value = true;
}

async function refreshCurrentUserPermissionContext() {
  try {
    const userRes: any = await baseUserApi.getUserInfo();
    if (userRes?.code === 200 && userRes?.data) {
      Session.set('userInfo', userRes.data);
      await useUserInfo().setUserInfos();
    }
    // 重新拉取菜单并重建动态路由，避免 install.sql 后权限/菜单需重登才生效
    await initBackEndControlRoutes();
  } catch {
    // 不阻断安装流程，允许用户手动刷新页面兜底
  }
}

async function onInstallFlowInstalled() {
  await Promise.all([loadAll(), refreshCurrentUserPermissionContext()]);
  ElMessage.success('插件安装成功，已自动刷新当前登录权限与菜单');
}

function onInstallFlowClosed() {
  installFlowMode.value = 'install';
  pendingInstallFile.value = null;
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
    await beginPluginInstallWithSchemaWizard(opt.file as File);
    detailVisible.value = false;
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
    await beginPluginInstallWithSchemaWizard(opt.file as File);
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
    await Promise.all([loadAll(), refreshCurrentUserPermissionContext()]);
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
    await Promise.all([loadAll(), refreshCurrentUserPermissionContext()]);
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
    await Promise.all([loadAll(), refreshCurrentUserPermissionContext()]);
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
    const runningHint =
      row.runtimeState === 'LOADED'
        ? '当前为<strong>运行中</strong>：服务端将<strong>先卸载</strong>内存中的插件再删除磁盘。<br/><br/>'
        : '';
    await ElMessageBox.confirm(
      `将对「${row.name}」（${row.pluginId}）执行<strong>彻底卸载</strong>：${runningHint}<strong>删除磁盘</strong>上该插件全部安装目录，并<strong>清除库表</strong>中的版本与市场登记，然后全量重载。<br/><br/>此操作不可从界面撤销，请确认。<br/><br/>是否继续？`,
      '彻底卸载插件（磁盘 + 库表）',
      {
        type: 'error',
        dangerouslyUseHTMLString: true,
      }
    );
    powerBusy.value = { pluginId: row.pluginId, op: 'purge' };
    await purgePlugin(row.pluginId);
    ElMessage.success('已删除安装目录与库表登记并重载');
    if (closeDetail) detailVisible.value = false;
    await Promise.all([loadAll(), refreshCurrentUserPermissionContext()]);
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
    await Promise.all([loadAll(), refreshCurrentUserPermissionContext()]);
  } catch (e: any) {
    if (e !== 'cancel') {
      /* */
    }
  }
}

onMounted(() => loadAll());
</script>

<style lang="scss">
@use '/@/styles/plugin-log-viewer.scss' as *;
</style>

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
  /* 避免列宽小于子项 min-width 时撑破栅格导致卡片重叠 */
  :deep(.el-col) {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
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
.plugin-market__root-hint {
  margin-left: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.plugin-card {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  margin: 0 auto 16px;
  flex: 1 1 auto;
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
/* 头图通栏 100% 宽，高度随图片比例自适应（无图时占位 min-height） */
.plugin-card__media {
  position: relative;
  margin: -12px 0 12px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  width: 100%;
  min-height: 88px;
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
  height: auto;
  display: block;
  position: relative;
}
.plugin-card__media :deep(.el-image) {
  width: 100%;
  height: auto;
  display: block;
}
.plugin-card__media :deep(.el-image__wrapper) {
  width: 100% !important;
  height: auto !important;
  display: block !important;
}
.plugin-card__media :deep(.el-image__inner) {
  width: 100% !important;
  height: auto !important;
  max-width: 100%;
  vertical-align: top;
  display: block;
  object-fit: contain;
  object-position: center center;
}
.plugin-card__placeholder {
  position: absolute;
  inset: 0;
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
.plugin-detail-dialog :deep(.el-dialog__body) {
  padding-top: 8px;
}
.plugin-detail-tabs :deep(.el-tabs__content) {
  padding-top: 8px;
}
.plugin-detail__tab-body {
  margin-top: 0;
}
.plugin-sys-config__rollback {
  margin-bottom: 0;
}
.plugin-sys-config__section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.plugin-sys-config__section-count {
  margin-left: 4px;
  font-weight: 400;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.plugin-sys-config__rollback + .plugin-sys-config__params {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.plugin-sys-config__params {
  margin-bottom: 4px;
}
.plugin-sys-config__mono {
  font-size: 12px;
}
.plugin-sys-config__readonly {
  font-size: 13px;
  color: var(--el-text-color-regular);
}
.plugin-sys-config__control {
  width: 100%;
  min-width: 140px;
}
.plugin-sys-config-form {
  margin-bottom: 4px;
}
.plugin-sys-config-form__item {
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.plugin-sys-config-form__item:last-of-type {
  border-bottom: none;
  margin-bottom: 12px;
  padding-bottom: 0;
}
.plugin-sys-config-form__control {
  max-width: 560px;
}
.plugin-detail-dialog .plugin-sys-config-form :deep(.el-form-item__content) {
  width: 100%;
}
.plugin-detail-dialog .plugin-sys-config-form__control {
  max-width: none;
  width: 100%;
}
.plugin-detail-dialog .plugin-sys-config__textarea {
  width: 100%;
}
.plugin-detail-dialog .plugin-sys-config__textarea :deep(.el-textarea__inner) {
  width: 100%;
}
.plugin-detail-dialog .plugin-sys-config-list-editor {
  max-width: none;
}
.plugin-sys-config-form__submit {
  margin-top: 8px;
}
.plugin-sys-config-list-editor {
  width: 100%;
  max-width: 640px;
}
.plugin-sys-config-list-editor__row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}
.plugin-sys-config-list-editor__row .el-button.is-circle {
  margin-top: 4px;
  flex-shrink: 0;
}
.plugin-sys-config-list-editor__input {
  flex: 1;
  min-width: 0;
}
.plugin-sys-config-list-editor__add {
  margin-top: 4px;
}
@media (min-width: 768px) {
  .plugin-sys-config-form__control {
    max-width: 640px;
  }
}
.plugin-detail__summary {
  margin: 0 0 4px;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-lighter);
}
.plugin-detail__summary-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  margin-bottom: 10px;
  line-height: 1.55;
  font-size: 13px;
  color: var(--el-text-color-regular);
}
.plugin-detail__summary-row:last-child {
  margin-bottom: 0;
}
.plugin-detail__summary-row--block {
  flex-direction: column;
  align-items: stretch;
}
.plugin-detail__summary-k {
  flex: 0 0 auto;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.plugin-detail__summary-v {
  flex: 1 1 200px;
  min-width: 0;
  word-break: break-word;
}
.plugin-detail__summary-detail {
  margin: 0;
  width: 100%;
  line-height: 1.65;
  color: var(--el-text-color-regular);
  white-space: pre-wrap;
  word-break: break-word;
}
.plugin-detail__rollback {
  margin: 0 0 12px;
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
  max-height: min(48vh, 360px);
}
.plugin-health-check__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.plugin-health-check__run-btn {
  width: 56px;
  height: 56px;
}
.plugin-health-check__run-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}
.plugin-health-check__progress {
  margin-bottom: 8px;
}
.plugin-health-check__phase {
  margin: 0 0 12px;
  font-size: 13px;
}
.plugin-health-check__result {
  margin: 12px 0 16px;
  display: flex;
  justify-content: center;
}
.plugin-health-check__log-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.plugin-health-check__log {
  max-height: min(40vh, 280px);
  margin-top: 0;
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
/* 独立日志弹窗：占满视口高度，仅 .plugin-log-scroll 内部滚动；工具栏与正文分离 */
/* 注意：plugin-log-dialog 与 el-dialog 根节点是同一元素，不能用「外层 .plugin-log-dialog 内层 .el-dialog」的写法，否则规则永远不命中 */
.plugin-log-dialog:not(.is-fullscreen) {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  max-height: calc(100vh - 140px);
}
.plugin-log-dialog:not(.is-fullscreen) :deep(.el-dialog__body) {
  padding: 0 20px;
  flex: 1;
  min-height: 0;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
}
/* 非全屏：工具栏顶吸，防止偶发父级滚动时跟着走 */
.plugin-log-dialog:not(.is-fullscreen) .plugin-log-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--el-bg-color);
  padding-bottom: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 0 var(--el-border-color-lighter);
}
/* 全屏独立日志：调 `<pre>` 高度时改这里（占视口顶部标题栏+路径+留白等，越大 pre 越矮） */
.plugin-log-dialog.is-fullscreen {
  --plugin-log-fullscreen-pre-chrome: 140px;
  display: flex;
  flex-direction: column;
  height: 100vh !important;
  max-height: 100vh !important;
  margin: 0 !important;
  min-height: 0;
  overflow: hidden;
}
.plugin-log-dialog.is-fullscreen :deep(.el-dialog__header) {
  flex-shrink: 0;
}
/*
 * 全屏：必须截断 body 高度并禁止 body 自己滚动（全局 .el-dialog__body 有 overflow-y:auto），
 * 否则整块被内容撑出视口，内层 .plugin-log-scroll 也拿不到有限高度、无法出现滚动条。
 */
.plugin-log-dialog.is-fullscreen :deep(.el-dialog__body) {
  padding: 0 20px !important;
  flex: 1 1 0% !important;
  min-height: 0 !important;
  max-height: calc(100vh - var(--el-dialog-fullscreen-header, 56px)) !important;
  overflow: hidden !important;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  box-sizing: border-box;
}
.plugin-log-dialog-inner {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.plugin-log-dialog.is-fullscreen .plugin-log-dialog-inner {
  flex: 1 1 0%;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}
/* 加载容器本身不滚动，避免与内层 .plugin-log-scroll 抢滚动手势 */
.plugin-log-dialog .plugin-log-panel > .plugin-log-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
  overscroll-behavior: none;
}
.plugin-log-dialog.is-fullscreen .plugin-log-panel > .plugin-log-body {
  flex: 1 1 0%;
  min-height: 0;
}
.plugin-log-meta{
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
  text-align: left;
}
/* 路径高亮见 /@/styles/plugin-log-viewer.scss */
/* 日志正文区固定可视高度（相对视口），仅此处滚动；覆盖全局 .plugin-log-scroll 的 flex:1 */
.plugin-log-dialog:not(.is-fullscreen) .plugin-log-scroll {
  flex: none;
  height: calc(100vh - 300px);
  min-height: 200px;
  max-height: calc(100vh - 300px);
  overflow: auto;
}
/*
 * 全屏：外层 .plugin-log-scroll 不滚动；路径说明固定在上，仅 <pre> 固定高度并滚动。
 * --plugin-log-fullscreen-pre-chrome：标题栏+路径+边距等占位，可按主题微调。
 */
.plugin-log-dialog.is-fullscreen .plugin-log-scroll {
  display: flex !important;
  flex-direction: column !important;
  flex: 1 1 0% !important;
  min-height: 0 !important;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden !important;
}
.plugin-log-dialog.is-fullscreen .plugin-log-scroll .plugin-log-meta {
  flex-shrink: 0;
}
.plugin-log-dialog.is-fullscreen .plugin-log-pre {
  flex: none;
  height: calc(100vh - var(--plugin-log-fullscreen-pre-chrome, 140px));
  min-height: 160px;
  max-height: calc(100vh - var(--plugin-log-fullscreen-pre-chrome, 140px));
  overflow-x: auto;
  overflow-y: auto !important;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

</style>
