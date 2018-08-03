<template>
  <div id="scrollBar" @wheel.stop.prevent="handleScroll">
    <div class="scrollBar-header-left">
      <div class="scrollBar-content-wrap">
        <div class="scrollBar-content"
             :style="{transform: `translateY(${scrollY}px)`}">
          <slot><!--内容区域--></slot>
        </div>
      </div>
      <!--<div class="scrollBar-bar-bottom">
        <div class="scroll-box-bottom" :style="{transform:`translateX(${-scrollBarX}px)`}"></div>
      </div>-->
    </div>
    <div class="scrollBar-header-right">
      <div class="scroll-box-right"
           :style="{transform:`translateY(${-scrollBarY}px)`, backgroundColor: color, height}"
           @mousedown.stop.prevent="handleDragStart"
           @mouseout.stop.prevent="handleDragEnd"
           @mousemove.stop.prevent="handleDragMove">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scrollBar',
  props: {
    color: { type: String, default: '#abaaaa' },
    height: { type: String, default: '20%' },
  },
  methods: {
    handleScroll(/* WheelEvent */{ deltaY }) {
      this.scrollY -= deltaY;
      // this.scrollX -= deltaX;
      // this.scrollZ -= deltaZ;
    },
    handleDragStart({ clientY }) {
      [this.isMouseMove, this.mouseY] = [true, clientY];
    },
    handleDragMove({ clientY }) {
      const { isMouseMove, mouseY } = this;
      if (isMouseMove) {
        const [
          scrollContentHeight,
          scrollBarHeight,
          scrollWrapHeight,
        ] = [
            document.querySelector('.scrollBar-content')?.clientHeight,
            document.querySelector('.scroll-box-right')?.clientHeight,
            this.$el?.clientHeight,
        ];

        this.scrollY = (mouseY - clientY) / ((scrollWrapHeight - scrollBarHeight) / (scrollContentHeight - scrollWrapHeight));
      }
    },
    handleDragEnd() {
      [this.isMouseMove, this.mouseY] = [false, 0];
    },
  },
  watch: {
    scrollY(n, o) {
      if (n === o) return;
      const scrollYMax = document.querySelector('.scrollBar-content').clientHeight - this.$el/* document.querySelector('.scrollBar-content-wrap') */.clientHeight;
      if (n > 0) this.scrollY = 0;
      if (Math.abs(this.scrollY) > scrollYMax) this.scrollY = -scrollYMax;
    },
  },
  data() {
    return {
      scrollY: 0,
      mouseY: 0,
      isMouseMove: false, // 允许拖动滚动条滚动
      // scrollX: 0,
      // mouseX: 0,
      // scrollZ: 0,
    };
  },
  computed: {
    scrollBarY() {
      const { scrollY } = this;
      const [
        scrollContentHeight,
        scrollBarHeight,
        scrollWrapHeight,
      ] = [
            document.querySelector('.scrollBar-content')?.clientHeight,
            document.querySelector('.scroll-box-right')?.clientHeight,
            this.$el?.clientHeight,
      ];

      return scrollContentHeight && scrollBarHeight ? (scrollWrapHeight - scrollBarHeight) / (scrollContentHeight - scrollWrapHeight) * scrollY : 0;
    },
  },
};
</script>

<style scoped lang="scss">
  #scrollBar {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .scrollBar-content-wrap {
      width: calc(100% - 1px);
      height: 100%;
      overflow: hidden;
    }

    .scrollBar-header-left, .scrollBar-bar-right {
      height: 100%;
      overflow: hidden;
    }

    .scrollBar-header-left {
      width: calc(100% - 5px);
    }

    .scrollBar-header-right {
      width: 5px;
      height: 100%;
    }

    .scrollBar-bar-bottom {
      height: 5px;
    }

    .scroll-box-bottom, .scroll-box-right {
      // background-color: #abaaaa;
      border-radius: 50px;
      cursor: pointer;
    }

    .scroll-box-bottom {
      height: 100%;
      width: 20%;
    }

    .scroll-box-right {
      height: 20%;
      width: 100%;
    }
  }
</style>
