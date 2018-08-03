<template>
  <div id="ux_collapse">
    <h5 :class="['collapse-title', 'cursor-pointer',type&&'active']" v-text="title" @click.stop="type=!type"></h5>
    <div :class="['collapse-info',type?'active':'noHeight']">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'uxCollapse',
    props: ['title'],
    data () {
      return {
        type: false // 激活状态
      }
    },
  }
</script>

<style scoped>
  #ux_collapse {
    overflow: hidden;
    border-bottom: .1em solid #dddee1;
  }

  .collapse-title {
    min-height: .5em;
    padding: .5em 0 .5em 1em;
    color: #666;
    background-color: #f7f7f7;
    font-weight: 400;
  }

  .collapse-info {
    transition: all .2s ease-in-out;
    overflow: hidden;
    background-color: white;
    font-size: 1em;
    padding-left: 1.85em;
    padding-right: 1.85em;
    border-left: .1em solid #dddee1;
    border-right: .1em solid #dddee1;
  }

  .collapse-info.active {
    padding-top: 1em;
    padding-bottom: 1em;
  }

  .noHeight {
    height: 0 !important;
  }

  .collapse-title::before {
    content: "\f0da";
    margin-right: .8em;
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    display: inline-block;
    transition: all .2s ease-in-out;
  }

  .collapse-title.active::before {
    transform: rotate(90deg);
  }
</style>
