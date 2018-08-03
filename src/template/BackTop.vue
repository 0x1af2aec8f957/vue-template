<template>
  <transition name="custom-classes-transition"
              enter-active-class="fadeInUp"
              leave-active-class="fadeOutDown">
    <div id="ux_backTop"
         v-if="type"
         :class="['align-center', 'flex-column', 'cursor-pointer', 'animated']"
         @click.stop="clickMethod">
      <i class="fa fa-arrow-circle-up"></i>
      <p class="backTop-text text-overflow">返回到顶部</p>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'uxBackTop',
    props: {
      distance: {type: Number, default: 30} // 滚动距离达到是显示
    },
    data () {
      return {
        type: false //显示状态
      }
    },
    mounted () {
      return window.addEventListener ? window.addEventListener('scroll', this.scroll, false) : window.attachEvent(
        'scroll', this.scroll)
    },
    destroyed () { // 销毁绑定在window的事件
      return window.removeEventListener ? window.removeEventListener('scroll', this.scroll) : window.detachEvent(
        'scroll', this.scroll)
    },
    methods: {
      clickMethod () {
        return document.documentElement.scrollTop = 0
      },
      scroll () {
        return this.type = document.documentElement.scrollTop >= this.distance
      },
    },
  }
</script>

<style scoped>
  #ux_backTop {
    position: fixed;
    background-color: rgba(0, 0, 0, .6);
    border-radius: 2px;
    box-shadow: 0 .2em .3em rgba(0, 0, 0, .3);
    right: 3.666em;
    bottom: 3.666em;
    color: #fff;
    padding: .7em .7em;
    transition: all .2s ease-in-out;
    z-index: 9999;
  }

  .fa {
    color: #fff;
    font-size: 2em;
  }

  .backTop-text {
    font-size: .3em;
    font-weight: 300;
    margin-top: .666em;
  }

  #ux_backTop:hover {
    transform: translateY(-1em);
  }
</style>
