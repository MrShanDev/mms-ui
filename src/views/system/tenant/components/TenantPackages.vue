<template>
  <el-dialog
    v-model="visible"
    title="租户套餐"
    width="960px"
    style="max-width: 94vw"
    :close-on-click-modal="false"
  >
    <div class="package-actions">
      <el-button type="primary" v-auth="'system:tenantPackage:edit'" @click="edit()">
        新增套餐
      </el-button>
    </div>
    <el-table :data="packages" v-loading="loading">
      <el-table-column prop="name" label="套餐名称" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="菜单数">
        <template #default="{ row }">{{ row.functionIds?.split(',').length || 0 }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" v-auth="'system:tenantPackage:edit'" @click="edit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <el-dialog
    v-model="editing"
    :title="form.id ? '编辑套餐' : '新增套餐'"
    width="660px"
    style="max-width: 94vw"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="formRef" :model="form" label-width="90px">
      <el-form-item
        label="套餐名称"
        prop="name"
        :rules="[{ required: true, message: '请填写套餐名称' }]"
      >
        <el-input v-model="form.name" maxlength="100" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree
          ref="treeRef"
          :data="tree"
          node-key="id"
          :props="{ label: 'label' }"
          show-checkbox
          check-strictly
          default-expand-all
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editing = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { ElMessage, type FormInstance, type ElTree } from 'element-plus';
  import { tenantApi } from '../index';
  import type { TenantPackage } from '../type';
  const emit = defineEmits(['saved']);
  const { t, te } = useI18n();
  const visible = ref(false),
    editing = ref(false),
    loading = ref(false),
    saving = ref(false);
  const packages = ref<TenantPackage[]>([]),
    formRef = ref<FormInstance>(),
    treeRef = ref<InstanceType<typeof ElTree>>();
  const form = ref({ id: '', name: '', status: 1 });
  interface Node {
    id: string;
    label: string;
    parentId: string;
    children: Node[];
  }
  const tree = ref<Node[]>([]);
  async function load() {
    loading.value = true;
    try {
      packages.value = (await tenantApi.packages()).data || [];
    } finally {
      loading.value = false;
    }
  }
  async function open() {
    visible.value = true;
    await load();
  }
  async function edit(p?: TenantPackage) {
    const menus = (await tenantApi.menus()).data || [];
    const map = new Map<string, Node>();
    for (const m of menus) {
      const id = String(m.id);
      map.set(id, {
        id,
        label:
          m.languageCode && te(m.languageCode)
            ? t(m.languageCode)
            : /[ÃÂèåæäç]/.test(m.name || '')
              ? m.permission || String(m.id)
              : m.name || m.permission,
        parentId: String(m.parentId || '0'),
        children: [],
      });
    }
    tree.value = [];
    for (const n of map.values()) {
      const parent = map.get(n.parentId);
      if (parent) parent.children.push(n);
      else tree.value.push(n);
    }
    form.value = p ? { id: p.id, name: p.name, status: p.status } : { id: '', name: '', status: 1 };
    editing.value = true;
    await nextTick();
    treeRef.value?.setCheckedKeys(p?.functionIds?.split(',') || []);
  }
  async function save() {
    if (saving.value || !(await formRef.value?.validate().catch(() => false))) return;
    const ids = (treeRef.value?.getCheckedKeys() || []).map(String);
    if (!ids.length) {
      ElMessage.warning('请选择套餐菜单权限');
      return;
    }
    saving.value = true;
    try {
      await tenantApi.savePackage({ ...form.value, functionIds: ids });
      ElMessage.success('套餐保存成功');
      editing.value = false;
      await load();
      emit('saved');
    } finally {
      saving.value = false;
    }
  }
  defineExpose({ open });
</script>
<style scoped>
  .package-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  .el-tree {
    max-height: 420px;
    overflow: auto;
    width: 100%;
  }
</style>
