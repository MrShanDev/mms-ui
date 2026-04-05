<template>
  <div class="p-4">
    <el-alert type="warning" show-icon :closable="false" title="运行时日志（联邦模块未接入）">
      <template #default>
        <p class="mt-2 text-sm">
          宿主端已关闭 Module Federation，避免生产包与 Vue/Element Plus 初始化死锁导致整站白屏。
        </p>
        <p class="mt-2 text-sm">
          若需远程 syslog UI：在独立工程中构建
          <code class="mx-1 rounded bg-gray-100 px-1">packages/plugin-syslog-ui</code>
          ，并由网关托管 <code class="mx-1 rounded bg-gray-100 px-1">remoteEntry.js</code>
          后，再评估是否恢复宿主侧联邦接入。
        </p>
      </template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SyslogFederationPlaceholder' });
</script>
