<template>
<div id="ux_select" :class="['relative-box','cursor-pointer',type&&'active']" @mousedown.stop="typeChange">
  <p :class="[value&&label&&'select-box','selected-placeholder','items-center']" v-text="label||value||placeholder"></p>
  <div class="absolute-box option-box" v-show="type">
    <slot>
      <p class="no-select" style="font-size: 1em;color:red">Select is not slot</p>
    </slot>
  </div>
</div>
</template>

<script>
export default {
  name: 'uxSelect',
  props: {
    value: [String, Number, Boolean, Function, Object, Array, Symbol], // 父组件的默认值[:value]
    placeholder: {
      type: String,
      default: '请选择...',
    }, // input_placeholder提示文字
  },
  data() {
    return {
      type: false, // 初始化option展开状态
      label: '', // select需要展示的字段
      optionEl: document.querySelector('.option-box'), // 存储element元素
    }
  },
  watch: {
    type(n, o) {
      return n && this.$nextTick(() => { // 确保DOM已经完成渲染
        this.optionEl = this.$el.querySelector('.option-box') // 再一次重置option的DOM
        this.uiUpdate() // 更新用户UI视图
        for (let x of this.optionEl.children) x.onmousedown = event => { // onclick可以覆盖，无需解绑事件
          // event.stopPropagation()||event.preventDefault()
          // event = event.target,
          this.label = this.getLabel(event.target)
          /* 更新父组件展示的数据 */
          this.$emit('input', this.getValue(event.target))
          /* 更新父组件value */
          this.$emit('change', this.getValue(event.target))
          return false
          /* 触发父组件change事件 */
        }
      })
    },
    value() {
      this.init()
    },
  },
  mounted() {
    this.$nextTick(() => this.init()) // 初始化视图数据
    return window.addEventListener ? document.addEventListener('mousedown', this.optionHide) : document.attachEvent(
      'mousedown', this.optionHide)
  },
  beforeDestroy() {
    window.removeEventListener ? document.removeEventListener('mousedown', this.optionHide) : document.detachEvent(
      'mousedown', this.optionHide)
  },
  methods: {
    init() { // 首次更新视图
      this.optionEl = this.$el.querySelector('.option-box') // 获取当前组件的option节点
      let label = ''
      for (let x of this.optionEl.children) label = this.value == this.getValue(x) ? this.getLabel(x) : label
      return this.label = label
    },
    getValue(element) { // 获取slot的value
      return element.getAttribute('value')
    },
    getLabel(element) { // 获取slot的label
      return element.getAttribute('label')
    },
    uiUpdate(callback) { // 更新UI视图
      for (let x of this.optionEl.children) this.value == this.getValue(x) ?
        x.classList.add('active') :
        x.classList.remove('active')
      return callback && callback()
    },
    optionHide() {
      return this.type = false
    },
    typeChange(event) { // 使得滚动条可点击[拖动]
      if (event.target === this.optionEl) return false
      else return this.type = !this.type
    }
  },
  updated() {
    this.init() // 视图纠正
  },
}
</script>

<style scoped>
#ux_select {
  display: inline-block;
  border: .1em solid #dddee1;
  padding: 2% 2em 2% 2%;
  color: #bbbec4;
  border-radius: .2em;
  min-width: 10em;
}

#ux_select,
.option-box,
#ux_select::after,
.option-box>* {
  transition: all .2s ease-in-out;
}

#ux_select::after {
  content: "\f0d7";
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  position: absolute;
  right: .5em;
  top: 50%;
  transform: translateY(-50%);
  color: #80848f
}

#ux_select:hover {
  border-color: #57a3f3;
}

#ux_select[class~="active"] {
  border-color: #57a3f3;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
}

#ux_select[class~="active"]::after {
  transform: translateY(-50%) rotate(180deg);
}

.select-box {
  color: #495060
}

.option-box {
  transform-origin: center top 0;
  left: 0;
  top: 115%;
  right: 0;
  max-height: 14em;
  overflow: auto;
  padding: .5em 0;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: .1em;
  box-shadow: 0 .1em .5em rgba(0, 0, 0, .2);
  z-index: 900;
}

.option-box>* {
  padding: 3% 3%;
  background-color: transparent;
}

.option-box>*:hover {
  background-color: #495060;
  color: #ffffff;
}

.option-box>.active {
  color: #fff;
  background: rgba(45, 140, 240, .9);
}

.selected-placeholder {
  height: 100%;
  width: 100%;
}

/*.selected-placeholder {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }*/
</style>
