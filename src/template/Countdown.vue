<template>
  <div id="ux-countdown" class="align-center cursor-text no-select" v-text="timerText"></div>
</template>

<script>
  export default {
    name: 'uxCountdown',
    props: {
      startTime: {type: Date, default: new Date()}, // 开始时间
      endTime: {type: Date, default: new Date()}, // 结束时间
      placeholder: {type: String, default: '活动已结束'}, // 倒计时完成后的文字展示
      format: {type: String, default: '$$$'}, // 倒计时格式[天?时?分?秒]
      step: {type: Number, default: 1000}// 倒计时跨度[毫秒]
    },
    data () {
      return {
        timer: new Function(), // 计时器
        timerText: '--时--分--秒'
      }
    },
    computed: {
      timeDifference () { // 时间差值[毫秒]
        const {startTime, endTime} = this
        return endTime.getTime() - startTime.getTime()
      }
    },
    mounted () {
      return this.timerFn()
    },
    methods: {
      timerFn () {
        const {format, timeDifference, timerText, step, placeholder, output} = this,
          isFormat = format.replace(/\s/g, '').length > 0 && format.replace(/\s/g, '').length <= 4
        let presentTime = timeDifference / 1000
        if (timeDifference <= step) return this.timerText = placeholder
        return isFormat ? this.timer = setInterval(() => {
          if (presentTime < step / 1000) {
            this.timerText = placeholder
            return clearInterval(this.timer)
          }
          switch (format.replace(/\s/g, '').length) {
            case 1:
              this.timerText = `${Math.floor(presentTime)}秒`
              break
            case 2:
              this.timerText = `${Math.floor(presentTime / 60)}分${Math.floor(presentTime % 60)}秒`
              break
            case 3:
              this.timerText = `${Math.floor(presentTime / 3600)}时${Math.floor(presentTime % 3600 / 60)}分${Math.floor(presentTime % 3600 % 60)}秒`
              break
            case 4:
              this.timerText = `${Math.floor(presentTime / 86400)}天${Math.floor(presentTime % 86400 / 3600)}时${Math.floor(presentTime % 86400 % 3600 / 60)}分${Math.floor(presentTime % 86400 % 3600 % 60)}秒`
              break
            default:
              this.timerText = timerText
              break
          }
          presentTime -= step / 1000
          return output('time', `---Countdown组件倒计时循环代码正在执行---`, timeDifference / 1000 - presentTime)
        }, 1000) : null
      },
      output (type, content, count) { // 控制台输出
        if (location.origin.includes('http://localhost:')) {
          console.dir(content)
          console.info(`UX_Carousel run ${count} times. --https://github.com/noteScript`)
        }
        return false
      }
    },
    destroyed () { // 销毁之前清除计时器
      return clearInterval(this.timer)
    },
  }
</script>

<style scoped>
  #ux-countdown {
    display: inline-block;
  }
</style>
