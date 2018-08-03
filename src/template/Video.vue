<template>
  <div id="ux_video">
    <canvas id="video_canvas" :width="width" :height="height">
      Your browser does not support the HTML5 canvas tag.
    </canvas>
    <div class="controls-box flex-box no-select" v-if="controls">
      <div class="play-button align-center">
        <i
          :class="['fa', isReady?isPlay?'fa-pause':'fa-play':'fa-hourglass-half', isReady?'cursor-pointer':'cursor-wait']"
          @click.stop="mediaMethod"></i>
      </div>
      <div class="progress-box relative-box text-center justify-between items-center">
        <div class="progress-plan relative-box">
          <span class="absolute-box progress-spot" :style="{width:`${percent}%`}"></span>
        </div>
        <div class="time-plan" v-text="timeText"><!--0:0:0--></div>
      </div>
    </div>
    <video id="canvas_video"
           class="absolute-box no-select"
           :src="src"
           :autoplay="autoplay"
           :controls="controls"
           :poster="poster"
           :muted="muted"
           :width="width"
           :style="{visibility:'hidden'}"
           @play="play"
           @pause="pause"
           @ended="ended"
           @durationchange="duration=$event.target.duration"
           @canplaythrough="isReady=true"
           @playing="playing"
           @volumechange="volume=$event.target.volum"
           @error="error"></video>
  </div>
</template>

<script>
  export default {
    name: 'uxVideo',
    props: {
      src: {type: String, default: 'http://www.w3school.com.cn/example/html5/mov_bbb.mp4'}, // 视频地址
      poster: {type: String}, // 视频封面
      controls: {type: Boolean}, // 显示控制条
      autoplay: {type: Boolean}, // 自动播放
      loop: {type: Boolean}, // 循环播放
      muted: {type: Boolean}, // 静音播放
      width: {type: Number, default: window.innerWidth}, // 视频画布的宽度
    },
    computed: {
      percent () { // 进度[不要使用进度条组件，为了组件之间尽可能不产生依赖]
        return 100 * this.currentTime / this.duration
      },
      ctx () { // canvas对象
        return this.canvasEl && this.canvasEl.getContext('2d')
      },
      height () { // canvas高度自适应
        return this.videoEl && this.videoEl.offsetHeight
      },
      timeText () {
        const {duration, currentTime} = this.$data,
          [durationMinute, durationSecond] = [Math.floor(duration / 60), Math.floor(duration % 60)],
          [currentMinute, currentSecond] = [Math.floor(currentTime / 60), Math.floor(currentTime % 60)]
        return `${currentMinute}:${currentSecond}/${durationMinute}:${durationSecond}`
      },
    },
    watch: {
      isReady (n, o) { // 首次初始化canvas第一帧
        const {videoEl, ctx, width, height, duration} = this
        return n && ctx.drawImage(videoEl, 0, 0, width, height) || this.$emit('ready', duration)
      },
    },
    data () {
      return {
        videoEl: document.getElementById('canvas_video'),
        canvasEl: document.getElementById('video_canvas'),
        isPlay: false, // 是否在正在播放
        isReady: false, // 资源是否就绪
        duration: 0, // 视频长度[s]
        volume: 0, // 视频音量
        currentTime: 0, // 当前视频的播放长度[s]
        timer: new Function() // 计时器
      }
    },
    mounted () {
      return [this.videoEl, this.canvasEl] = [
        this.$el.querySelector('#canvas_video'),
        this.$el.querySelector('#video_canvas')]
    },
    methods: {
      mediaMethod () { // 用户手动播放
        return this.isPlay ? this.videoEl.pause() : this.videoEl.play()
      },
      play () { // 当音频/视频已开始或不再暂停时
        const {ctx, currentTime, duration} = this
        return this.isPlay = true,
          this.$emit('play', {currentTime, duration}),
          this.timer = this.ctx && setInterval(() => {
            return this.currentTime = this.videoEl.currentTime,
              ctx.drawImage(this.videoEl, 0, 0, this.width, this.height)
          }, 1)
      },
      playing () { // 因缓冲而暂停或停止后已就绪时
        const {currentTime, duration} = this
        return this.$emit('playing', {currentTime, duration})
      },
      pause () { // 当音频/视频已暂停时
        const {currentTime, duration} = this
        return this.isPlay = false,
          this.$emit('pause', {currentTime, duration}),
          clearInterval(this.timer)
      },
      ended () { // 当目前的播放列表已结束时
        const {currentTime, duration} = this
        return this.isPlay = false,
          this.$emit('ended', {currentTime, duration}),
          clearInterval(this.timer)
      },
      error (e) { // 当在音频/视频加载期间发生错误时
        return this.$emit('error', e)
      },
    },
    destroyed () { // 销毁之前清除计时器
      return clearInterval(this.timer)
    },
  }
</script>

<style scoped>
  .fa {
    font-size: 1em;
  }

  #ux_video {
    display: inline-block;
    background-color: #efefef;
  }

  .absolute-box {
    z-index: 0;
  }

  canvas {
    border-top-left-radius: 1px;
    border-top-right-radius: 1px;
  }

  .controls-box {
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
  }

  .progress-plan {
    background-color: rgba(166, 166, 166, .5);
    height: 25%;
  }

  .progress-plan > .progress-spot { /*进度条*/
    top: 0;
    bottom: 0;
    left: 0;
    background-color: #ff6e0b;
    z-index: 2
  }

  .controls-box > *:first-child {
    flex-basis: 2em;
  }

  .controls-box > *:last-child {
    flex-basis: calc(100% - 2em);
  }

  .progress-box > *:first-child {
    flex-basis: calc(100% - 6em);
  }

  .progress-box > *:last-child {
    flex-basis: 6em;
  }

  .time-plan {
    font-size: .6em;
  }
</style>
