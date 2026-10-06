<template>
  <header class="console-hero">
    <div class="hero-copy">
      <p class="hero-eyebrow">{{ scene.eyebrow }}</p>
      <h1>{{ scene.title }}</h1>
      <p class="hero-description">{{ scene.description }}</p>
      <span class="source-label">
        <span></span>
        {{ scene.key === 'base' ? '系统数据 · 实时接口' : '布局预览 · 示例数据' }}
      </span>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="art-orbit"></div>
      <div class="art-card">
        <SvgIcon :name="scene.icon" :size="36" />
        <span>{{ scene.label }}</span>
        <div class="art-bars">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
      <div class="art-badge">MMS / PLUS</div>
    </div>
  </header>
</template>
<script setup lang="ts">
  import type { scenes } from '../scenes';
  defineProps<{ scene: (typeof scenes)[number] }>();
</script>
