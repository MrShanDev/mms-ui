<template>
  <div
    :class="[enterShow ? inCss : '', leaveShow ? outCss : '', 'cursor-pointer ' + css]"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts" name="animate">
  import { ref } from 'vue';
  import 'animate.css';
  // 定义父组件传过来的值
  defineProps({
    css: {
      type: String,
      default: () => '',
    },
    inCss: {
      type: String,
      default: () => 'animate__pulse',
    },
    outCss: {
      type: String,
      default: () => 'animate__subse',
    },
  });
  const enterShow = ref(false);
  const leaveShow = ref(false);
  const onMouseenter = () => {
    enterShow.value = true;
    leaveShow.value = false;
  };
  const onMouseleave = () => {
    enterShow.value = false;
    leaveShow.value = true;
  };

  defineExpose({
    enterShow,
    leaveShow,
    onMouseenter,
    onMouseleave,
  });
</script>
<style lang="scss" scoped>
  .animate__pulse {
    -webkit-animation-name: pulses;
    animation-name: pulses;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    animation: pulses 1s;
    animation-fill-mode: both;
  }
  .animate__subse {
    -webkit-animation-name: subses;
    animation-name: subses;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    animation: subses 0.4s;
    animation-fill-mode: both;
  }

  @keyframes pulses {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
    to {
      -webkit-transform: scale3d(1.05, 1.05, 1.05);
      transform: scale3d(1.05, 1.05, 1.05);
    }
  }

  @keyframes subses {
    from {
      -webkit-transform: scale3d(105%, 105%, 105%);
      transform: scale3d(105%, 105%, 105%);
    }
    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  .at-item {
    color: #3079ed;
    font-weight: bold;
    //font-size:1em;
    animation-name: focus-in-contract;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: none;

    /* shorthand
  animation: focus-in-contract 1s linear 0s 1 normal none;*/
  }
  @keyframes focus-in-contract {
    0% {
      letter-spacing: 0.5em;
      filter: blur(12px);
      opacity: 0;
    }
    100% {
      filter: blur(0);
      opacity: 1;
    }
  }
</style>
