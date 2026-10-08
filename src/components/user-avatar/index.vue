<template>
  <el-image
    v-if="preview"
    :src="resolvedSrc"
    class="user-avatar"
    fit="cover"
    :preview-src-list="[resolvedSrc]"
    :initial-index="0"
    preview-teleported
    @error="failed = true"
  >
    <template #error><img :src="defaultAvatar" alt="用户头像" class="avatar-fallback" /></template>
  </el-image>
  <img v-else :src="resolvedSrc" alt="用户头像" class="user-avatar" @error="failed = true" />
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import defaultAvatar from '/@/assets/default-avatar.svg';

  const props = defineProps<{ src?: string | null; preview?: boolean }>();
  const failed = ref(false);
  const resolvedSrc = computed(() => (!failed.value && props.src?.trim()) || defaultAvatar);
  watch(
    () => props.src,
    () => {
      failed.value = false;
    }
  );
</script>

<style scoped>
  .avatar-fallback {
    width: 100%;
    height: 100%;
  }
  .user-avatar {
    display: inline-block;
    object-fit: cover;
    border-radius: 50%;
    vertical-align: middle;
  }
</style>
