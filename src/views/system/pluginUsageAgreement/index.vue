<template>
  <div class="plugin-usage-agreement layout-padding layout-padding-auto">
    <el-page-header class="plugin-usage-agreement__header" @back="goBack">
      <template #content>
        <span class="plugin-usage-agreement__title">插件使用协议</span>
      </template>
    </el-page-header>

    <el-card shadow="never" class="plugin-usage-agreement__card">
      <p class="plugin-usage-agreement__meta text-gray">
        适用于在 MMS 管理端通过「插件市场 / 插件安装向导」安装、启用、维护 JAR 插件的操作人员（通常为超级管理员）。具体技术约定以项目文档与
        <code>mms-plugin</code> 技能说明为准；本页为使用层面的风险与责任提示。
      </p>

      <h3 class="plugin-usage-agreement__h">一、适用范围</h3>
      <p>
        本协议所称「插件」指符合 MMS 插件规范、以 JAR 形式交付并在宿主中加载的扩展模块。通过本系统执行的安装、激活、停用、卸载等操作，均视为在贵方环境内对插件及其依赖的授权行为。
      </p>

      <h3 class="plugin-usage-agreement__h">二、来源审查与安全</h3>
      <p>
        安装前须确认插件来源可信、包体完整（校验哈希/签名、构建渠道）。插件代码在宿主进程内执行，可能访问数据库、配置、网络及文件系统；<strong>贵方对所选插件的安全性、合规性承担审查责任</strong>。建议在非生产环境验证后再上线。
      </p>

      <h3 class="plugin-usage-agreement__h">三、操作授权与数据风险</h3>
      <p>
        使用安装向导执行建表、或使用插件自带的 <code>schema.sql</code>，可能对数据库结构产生变更；插件运行期读写业务数据的行为由插件实现决定。请提前备份并做好变更窗口与回滚预案。因误操作、插件缺陷或环境配置不当导致的数据丢失、服务中断，<strong>应通过贵方运维与供应商支持渠道处理</strong>。
      </p>

      <h3 class="plugin-usage-agreement__h">四、宿主与插件责任边界</h3>
      <p>
        MMS 宿主提供加载、隔离与通用运维能力；<strong>具体业务逻辑、对外接口、许可与第三方依赖由插件提供方负责</strong>。联邦前端（<code>META-INF/mms/web</code>）与菜单声明（<code>menuBootstrap</code> 等）随插件包分发，展示与权限仍受贵方角色与租户策略约束。
      </p>

      <h3 class="plugin-usage-agreement__h">五、卸载与残留</h3>
      <p>
        停用、卸载、删除等操作在系统中的语义以插件市场界面说明为准（磁盘与库表是否一并清理等）。若需彻底清除业务数据或审计痕迹，请结合数据库与对象存储策略另行处理。
      </p>

      <h3 class="plugin-usage-agreement__h">六、协议更新</h3>
      <p>
        本页内容可能随产品版本更新而调整；继续使用插件相关功能即表示知悉当前版本说明。如有内部合规要求，请将本页纳入贵方变更与培训流程。
      </p>

      <div class="plugin-usage-agreement__footer">
        <el-button type="primary" @click="goMarket">返回插件市场</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="systemPluginUsageAgreement">
import { useRouter } from 'vue-router';

const router = useRouter();

function goMarket() {
  router.push('/system/pluginMarket');
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    goMarket();
  }
}
</script>

<style scoped>
.plugin-usage-agreement__header {
  margin-bottom: 16px;
}
.plugin-usage-agreement__title {
  font-size: 18px;
  font-weight: 600;
}
.plugin-usage-agreement__card {
  max-width: 880px;
}
.plugin-usage-agreement__meta {
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 1.65;
}
.plugin-usage-agreement__h {
  margin: 20px 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.plugin-usage-agreement__h:first-of-type {
  margin-top: 0;
}
.plugin-usage-agreement p {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--el-text-color-regular);
}
.plugin-usage-agreement__footer {
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
.text-gray {
  color: var(--el-text-color-secondary);
}
</style>
