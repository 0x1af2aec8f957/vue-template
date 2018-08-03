<template>
  <div id="ux_radio">
    <slot>
      <p style="font-size: 1em;color:red">Radio is not slot</p>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'uxRadio',
    props: [
      'value' // 父组件的默认值[:value]
    ],
    computed: {
      slotsBool () { // 判断slots是否已经渲染
        if (this.$slots.default) for (let x of this.$slots.default/*无名插槽*/) if (x.tag) return x // 存储携带slot节点
        return null
      },
    },
    watch: {
      value (n, o) {
        const {slotsBool} = this, value = slotsBool && this.getValue() // 后续监听用户选择事件
        return slotsBool && this.$el.firstElementChild.classList[n == value ? 'add' : 'remove']('active')
      },
    },
    mounted () {
      return this.init()
    },
    methods: {
      init () {
        this.$el.firstElementChild.classList[this.value == this.getValue() ? 'add' : 'remove']('active') // 首次初始化
        return this.$el.onclick = this.clickMethods
      },
      clickMethods (e) {
        // e = e[this.selected] || e // 获取到需要的数据
        return this.$emit('input', this.getValue()) || e.stopPropagation()
      },
      getValue () { // 获取slot的value
        return this.$el.firstElementChild.getAttribute('value')
      }
    },
  }
</script>

<style scoped>
  #ux_radio {
    display: inline-block;
  }

  #ux_radio > * {
    margin-top: .5em;
    padding: .15em;
    border-radius: 2px;
    cursor: pointer;
  }

  #ux_radio > *::before {
    content: "\f111";
    font-family: 'Font Awesome 5 Free';
    transition: color .25s ease-in-out;
    color: #dddee1;
    font-weight: 900;
    margin-right: .35em;
  }

  #ux_radio > *[class~="active"]:before {
    color: #2d8cf0;
    content: "\f192";
  }
</style>
