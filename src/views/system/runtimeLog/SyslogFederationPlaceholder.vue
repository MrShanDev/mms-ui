<template>
  <div class="p-4">
    <el-alert type="info" show-icon :closable="false" title="运行时日志（占位页）">
      <template #default>
        <p class="mt-2 text-sm">
          正常情况不应看到本页。菜单应加载
          <code class="mx-1 rounded bg-gray-100 px-1">@mms-packages/plugin-syslog-ui/src/SyslogPage.vue</code>
          （<code>vite.config.ts</code> 中 <code>@mms-packages</code> → <code>packages/</code>）。
          若仍见此页，请检查别名与路由。
        </p>
      </template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'SyslogFederationPlaceholder' });
</script>
