<template>
  <div class="layout-padding layout-padding-auto layout-padding-view">
    <el-empty :description="description" />
  </div>
</template>

<script setup lang="ts" name="systemPluginPlaceholder">
  /** 无独立管理页的插件菜单占位（与 sys_function 中 component 指向本页配合使用） */
  const description = '本插件未提供独立管理页，请到「系统管理 → 插件市场」在对应插件中配置参数。';
</script>
