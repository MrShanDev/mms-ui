<template>
  <SyslogPage />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

/** 与 packages/plugin-syslog-ui 中 federation exposes 的 ./SyslogPage 对应 */
const SyslogPage = defineAsyncComponent(() => import('mms_plugin_syslog_ui/SyslogPage'));
</script>
