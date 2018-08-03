<template>
  <div id="ux_drag" @mousedown.stop="down" class="absolute-box cursor-move no-select"
       :style="{top:`${top}px`,left:`${left}px`}">
    <slot>
      <p style="font-size: 1em;color:red">drag is no slot!</p>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'uxDrag',
    data () {
      return {
        boxX: 0,
        boxY: 0,
        mouseX: 0,
        mouseY: 0,
        offsetX: 0,
        offsetY: 0,
        dragging: false, // 拖拽状态
        left: null,
        top: null,
      }
    },
    mounted () {
      return [this.top, this.left] = [this.$el.offsetTop, this.$el.offsetLeft],
        window.addEventListener
          ? document.addEventListener('mousemove', this.move) || document.addEventListener('mouseup', this.up)
          : document.attachEvent('mousemove', this.move) || document.attachEvent('mouseup', this.move)
    },
    destroyed () { // 销毁绑定在document的事件
      return window.removeEventListener
        ? document.removeEventListener('mousemove', this.move) || document.removeEventListener('mouseup', this.move)
        : document.detachEvent('mousemove', this.move) || document.detachEvent('mouseup', this.move)
    },
    methods: {
      down ($event) {
        return this.dragging = true,
          [this.boxX, this.boxY] = [this.$el.offsetLeft, this.$el.offsetTop],
          [this.mouseX, this.mouseY] = [parseInt(this.getMouseXY($event).x), parseInt(this.getMouseXY($event).y)],
          [this.offsetX, this.offsetY] = [this.mouseX - this.boxX, this.mouseY - this.boxY]
      },
      move ($event) {
        if (this.dragging) {
          let [x, y] = [this.getMouseXY($event).x - this.offsetX, this.getMouseXY($event).y - this.offsetY],
            [
              width,
              height,
            ] = [
              document.documentElement.clientWidth - this.$el.offsetWidth,
              document.documentElement.clientHeight - this.$el.offsetHeight]
          return [this.left, this.top] = [Math.min(Math.max(0, x), width), Math.min(Math.max(0, y), height)]
        }
        return false
      },
      up (e) {
        return this.dragging = false
      },
      getMouseXY ($event) {
        let [x, y] = [0, 0]
        $event = $event || window.event;
        [x, y] = $event.pageX
          ? [
            $event.pageX,
            $event.pageY]
          : [
            $event.clientX + document.body.scrollLeft - document.body.clientLeft,
            $event.clientY + document.body.scrollTop - document.body.clientTop]
        return {x, y}
      },
    },
  }
</script>

<style scoped>
  #ux_drag {
    display: inline-block;
    border-radius: 2px;
    min-width: 1em;
    min-height: 1em;
    border: 1px solid #dddee1;
    z-index: 99999;
    padding: 1em;
    transition: border .2s, transform .25s;
    background-color: #fff;
  }

  #ux_drag:hover {
    border-color: #2d8cf0;
  }

  #ux_drag:active {
    transform: scale(1.1);
  }
</style>
