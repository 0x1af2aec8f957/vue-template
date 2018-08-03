<template>
  <div id="ux_progress" class="relative-box" :currentProgress="`${percent}%`">
    <span :class="['absolute-box', 'progress-box',status,percent===100&&'cursor-wait']"
          :style="{width:`${percent}%`}"></span>
  </div>
</template>

<script>
  export default {
    name: 'uxProgress',
    props: {
      percent: {type: Number, default: 0}, // 进度[百分比]
      status: {type: String, default: 'success'}, // 状态[颜色]
      vertical: {type: Boolean, default: false}, //垂直方向显示
    },
  }
</script>

<style scoped>
  #ux_progress {
    background-color: #f3f3f3;
    min-height: .789em;
    border-radius: 100px;
    width: calc(100% - 3em);
  }

  #ux_progress::after {
    content: attr(currentProgress);
    position: absolute;
    right: -3em;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: .5em;
    width: 3em;
    text-align: center;
  }

  .progress-box {
    top: 0;
    bottom: 0;
    border-radius: 100px;
  }

  .success {
    background-color: #19be6b;
  }

  .warning {
    background-color: #f5a623;
  }

  .error {
    background-color: #ed3f14;
  }
</style>
