<template>
  <div id="ux_timeLine" :class="['relative-box',pending&&'pending-line']">
    <div class="relative-box timeLine-box" v-for="(x,i) in data" :key="x.title+i">
      <i :class="['fa', x.icon||'fa-circle', 'absolute-box']" :style="{color:x.color||'#2d8cf0'}"></i>
      <div :class="[`timeLine-slot-${i+1}`]">
        <p :name="`timeLine-name-${i+1}`" class="timeLine-title" v-text="x.title"></p>
        <p :name="`timeLine-info-${i+1}`" class="timeLine-info" v-text="x.info"></p>
      </div>
    </div>
    <div v-if="pending" class="relative-box timeLine-box timeLine-pending no-select cursor-pointer">
      <i class="fa-circle-notch fa absolute-box" :style="{color:'#2d8cf0'}"></i>
      <slot name="pending">
        <!--幽灵节点-->
        <p class="timeLine-slot-pending cursor-wait">敬请期待</p>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'uxTimeline',
    props: {
      data: {type: Array, required: true}, // 时间轴循环的数组
      pending: {type: Boolean, default: false}, // 幽灵节点
    },
  }
</script>

<style scoped>
  #ux_timeLine {
    display: inline-block;
    padding: 1em
  }

  #ux_timeLine::before {
    content: "";
    position: absolute;
    width: .1em;
    background-color: #e9eaec;
    top: 1.8em;
    bottom: 4.45em;
    left: 1.45em;
    z-index: 5;
  }

  .pending-line::before {
    bottom: 3.5em !important;
  }

  .timeLine-box {
    padding: 0 .5em 1.3em .01em
  }

  .fa:not(.fa-circle-notch) {
    font-weight: 300;
  }

  .fa {
    z-index: 10;
    top: .18em;
    left: 0;
    background-color: #fff;
    padding: .05px;
  }

  [class*="timeLine-slot-"], .fa-circle-notch + * {
    padding-left: 1.5em
  }

  .timeLine-title {
    font-weight: 600;
    font-size: 1em;
  }

  .timeLine-info {
    font-weight: 400;
  }

  .timeLine-info, .fa-circle-notch + * {
    font-size: 1em;
  }

  .fa-circle-notch + * {
    color: #2d8cf0;
  }
</style>
