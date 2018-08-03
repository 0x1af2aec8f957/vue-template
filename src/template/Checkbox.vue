<template>
  <div id="ux_checkbox">
    <span v-for="(x,i) in data"
          :class="['checkbox-box','cursor-pointer',value.includes(x[selected]||x)&&'active']"
          :key="(x[selected]||x)+i"
          @click.stop="clickMethods(x)"
          v-text="x[label]||x">
        </span>
  </div>
</template>

<script>
  export default {
    name: 'uxCheckbox',
    props: [
      'data', // 多选列表的数据
      'value', // 父组件的默认值[:value==>Arry]
      'label', // 用户界面展示的文字信息[key]
      'selected', // 选择时保存的数据[key]
    ],
    methods: {
      clickMethods (e) {
        e = e[this.selected] || e // 获取到需要的数据
        return this.value.includes(e)
          ? this.value.splice(this.value.findIndex(value => value === e), 1)
          : this.value.push(e)
      },
    },
  }
</script>

<style scoped>
  #ux_checkbox{
    display: inline-block;
  }
  .checkbox-box {
    margin-top: .5em;
    padding: .15em;
    border-radius: 2px;
  }

  .checkbox-box::before {
    content: "\f14a";
    font-family: 'Font Awesome 5 Free';
    margin-right: .35em;
    transition: all .2s ease-in-out;
    color: #dddee1;
    font-weight: 900;
  }

  .checkbox-box:not(:first-child) {
    margin-left: .5em;
  }

  .checkbox-box.active,.checkbox-box.active:before {
    color: #2d8cf0;
  }
</style>
