<template>
  <section class="system-admin-page" :data-feature="feature">
    <header class="system-admin-heading">
      <div>
        <span class="system-admin-eyebrow">{{ eyebrow }}</span>
        <h1>{{ title || info.title }}</h1>
        <p>{{ description || info.description }}</p>
      </div>
      <span class="system-admin-badge">管理工作台</span>
    </header>
    <div class="system-admin-content"><slot /></div>
  </section>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { systemFeatures, type SystemFeature } from './features';
  import './system-admin.scss';
  const props = withDefaults(defineProps<{ feature?: SystemFeature; title?: string; description?: string; eyebrow?: string }>(), { eyebrow: '系统管理' });
  const info = computed(() => props.feature ? systemFeatures[props.feature] : { title: '业务管理', description: '' });
</script>
