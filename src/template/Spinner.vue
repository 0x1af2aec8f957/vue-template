<template>
  <div id="ux_spinner">
    <div v-if="doubleBounce" class="doubleBounce">
      <!--doubleBounce-->
      <div class="mint-spinner-double-bounce" style="width: 28px; height: 28px;">
        <div class="mint-spinner-double-bounce-bounce1" style="background-color: rgb(38, 162, 255);"></div>
        <div class="mint-spinner-double-bounce-bounce2" style="background-color: rgb(38, 162, 255);"></div>
      </div>
    </div>
    <div v-else-if="tripleBounce" class="tripleBounce">
      <!--tripleBounce-->
      <div class="mint-spinner-triple-bounce">
        <div class="mint-spinner-triple-bounce-bounce1"
             style="width: 9.33333px; height: 9.33333px; background-color: rgb(38, 162, 255);"></div>
        <div class="mint-spinner-triple-bounce-bounce2"
             style="width: 9.33333px; height: 9.33333px; background-color: rgb(38, 162, 255);"></div>
        <div class="mint-spinner-triple-bounce-bounce3"
             style="width: 9.33333px; height: 9.33333px; background-color: rgb(38, 162, 255);"></div>
      </div>
    </div>
    <div v-else class="fadingCircle">
      <!--fadingCircle-->
      <div class="mint-spinner-fading-circle circle-color-1903" style="width: 28px; height: 28px;">
        <div class="mint-spinner-fading-circle-circle is-circle2"></div>
        <div class="mint-spinner-fading-circle-circle is-circle3"></div>
        <div class="mint-spinner-fading-circle-circle is-circle4"></div>
        <div class="mint-spinner-fading-circle-circle is-circle5"></div>
        <div class="mint-spinner-fading-circle-circle is-circle6"></div>
        <div class="mint-spinner-fading-circle-circle is-circle7"></div>
        <div class="mint-spinner-fading-circle-circle is-circle8"></div>
        <div class="mint-spinner-fading-circle-circle is-circle9"></div>
        <div class="mint-spinner-fading-circle-circle is-circle10"></div>
        <div class="mint-spinner-fading-circle-circle is-circle11"></div>
        <div class="mint-spinner-fading-circle-circle is-circle12"></div>
        <div class="mint-spinner-fading-circle-circle is-circle13"></div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  //javascript code
  export default {
    name: 'uxSpinner',
    props: {
      name: {
        type: String,
        default: 'doubleBounce',
        required: true
      },
      text: null
    },
    computed: {
      doubleBounce () {
        return this.name === 'doubleBounce'
      },
      tripleBounce () {
        return this.name === 'tripleBounce'
      },
      fadingCircle () {
        return this.name === 'fadingCircle'
      }
    }
  }
