<template>
  <div class="system-toolbar" role="toolbar">
    <el-config-provider size="default"><slot /></el-config-provider>
  </div>
</template>
<style scoped>
  .system-toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    min-width: 0;
  }
  .system-toolbar :deep(.w-100) {
    width: auto !important;
  }
  .system-toolbar :deep(.table-tool),
  .system-toolbar :deep(.el-form-item) {
    margin: 0 !important;
    padding: 0;
  }
  .system-toolbar :deep(.el-form .el-form-item:last-child) {
    margin: 0 !important;
  }
  .system-toolbar :deep(.el-form) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .system-toolbar :deep(.el-button) {
    height: 32px;
    padding: 8px 15px;
    font-size: 14px;
    margin-left: 0;
  }
  .system-toolbar :deep(.el-button-group) {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .system-toolbar :deep(.el-button-group > .el-button) {
    border-radius: var(--el-border-radius-base);
    border: 1px solid var(--el-button-border-color);
  }
  .system-toolbar :deep(.system-dept-search),
  .system-toolbar :deep(.system-menu-search) {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin: 0;
  }
  .system-toolbar :deep(.el-upload__tip) {
    font-size: 12px;
    margin-top: 8px;
  }
</style>
