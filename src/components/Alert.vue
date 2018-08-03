<template>
  <div id="alert" v-if="isShow" mode="out-in">
    <div class="alert-container">
      <h1 class="alert-title">{{title}}</h1>
      <div class="alert-content">{{content}}</div>
      <div class="alert-btn">
        <button @click.stop="handleClick">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import event from '../utils/eventEmitter';

export default {
  name: 'alert',
  data() {
    return {
      isShow: false,
      title: '',
      content: '',
      callBack: null,
    };
  },
  beforeCreate() {
    event.on('alert', (response) => {
      const params = typeof response === 'string' ? {
        title: '提示',
        content: response,
        callBack: null,
      } : response;
      this.setContent(params);
    });
  },
  beforeDestroy() {
    [this.title, this.content, this.callBack] = ['', '', null];
  },
  methods: {
    setContent({ title, content, callBack }) {
      [this.title, this.content, this.callBack] = [title, content, callBack];
      this.$nextTick(() => { this.isShow = true; });
    },
    handleClick() {
      const { callBack } = this;
      this.isShow = false;
      return this.$nextTick(typeof callBack === 'function' ? callBack : (() => {}));
    },
  },
};
</script>

<style scoped lang="scss">
  #alert {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999999;

    .alert-container {
      width: 80%;
      background: #ffffff;
      border-radius: 2px;
    }
  }

  .alert-container {
    font-size: 20px;
    color: black;
    box-shadow: 4px 4px 2px #6a6c99;

    .alert-title {
      font-size: 1.8em;
      font-weight: 600;
      text-align: center;
      position: relative;
    }

    .alert-title::after {
      height: 2px;
      background: rgba(11, 14, 29, 0.5);
      left: 15px + 7.5px;
      right: 0;
      bottom: 0;
      content: '';
      position: absolute;
    }

    .alert-content {
      padding: 5px 15px;
      font-size: 1.5em;
      text-indent: 15px;
    }

    .alert-btn {
      padding: 20px 0;
      text-align: right;

      button {
        border: none;
        background: transparent;
        outline: none;
        font-size: 1.5em;
        color: #46cd78;
        margin-right: 20px;
      }
    }
  }
</style>
