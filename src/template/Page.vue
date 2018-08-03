<template>
  <div id="ux_page" class="flex-wrap text-overflow align-center">
    <span class="page-previous align-center cursor-pointer"
          @click.stop="value>1&&$emit('input',value-1)">上一页</span>
    <span v-for="(x,i) in pageNumber"
          :class="['page-box','align-center','cursor-pointer',value===x&&'active']"
          :key="x.toString()+i"
          v-text="x"
          @click.stop="$emit('input',x)">
    </span>
    <span class="page-next align-center cursor-pointer"
          @click.stop="value<pageNumber&&$emit('input',value+1)">下一页</span>
  </div>
</template>

<script>
  export default {
    name: 'uxPage',
    props: {
      total: {type: Number, default: 1}, // 数据总条数
      size: {type: Number, default: 10}, // 每页数据条数
      value: {type: Number, default: 1} // 当前页数
    },
    computed: {
      pageNumber () { // 计算总页数
        return Math.ceil(this.total / this.size)
      },
    },
    data () {
      return {
        currentValue: this.value,
      }
    },
  }
</script>

<style scoped>
  .page-box {
    width: 2.6em;
    flex-basis: 2.6em;

  }

  .page-box, .page-previous, .page-next {
    height: 2.6em;
    font-size: .9em;
    border-top: .1em solid #dddee1;
    border-bottom: .1em solid #dddee1;
    transition: all .2s ease-in-out;
    background-color: #fff;
  }

  .page-previous, .page-next {
    padding: .1em .8em;
  }

  .page-previous {
    border-left: .1em solid #dddee1;
    border-right: .1em solid #dddee1;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .page-next, .page-box:not(:first-child) {
    border-right: .1em solid #dddee1;
  }

  .page-next {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .page-previous:hover, .page-next:hover, .page-box:not(.active):hover {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }

  .page-box.active {
    background-color: #2d8cf0;
    border-color: #2d8cf0;
    color: #fff
  }
</style>
