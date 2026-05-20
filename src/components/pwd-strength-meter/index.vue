<template>
  <div class="pwd-strength-meter" aria-live="polite" role="status">
    <span :class="blockClass(1)">弱</span>
    <span :class="blockClass(2)">中</span>
    <span :class="blockClass(3)">强</span>
  </div>
</template>

<script setup lang="ts" name="PwdStrengthMeter">
  import { computed } from 'vue';
  import { computePasswordStrengthLevel } from '/@/utils/toolsValidate';

  const props = defineProps<{
    /** 当前密码明文，用于计算强度 */
    password: string;
  }>();

  const level = computed(() => computePasswordStrengthLevel(props.password ?? ''));

  const blockClass = (slot: 1 | 2 | 3) => {
    const lv = level.value;
    const base = 'pwd-strength-meter__block';
    if (lv === 0) {
      return { [base]: true, 'is-idle': true };
    }
    if (lv === 1) {
      if (slot === 1) {
        return { [base]: true, 'is-w1': true };
      }
      return { [base]: true, 'is-idle': true };
    }
    if (lv === 2) {
      if (slot === 1) {
        return { [base]: true, 'is-m1': true };
      }
      if (slot === 2) {
        return { [base]: true, 'is-m2': true };
      }
      return { [base]: true, 'is-idle': true };
    }
    if (slot === 1) {
      return { [base]: true, 'is-s1': true };
    }
    if (slot === 2) {
      return { [base]: true, 'is-s2': true };
    }
    return { [base]: true, 'is-s3': true };
  };
</script>

<style scoped lang="scss">
  .pwd-strength-meter {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    border-radius: 5px;
    overflow: hidden;
    user-select: none;

    &__block {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 24px;
      padding: 2px 6px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.2;
      border: none;
      border-radius: 0;
      box-sizing: border-box;
      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease;

      &:first-child {
        border-radius: 5px 0 0 5px;
      }

      &:last-child {
        border-radius: 0 5px 5px 0;
      }

      /* 中间一格：左右极细白边（50% 透明度）分隔三列 */
      &:nth-child(2) {
        border-left: 1px solid rgb(255 255 255 / 50%);
        border-right: 1px solid rgb(255 255 255 / 50%);
      }

      &.is-idle {
        background-color: #e8ecf0;
        color: #64748b;
      }

      /* 弱：仅第一格 — 玫瑰红层（深字压浅底） */
      &.is-w1 {
        background: linear-gradient(180deg, #fecdd3 0%, #fb7185 100%);
        color: #9f1239;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 35%);
      }

      /* 中：琥珀双层（浅→深） */
      &.is-m1 {
        background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
        color: #b45309;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 45%);
      }

      &.is-m2 {
        background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%);
        color: #431407;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 25%),
          inset -1px 0 0 rgb(0 0 0 / 6%);
      }

      /* 强：青绿三层（淡→中→深，同一色相递进） */
      &.is-s1 {
        background: linear-gradient(180deg, #ccfbf1 0%, #99f6e4 100%);
        color: #0f766e;
        box-shadow: inset 0 1px 0 rgb(255 255 255 / 50%);
      }

      &.is-s2 {
        background: linear-gradient(180deg, #5eead4 0%, #14b8a6 100%);
        color: #042f2e;
        box-shadow:
          inset 0 1px 0 rgb(255 255 255 / 22%),
          inset -1px 0 0 rgb(0 0 0 / 5%);
      }

      &.is-s3 {
        background: linear-gradient(180deg, #0d9488 0%, #0f5132 100%);
        color: #ffffff;
        text-shadow: 0 1px 2px rgb(0 0 0 / 28%);
        box-shadow: inset 0 -1px 0 rgb(0 0 0 / 15%);
      }
    }
  }
</style>
