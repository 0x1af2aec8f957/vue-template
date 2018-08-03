<template>
  <span id="ux_switch" :class="['relative-box', 'cursor-pointer', value&&'active']"
        @click.stop="clickMethods(!value)"></span>
</template>

<script>
  export default {
    name: 'uxSwitch',
    props: [
      'value', // 父组件的默认值[:value==>Arry]
    ],
    methods: {
      clickMethods (e) {
        return this.$emit('input',e)
      },
    },
  }
</script>

<style scoped>
  #ux_switch {
    background-color: #ccc;
    transition: all .2s ease-in-out;
    width: 3.85em;
    height: 1.85em;
    display: inline-block;
    border-radius: 100px;
    vertical-align: middle;
    border: .1em solid #ccc;
  }

  #ux_switch::after {
    content: "";
    width: calc(1.85em - .3em);
    height: calc(1.85em - .3em);
    border-radius: 100%;
    background-color: #fff;
    position: absolute;
    left: .1em;
    top: 0;
    bottom:0;
    margin:auto;
    transition: left .2s ease-in-out, width .2s ease-in-out;
  }

  #ux_switch.active {
    border-color: #2d8cf0;
    background-color: #2d8cf0;
  }

  #ux_switch.active::after {
    left: calc(2.35em - .3em); /*3.85em-1.5em-(1px+1px+1px)*/
  }
</style>
