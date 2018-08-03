<template>
  <transition name="fade" mode="out-in">
    <div id="toast" v-if="isShow">
      <p class="msg-box">{{msg}}</p>
    </div>
  </transition>
</template>

<script>
import event from '../utils/eventEmitter';

const DELAY = 1; // S

export default {
  name: 'toast',
  data() {
    return {
      isShow: false,
      msg: '',
      callBack: null,
    };
  },
  watch: {
    isShow(n, o) {
      if (n !== o && n) {
        const timer = setTimeout(() => {
          if (this.callBack === 'function') this.$nextTick(this.callBack);
          this.isShow = false;
          return clearTimeout(timer);
        }, DELAY * 1000);
      }
    },
  },
  beforeCreate() {
    event.on('toast', (response) => {
      const params = typeof response === 'string' ? {
        msg: response,
        callBack: null,
      } : response;
      this.setContent(params);
    });
  },
  beforeDestroy() {
    [this.msg, this.callBack] = ['', null];
  },
  methods: {
    setContent({ msg, callBack }) {
      [this.msg, this.callBack] = [msg, callBack];
      this.$nextTick(() => { this.isShow = true; });
    },
  },
};
</script>

<style scoped lang="scss">
  #toast {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    font-size: 20px;
    z-index: 999999;

    .msg-box{
      color:#ffffff;
      display: inline-block;
      background: black;
      border-radius: 2px;
      font-size: 1.5em;
      padding: 10px 20px;
      position: relative;
      top: -250px;
    }
  }
</style>
