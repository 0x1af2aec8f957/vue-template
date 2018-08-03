<template>
  <div id="ux_carousel" class="relative-box">
    <div class="carousel-slot flex-box relative-box" :name="animation">
      <slot>
        <p style="font-size: 1em;color:red">banner is no slot!</p>
      </slot>
    </div>
    <div
      :class="['carousel-indicator', `${position}-box`, 'flex-box','align-center',indicatorAxis==='y'&&'flex-column','cursor-pointer']"
      :indicator="indicator">
      <i v-for="(x,i) in indicatorNumber"
         :class="['indicator-box', `indicator-${i}`,index===i&&'active','relative-box']"
         @click.stop="click(i)"
         @mouseover.stop="mouseover(i)"
         @mouseout.stop="mouseout(i)">
        <!--指示器-->
        <i class="indicator-type absolute-box"></i>
      </i>
    </div>
  </div>
</template>

<script>
  let i_count = 0, s_count = 0 // 计时器运行次数统计
  export default {
    name: 'uxCarousel',
    props: {
      trigger: {type: String, default: 'hover'}, // 触发条件
      arrow: {type: String, default: 'never'}, //切换箭头显示时机
      indicator: {type: String, default: 'bottom'}, // 指示器显示位置
      position: {type: String, default: 'absolute'}, // 指示器的定位模式
      animation: {type: String, default: 'slide'}, //动画类型
      speed: {type: Number, default: 3} // 动画运动速度[单位：S]
    },
    computed: {
      indicatorNumber() { // 指示器数量
        const LEN = []
        for (let x of this.$slots.default/*无名插槽*/) x.tag && LEN.push(x) // 存储携带slot节点
        return LEN
      },
      indicatorAxis() { // 显示器坐标轴
        return (this.indicator === 'bottom' || this.indicator === 'top') ? 'x' : 'y'
      },
      time() { // 计时器运行需要的实际时间
        return this.speed * 1000
      },
    },
    watch: {
      index(n, o) { // 运动过程[主要要的动画函数]
        return this.$nextTick(() => {
          const parentEl = this.$el.querySelector('.carousel-slot'), currentEl = parentEl.children, // 运动元素
            indicatorEl = this.$el.querySelector('.active>.indicator-type'), // 正在变换的指示器
            {animation = 'slide', indicatorNumber, indicatorAxis, time, css, output} = this
          let number = 0 // 指示器宽度
          clearInterval(this.indicatorTimer) // 先清除指示器计时器
          output('indicator', `---Carousel组件已经统计出上一次分发的插槽周期内嵌套循环的次数---`, i_count)
          i_count = 0
          if (animation === 'fade') { // fade
            currentEl[o]/* 确保第一次能够正常运行 */ && currentEl[o].classList.remove('fadeIn') ||
            currentEl[n].classList.add('fadeIn') // 移除、添加动画class
          } else { // slide
            parentEl.classList[n !== 0 /* 用于无缝，需要重复第一个slot[最后一个不需要过渡作用] */ ? 'add' : 'remove']('slide-transition') ||
            css(parentEl, {transform: `translatex(-${n * 100}%)`})
          }
          this.indicatorTimer = setInterval(() => { // 指示器计时器开始运行
            indicatorAxis === 'x' ? css(indicatorEl, {width: `${number}%`}) : css(indicatorEl, {height: `${number}%`})
            number += 100 / (time / 4 /* TODO:这里的4根据反推得出的，暂时不知道这个4的误差来自哪里! */)
            i_count++
          }, 1)
        })
      }
      ,
    },
    data() {
      return {
        timer: new Function(), // 跑马灯-计时器
        indicatorTimer: new Function(), // 指示器-计时器
        index: 0 - 1, // 当前运动的索引[-1是为了首次触发index的watch事件,代码一旦运行成功后后面的值不可能出现小于0]
        num: 0,
      }
    },
    destroyed() { // 销毁之前清除计时器
      return clearInterval(this.timer), clearInterval(this.indicatorTimer)
    },
    mounted() {
      return this.index++/* 首次手动触发动画 */, this.triggerAnimation() // 后面自动触发动画
    },
    methods: {
      triggerAnimation() {
        return this.timer = setInterval(() => {
          const {index, indicatorNumber, output} = this
          this.index = index + 1 < indicatorNumber.length ? index + 1 : 0
          output('slot', `---Carousel组件插槽内循环代码正在执行---`, s_count++)
        }, this.time)
      },
      output(type, content, count) { // 控制台输出
        if (location.origin.includes('http://localhost:')) {
          console.dir(content)
          console.info(`UX_Carousel run ${count} times. --https://github.com/noteScript`)
        }
        return false
      },
      css(el, styleSheet) { // 批量操作css
        for (let [k, v] of Object.entries(styleSheet)) el.style[k] = v
        return el // 返回操作完成的element对象
      },
      click(index) {
        if (this.trigger === 'click') return clearInterval(this.timer), this.index = index, this.triggerAnimation()
        return false
      },
      mouseover(index) {
        if (this.trigger === 'hover') return clearInterval(this.timer), this.index = index
        return false
      },
      mouseout(index) {
        if (this.trigger === 'hover') return this.triggerAnimation()
        return false
      },
    },
  }
</script>

<style scoped>
  #ux_carousel {
    width: 100%;
    overflow: hidden;
  }

  .carousel-slot {
    width: auto;
  }

  .carousel-slot > * {
    min-height: 10em;
    -webkit-flex-basis: 100%;
    flex-basis: 100%;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  /*.carousel-indicator {
    width: 100%;
    overflow: hidden;
  }*/

  .indicator-type {
    background-color: #888888;
    z-index: 10;
  }

  [name="fade"] > * {
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: ivuFadeIn;
  }

  [name="fade"] > *:not(.fadeIn) {
    display: none;
  }

  [indicator="top"], [indicator="bottom"] {
    left: 0;
    right: 0;
    width: 100%;
  }

  [indicator="top"] > .active > .indicator-type, [indicator="bottom"] > .active > .indicator-type {
    top: 0;
    bottom: 0;
    left: 0;
    width: 0;
  }

  [indicator="top"] > .active, [indicator="bottom"] > .active {
    transform: scaleY(2);
  }

  [indicator="right"], [indicator="left"] {
    top: 0;
    bottom: 0;
    height: 100%
  }

  [indicator="right"] > .active, [indicator="left"] > .active {
    transform: scaleX(2);
  }

  [indicator="right"] > .active > .indicator-type, [indicator="left"] > .active > .indicator-type {
    left: 0;
    right: 0;
    top: 0;
    height: 0
  }

  .absolute-box[indicator="top"] {
    top: 2.1em
  }

  .absolute-box[indicator="right"] {
    right: 2.1em
  }

  .absolute-box[indicator="bottom"] {
    bottom: 2.1em
  }

  .relative-box[indicator="bottom"] {
    margin-top: 1em
  }

  .absolute-box[indicator="left"] {
    left: 2.1em
  }

  .indicator-box { /*横向*/
    height: .1em;
    width: 3em;
    background-color: #d7d7d7;
    overflow: hidden;
    transition: all .35s;
    margin: 0 .5em;
    z-index: 5
  }

  .flex-column > .indicator-box { /*纵向*/
    width: .25em;
    height: 2em;
    margin: .5em 0
  }

  .slide-transition {
    transition: all 1s ease-in-out;
  }

  @keyframes ivuFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
