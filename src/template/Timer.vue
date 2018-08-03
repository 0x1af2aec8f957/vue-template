<template>
<div id="ux-timer" :class="['align-center', value? 'cursor-none' : 'cursor-pointer', 'no-select']" @click.stop="activeFn" v-text="timerText||btnText"></div>
</template>

<script>
export default {
  name: 'uxTimer',
  props: {
    value: {
      type: Boolean,
      default: false
    }, // 是否激活
    focus: {
      type: String,
      default: '发送验证码'
    }, // 默认显示的文字
    template: {
      type: String,
      default: '已发送{{time}}S'
    }, // 动态展示模板,time为动态插入的计时器数值
    blur: {
      type: String,
      default: '再次发送'
    }, // 计时器完毕后展示的文字
    time: {
      type: Number,
      default: 60
    } // 重置时间[秒]
  },
  data() {
    return {
      type: -1, // -1-准备，0-已开始，1-完毕
      timerText: '', // type===1时的具体文案
      timer: new Function(), // 计时器
    }
  },
  computed: {
    btnText() { // 要展示的props文案
      const {
        focus,
        template,
        blur,
        type
      } = this
      return type === -1 ? focus : type ? blur : template
    },
  },
  watch: {
    value(n, o) {
      return n && this.timerFn()
    },
    timerText(n, o) { // 模板控制状态
      const type = n ? 0 : 1
      return this.type = type
    }
  },
  methods: {
    activeFn() {
      return this.$emit('start', this.type)
    },
    timerFn() {
      const {
        output
      } = this // 提取要展示的文案
      let {
        time
      } = this // 时间
      return this.timer = setInterval(() => {
        if (time > 0) {
          const {
            btnText
          } = this
          this.timerText = btnText.replace(/\{\{(\S*)\}\}/g, time) // 模板格式为：Mustache
          return output('time', `---Timer组件倒计时循环代码正在执行---`, time--)
        } else {
          [this.timerText] = ['', this.$emit('end', this.type), this.$emit('input', false)] // 完毕
          return clearInterval(this.timer)
        }
      }, 1000)
    },
    output(type, content, count) { // 控制台输出
      if (location.origin.includes('http://localhost:')) {
        console.dir(content)
        console.info(`UX_Carousel run ${count} times. --https://github.com/noteScript`)
      }
      return false
    }
  },
  destroyed() { // 销毁之前清除计时器
    return clearInterval(this.timer)
  },
}
</script>

<style scoped>
#ux-timer {
  /* --scoped-- */
}
</style>
