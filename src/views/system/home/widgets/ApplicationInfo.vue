<template>
  <div class="home-card-item mb15">
    <div class="home-card-item-title">应用信息</div>
    <div class="home-card-item-content">
      <div v-loading="loading" class="home-app-runtime-desc-wrap">
        <div class="app-info-note">
          <div class="app-info-note-title">系统说明</div>
          <div
            class="app-info-note-text"
            :class="{
              'app-info-note-text--pre':
                appDescribeView.mode === 'plain' || appDescribeView.mode === 'empty',
            }"
          >
            <template v-if="appDescribeView.mode === 'empty'">
              <span class="color-999">暂无说明</span>
            </template>
            <template v-else-if="appDescribeView.mode === 'plain'">
              {{ appDescribeView.text }}
            </template>
            <template v-else>
              <p v-if="appDescribeView.intro" class="app-info-note-lead">
                {{ appDescribeView.intro }}
              </p>
              <div class="app-info-note-capblock">
                <div class="app-info-note-capblock-hd">以下为技术能力概要</div>
                <ul class="app-info-note-cap-list">
                  <li
                    v-for="(item, capIx) in appCapabilityCards"
                    :key="capIx"
                    class="app-info-cap-card"
                  >
                    <div
                      class="app-info-cap-card-top"
                      :class="{ 'app-info-cap-card-top--solo': !item.headline }"
                    >
                      <span class="app-info-cap-num">{{ item.idx }}</span>
                      <span v-if="item.icon" class="app-info-cap-emoji" aria-hidden="true">
                        {{ item.icon }}
                      </span>
                      <span v-if="item.headline" class="app-info-cap-head">
                        {{ item.headline }}
                      </span>
                    </div>
                    <p class="app-info-cap-detail">{{ item.detail }}</p>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    loading: boolean;
    appDescribeView: { mode: string; text?: string; intro?: string };
    appCapabilityCards: {
      idx: string | number;
      headline?: string;
      icon?: string;
      detail: string;
    }[];
  }>();
</script>
