<template>
  <section class="system-admin-page" :data-feature="feature">
    <header class="system-admin-heading" :class="{ 'is-compact': compact }">
      <div>
        <span v-if="!compact" class="system-admin-eyebrow">{{ eyebrow }}</span>
        <h1>{{ title || info.title }}</h1>
        <p v-if="!compact">{{ description || info.description }}</p>
      </div>
      <SystemToolbar v-if="$slots.actions"><slot name="actions" /></SystemToolbar>
    </header>
    <div class="system-admin-content"><slot /></div>
  </section>
</template>
<script setup lang="ts">
  import SystemToolbar from './SystemToolbar.vue';
  import { computed } from 'vue';
  import { systemFeatures, type SystemFeature } from './features';
  import './system-admin.scss';
  const props = withDefaults(
    defineProps<{
      feature?: SystemFeature;
      title?: string;
      description?: string;
      eyebrow?: string;
      compact?: boolean;
    }>(),
    { eyebrow: '系统管理', compact: true }
  );
  const info = computed(() =>
    props.feature ? systemFeatures[props.feature] : { title: '业务管理', description: '' }
  );
</script>
