<template>
  <div id="ux_slider" class="relative-box cursor-pointer" @click.stop="clickMethod">
    <i class="slider-box absolute-box cursor-grabbing no-select"
       draggable="true"
       :style="{left:`${value}%`}"
       @dragstart="start"
       @dragend="end"
       @drag="ing"
       @drop.stop="moveType=false"
    ></i>
    <span class="absolute-box slider-block" :style="{width:`${value}%`}"></span>
  </div>
</template>

<script>
  export default {
    name: 'uxSlider',
    props: {
      value: {type: Number, default: 0},
      vertical:{type:Boolean,default:false}, // 是否垂直展示
      step: {type: Number, default: 1}, // 预留进度条扩展
    },
    data () {
      return {
        moveType: false // 移动状态
      }
    },
    methods: {
      start ($event) {
        $event.dataTransfer.effectAllowed = 'move'  // 移动效果
        $event.dataTransfer.setData('text', '')  // 附加数据，　没有这一项，firefox中无法移动
        return this.moveType = true
      },
      end ($event) {
        this.moveType = false
        return $event.preventDefault() || $event.stopPropagation()
      },
      ing ($event) {
        const el = $event.target
        this.moveType && this.updateValue(el, el.parentNode)
        return $event.preventDefault() || $event.stopPropagation()  // 不取消，firefox中会触发网页跳转到查找setData中的内容
      },
      clickMethod ($event) {
        return this.updateValue(document.querySelector('.slider-box'), $event.target)
      },
      updateValue (sliderEl, slider_parentEl) { // 更新数据[更新UI视图]
        const {event: $event} = window,
          {offsetLeft, offsetWidth: sliderWidth} = sliderEl,
          {clientLeft, clientTop, offsetWidth} = slider_parentEl,
          {pageX, pageY} = $event,
          [mouseX, mouseY] = [pageX - clientLeft, pageY - clientTop]
        return pageX && pageY /*保证鼠标不为负数*/ && mouseX <= offsetWidth /*保证滑块不滑出限制范围*/ &&
          this.$emit('input', parseInt(offsetLeft >= 0 ? offsetLeft <= offsetWidth ? mouseX - sliderWidth : 100 : 0)) // 更新到父组件
      },
    },
  }
</script>

<style scoped>
  #ux_slider {
    min-width: 10em;
    min-height: .5em;
    background-color: #e9eaec;
    display: inline-block;
    border-radius: 100px;
  }

  .slider-box {
    transition: transform .2s linear;
  }

  .slider-box {
    width: .8em;
    height: .8em;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    border: .15em solid #57a3f3;
    border-radius: 100%;
    background-color: #fff;
    z-index: 100;
    transform: scale(1.2);
  }

  .slider-box::before {
    font-weight: 100;
  }

  .slider-box:hover {
    transform: scale(1.8);
  }

  .slider-block {
    background-color: #57a3f3;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    border-bottom-left-radius: 100px;
    border-top-left-radius: 100px;
  }
</style>