</script>
<style scoped>
  .slide-fade-ente {
    transform: translateX(-100%);
    transition: all .3s ease;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
    transform: translateX(0);
  }
  .slide-fade-leave {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transform: translateX(100%);
  }
  .slide-fade-leave-active {
    transform: translateX(0);
    transition: all .3s ease;
  }
  #ux_spinner {
    background-color: #e2e2e2;
    color: #888;
    line-height: 25px;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    position: absolute;
    z-index: 99 !important;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-flow: column wrap;
    flex-flow: column wrap;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
  }
  .doubleBounce, .tripleBounce, .fadingCircle {
    display: inline-block;
  }
  .mint-spinner-double-bounce {
    position: relative;
  }
  .mint-spinner-double-bounce-bounce1, .mint-spinner-double-bounce-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    opacity: .6;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: mint-spinner-double-bounce 2s infinite ease-in-out;
    animation: mint-spinner-double-bounce 2s infinite ease-in-out;
  }
  .mint-spinner-double-bounce-bounce2 {
    /*bug solve 2017/06/27*/
    -webkit-animation-delay: -1s !important;
    animation-delay: -1s !important;
  }
  .mint-spinner-double-bounce-bounce1, .mint-spinner-double-bounce-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    opacity: .6;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: mint-spinner-double-bounce 2s infinite ease-in-out;
    animation: mint-spinner-double-bounce 2s infinite ease-in-out;
  }
  .mint-spinner-triple-bounce-bounce1 {
    -webkit-animation-delay: -.32s !important;
    animation-delay: -.32s !important;
  }
  .mint-spinner-triple-bounce-bounce2 {
    -webkit-animation-delay: -.16s !important;
    animation-delay: -.16s !important;
  }
  .mint-spinner-triple-bounce-bounce1, .mint-spinner-triple-bounce-bounce2, .mint-spinner-triple-bounce-bounce3 {
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: mint-spinner-triple-bounce 1.4s infinite ease-in-out both;
    animation: mint-spinner-triple-bounce 1.4s infinite ease-in-out both;
  }
  .mint-spinner-fading-circle {
    position: relative;
  }
  .mint-spinner-fading-circle-circle.is-circle2 {
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg);
  }
  .mint-spinner-fading-circle-circle.is-circle3 {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
  }
  .mint-spinner-fading-circle-circle.is-circle4 {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .mint-spinner-fading-circle-circle.is-circle5 {
    -webkit-transform: rotate(120deg);
    transform: rotate(120deg);
  }
  .mint-spinner-fading-circle-circle.is-circle6 {
    -webkit-transform: rotate(150deg);
    transform: rotate(150deg);
  }
  .mint-spinner-fading-circle-circle.is-circle7 {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .mint-spinner-fading-circle-circle.is-circle8 {
    -webkit-transform: rotate(210deg);
    transform: rotate(210deg);
  }
  .mint-spinner-fading-circle-circle.is-circle9 {
    -webkit-transform: rotate(240deg);
    transform: rotate(240deg);
  }
  .mint-spinner-fading-circle-circle.is-circle10 {
    -webkit-transform: rotate(270deg);
    transform: rotate(270deg);
  }
  .mint-spinner-fading-circle-circle.is-circle11 {
    -webkit-transform: rotate(300deg);
    transform: rotate(300deg);
  }
  .mint-spinner-fading-circle-circle.is-circle12 {
    -webkit-transform: rotate(330deg);
    transform: rotate(330deg);
  }
  .mint-spinner-fading-circle-circle:before {
    content: " ";
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    border-radius: 100%;
    -webkit-animation: mint-fading-circle 1.2s infinite ease-in-out both;
    animation: mint-fading-circle 1.2s infinite ease-in-out both;
    background-color: #26a2ff;
  }
  .mint-spinner-fading-circle-circle.is-circle2:before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }
  .mint-spinner-fading-circle-circle.is-circle3:before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }
  .mint-spinner-fading-circle-circle.is-circle4:before {
    -webkit-animation-delay: -.9s;
    animation-delay: -.9s;
  }
  .mint-spinner-fading-circle-circle.is-circle5:before {
    -webkit-animation-delay: -.8s;
    animation-delay: -.8s;
  }
  .mint-spinner-fading-circle-circle.is-circle6:before {
    -webkit-animation-delay: -.7s;
    animation-delay: -.7s;
  }
  .mint-spinner-fading-circle-circle.is-circle7:before {
    -webkit-animation-delay: -.6s;
    animation-delay: -.6s;
  }
  .mint-spinner-fading-circle-circle.is-circle8:before {
    -webkit-animation-delay: -.5s;
    animation-delay: -.5s;
  }
  .mint-spinner-fading-circle-circle.is-circle9:before {
    -webkit-animation-delay: -.4s;
    animation-delay: -.4s;
  }
  .mint-spinner-fading-circle-circle.is-circle10:before {
    -webkit-animation-delay: -.3s;
    animation-delay: -.3s;
  }
  .mint-spinner-fading-circle-circle.is-circle11:before {
    -webkit-animation-delay: -.2s;
    animation-delay: -.2s;
  }
  .mint-spinner-fading-circle-circle.is-circle12:before {
    -webkit-animation-delay: -.1s;
    animation-delay: -.1s;
  }
  .mint-spinner-fading-circle-circle {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
  @keyframes mint-spinner-double-bounce {
    0%, 100% {
      -webkit-transform: scale(0.0);
      transform: scale(0.0);
    }
    50% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
  @-webkit-keyframes mint-spinner-double-bounce {
    0%, 100% {
      -webkit-transform: scale(0.0);
      transform: scale(0.0);
    }
    50% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
  @-webkit-keyframes mint-spinner-triple-bounce {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
  @keyframes mint-spinner-triple-bounce {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
  @-webkit-keyframes mint-fading-circle {
    0%, 39%, 100% {
      opacity: 0
    }
    40% {
      opacity: 1
    }
  }
  @keyframes mint-fading-circle {
    0%, 39%, 100% {
      opacity: 0
    }
    40% {
      opacity: 1
    }
  }
</style>
