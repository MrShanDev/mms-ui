<template>
  <div class="home-card-item mb15">
    <div class="home-card-item-title home-card-item-title--with-action">
      <div>运行状态</div>
    </div>
    <div class="home-card-item-content home-runtime-card-content">
      <div v-loading="loading" class="runtime-wrap">
        <div class="runtime-top">
          <div class="runtime-metric">
            <div class="runtime-metric-title">
              <SvgIcon name="ele-Cpu" :size="16" color="#409eff" />
              <span>CPU（趋势）</span>
            </div>
            <div :ref="(el) => setChartRef('cpu', el)" class="runtime-spark"></div>
            <div class="runtime-metric-value">
              {{ format.percentText(info?.cpu?.systemLoad) }}
              <span class="runtime-metric-sub">· {{ format.safeText(info?.cpu?.cores) }}核</span>
            </div>
          </div>
          <div class="runtime-metric">
            <div class="runtime-metric-title">
              <SvgIcon name="ele-Coin" :size="16" color="#67c23a" />
              <span>物理内存（趋势）</span>
            </div>
            <div :ref="(el) => setChartRef('mem', el)" class="runtime-spark"></div>
            <div class="runtime-metric-value">
              {{ format.percentText(info?.memory?.usedPercent) }}
              <span class="runtime-metric-sub">
                · {{ format.bytesText(info?.memory?.used) }} /
                {{ format.bytesText(info?.memory?.total) }}
              </span>
            </div>
          </div>
          <div class="runtime-metric">
            <div class="runtime-metric-title">
              <SvgIcon name="ele-Platform" :size="16" color="#e6a23c" />
              <span>JVM内存（趋势）</span>
            </div>
            <div :ref="(el) => setChartRef('jvm', el)" class="runtime-spark"></div>
            <div class="runtime-metric-value">
              {{ format.percentText(info?.jvmMemory?.usedPercent) }}
              <span class="runtime-metric-sub">
                · {{ format.bytesText(info?.jvmMemory?.used) }} /
                {{ format.bytesText(info?.jvmMemory?.total) }}
              </span>
            </div>
          </div>
        </div>

        <div class="runtime-kv-pack">
          <div class="runtime-section-title">运行快照</div>
          <el-descriptions class="runtime-kv-desc" size="small" :column="3" border>
            <!-- 一行三列：宿主/负载 → 进程 → 环境 -->
            <el-descriptions-item label="CPU核心数">
              {{ format.safeText(info?.cpu?.cores) }}
            </el-descriptions-item>
            <el-descriptions-item label="负载(1/5/15)">
              {{ format.loadAvgText(info?.cpu?.loadAverage) }}
            </el-descriptions-item>
            <el-descriptions-item label="服务器">
              {{ format.safeText(info?.os?.hostname) }} · {{ format.safeText(info?.os?.arch) }}
            </el-descriptions-item>
            <el-descriptions-item label="PID">
              {{ format.safeText(info?.app?.pid) }}
            </el-descriptions-item>
            <el-descriptions-item label="端口">
              {{ format.safeText(info?.app?.serverPort) }}
            </el-descriptions-item>
            <el-descriptions-item label="运行时长">
              {{
                format.safeText(info?.app?.uptimeMs ? format.formatDuration(info.app.uptimeMs) : '')
              }}
            </el-descriptions-item>
            <el-descriptions-item label="JDK">
              <div class="home-desc-monospace">{{ format.safeText(info?.app?.jdkVersion) }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="数据库">
              <template v-if="info?.db?.available">
                <div class="home-desc-db-meta">
                  {{ format.safeText(info?.db?.productName) }}
                  {{ format.safeText(info?.db?.productVersion, '') }}
                </div>
              </template>
              <template v-else>
                <span class="color-999">未获取</span>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="文档地址">
              <el-link
                v-if="info?.app?.docUrl"
                class="home-desc-doc-link"
                :href="String(info.app.docUrl)"
                target="_blank"
                type="primary"
              >
                {{ String(info.app.docUrl) }}
              </el-link>
              <span v-else>-</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="runtime-section runtime-db-section">
          <div class="runtime-section-title">数据库</div>
          <div class="db-grid">
            <div class="db-metric">
              <div class="db-metric-label">连接池</div>
              <div class="db-metric-value">{{ format.safeText(info?.dbPool?.type) }}</div>
            </div>
            <div class="db-metric">
              <div class="db-metric-label">活跃</div>
              <div class="db-metric-value">{{ format.safeText(info?.dbPool?.active) }}</div>
            </div>
            <div class="db-metric">
              <div class="db-metric-label">空闲</div>
              <div class="db-metric-value">{{ format.safeText(info?.dbPool?.idle) }}</div>
            </div>
            <div class="db-metric">
              <div class="db-metric-label">等待</div>
              <div class="db-metric-value">{{ format.safeText(info?.dbPool?.pending) }}</div>
            </div>
          </div>

          <div class="runtime-section-subtitle">
            慢 SQL（阈值：{{
              format.safeText(info?.slowSqlRecent?.length ? slowSqlThresholdText : '')
            }}）
          </div>
          <el-table
            :data="Array.isArray(info?.slowSqlRecent) ? info.slowSqlRecent : []"
            style="width: 100%"
            height="148"
          >
            <el-table-column prop="elapsedMs" label="耗时(ms)" width="110" />
            <el-table-column prop="datasource" label="数据源" width="120" show-overflow-tooltip />
            <el-table-column prop="timeMs" label="时间" width="180">
              <template #default="scope">
                {{ scope.row.timeMs ? format.formatServerTime(scope.row.timeMs) : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="sql" label="SQL" show-overflow-tooltip />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    info: any;
    loading: boolean;
    slowSqlThresholdText: string;
    format: Record<string, (...args: any[]) => string>;
    setChartRef: (key: string, element: unknown) => void;
  }>();
</script>
