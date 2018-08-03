<template>
  <div id="ux_poptip"
       class="relative-box"
       @click.stop="clickMethod"
       @mouseover="hoverMethod"
       @mouseout="endMethod">
    <slot></slot>
    <span v-if="type" class="absolute-box poptip-message fadeIn animated" :placement="placement">
      <i v-if="icon" :class="['fa',icon]"></i>
      <em v-text="content"></em>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'uxPoptip',
    props: {
      trigger: {type: String, default: 'hover'}, // 触发条件
      placement: {type: String, default: 'top'}, // 触发条件位置
      content: {type: String, default: ''}, // 提示的文字信息
      icon: {type: String} // 提示语前面的图标
    },
    data () {
      return {
        type: false, // 是否显示
      }
    },
    methods: {
      clickMethod () {
        return this.trigger === 'click' && (this.type = true)
      },
      hoverMethod () {
        return this.trigger === 'hover' && (this.type = true)
      },
      endMethod () {
        return this.type = false
      },
    },
  }
</script>

<style scoped>
  #ux_poptip {
    display: inline-block;
  }

  em {
    font-style: normal;

  }

  .fa {
    color: #2d8cf0;
    margin-right: .2em
  }

  .poptip-message {
    font-size: .9em;
    background-color: rgb(91, 95, 109);
    color: #fff;
    padding: .45em .56em;
    border-radius: 3px;
    display: inline-block;
  }

  .poptip-message::before {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
  }

  .poptip-message[placement="top"] {
    top: -5em;
  }

  .poptip-message[placement="top"], .poptip-message[placement="bottom"] {
    left: 0;
  }

  .poptip-message[placement="top"]::before, .poptip-message[placement="bottom"]::before {
    border-right: .56em solid transparent;
    border-left: .56em solid transparent;
    left: .56em;
  }

  .poptip-message[placement="top"]::before {
    border-top: .56em solid rgb(91, 95, 109);
    bottom: -.56em;
  }

  .poptip-message[placement="bottom"] {
    bottom: -5em;
  }

  .poptip-message[placement="bottom"]::before {
    border-bottom: .56em solid rgb(91, 95, 109);
    top: -.56em;
  }

  .poptip-message[placement="left"] {
    left: -9em;
    top: 0;
  }

  .poptip-message[placement="left"], .poptip-message[placement="right"] {
    top: 0;
  }

  .poptip-message[placement="left"]::before, .poptip-message[placement="right"]::before {
    border-top: .56em solid transparent;
    border-bottom: .56em solid transparent;
    top: .56em;
  }

  .poptip-message[placement="left"]::before {
    border-left: .56em solid rgb(91, 95, 109);
    right: -.56em;
  }

  .poptip-message[placement="right"] {
    right: -9em;
    top: 0
  }

  .poptip-message[placement="right"]::before {
    border-right: .56em solid rgb(91, 95, 109);
    left: -.56em;
  }
</style>
