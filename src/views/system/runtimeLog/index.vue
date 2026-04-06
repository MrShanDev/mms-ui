<template>
  <SyslogPage />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

/** 与联邦子包 exposes 同源，宿主直出源码（不加载 remoteEntry）；新插件：`@mms-packages/<包目录>/src/...` */
const SyslogPage = defineAsyncComponent(() =>
  import('@mms-packages/plugin-syslog-ui/src/SyslogPage.vue')
);
</script>
