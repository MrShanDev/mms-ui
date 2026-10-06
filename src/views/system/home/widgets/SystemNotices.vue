<template>
  <section class="home-card-item system-notices">
    <div class="home-card-item-title home-card-notice-head">
      <span>通知公告</span>
      <el-tag v-if="items.length" size="small" effect="plain">{{ items.length }} 条未读</el-tag>
    </div>
    <div class="notice-feed" role="list" aria-label="未读公告">
      <button
        v-for="(item, index) in items.slice(0, 4)"
        :key="String(item.id ?? index)"
        type="button"
        class="notice-feed-item"
        @click="emit('open', item)"
      >
        <span class="notice-feed-dot" aria-hidden="true"></span>
        <span>
          <strong>{{ item.title }}</strong>
          <time>{{ noticeRowTime(item) }}</time>
        </span>
        <SvgIcon name="ele-ArrowRight" :size="13" />
      </button>
      <div v-if="!items.length" class="notice-feed-empty">
        公告已全部读完
        <br />
        <small>新公告将在这里展示</small>
      </div>
    </div>
    <button type="button" class="notice-feed-more" @click="emit('showAll')">
      查看全部公告
      <span aria-hidden="true">→</span>
    </button>
  </section>
</template>
<script setup lang="ts">
  import type { NoticeEntity } from '/@/views/system/notice/type';
  defineProps<{ items: NoticeEntity[]; noticeRowTime: (item: NoticeEntity) => string }>();
  const emit = defineEmits<{ open: [item: NoticeEntity]; showAll: [] }>();
</script>
