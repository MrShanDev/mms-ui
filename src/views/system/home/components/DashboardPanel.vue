<template>
  <article class="panel">
    <div v-if="title || $slots.actions" class="panel-heading">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
      <slot name="actions" />
    </div>
    <slot />
  </article>
</template>
<script setup lang="ts">
  defineProps<{ title?: string; description?: string }>();
</script>
