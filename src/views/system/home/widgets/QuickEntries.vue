<template>
  <div class="home-card-item mb15">
    <div class="home-card-item-title">常用入口</div>
    <div class="home-card-item-content quick-entry-grid">
      <button
        type="button"
        v-for="(item, index) in items"
        :key="index"
        @click="emit('navigate', item.path)"
        class="quick-menu-item cursor-pointer"
      >
        <div class="quick-menu-icon">
          <SvgIcon :name="item.icon" :size="24" :color="item.color" />
        </div>
        <div class="quick-menu-text">{{ item.name }}</div>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{ items: { name: string; icon: string; path: string; color: string }[] }>();
  const emit = defineEmits<{ navigate: [path: string] }>();
</script>
