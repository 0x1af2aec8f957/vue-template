<template>
  <!--example:<v_input v-model="test"></v_input> === <v_input value="test" @input="value => test = value"></v_input>-->
  <div id="ux_input" class="input-box flex-column">
    <div :class="['input-box', 'justify-between', 'items-center',icon&&'icon-box']">
      <span v-if="icon" :class="['fa','items-center','text-center',icon]"></span>
      <input :class="[icon&&'icon_input',...msg.length&&(className||'error')/*错误消息不为空时展示Input错误状态*/]"
             :type="type"
             :placeholder="placeholder"
             :value="value"
             @input="change"
             @focus="focus"
             @blur="blur"/>
    </div>
    <p v-if="msg.length"
       class="error-message"
       v-html="msg"><!--支持html排版，样式调整--></p>
  </div>
</template>

<script>
  export default {
    name: 'uxInput',
    model: { // @vue2.2+ ==> v-model 指令会查找 model 中所有的值，使用你在 prop 中指定的属性，代替之前使用 value 属性。同时它也将使用 event 中指定的事件，而不是 input 事件。
      prop: 'value', // 对应组件prop的:value
      event: 'input' // 对应组件prop的@input,如果是单选或者复选这里可以使用change
    },
    props: {
      icon: {type: String}, // ico图表显示
      value: [String, Number, Boolean, Function, Object, Array, Symbol], // 父组件的默认值[:value]
      className: {type: Array}, // 预留修改input_class
      msg: {type: String, default: ''}, // 错误消息
      type: {type: String, default: 'text'}, // input_type类型
      placeholder: {type: String, default: '请输入...'} // input_placeholder提示文字
    },
    /*data () {
      const {value: currentValue} = this
      return {currentValue}
    },*/
    methods: {
      change ($event) {
        return this.$emit('input', $event.target.value), this.$emit('change', $event.target.value)
      },
      focus ($event) {
        return this.$emit('focus', $event.target.value)
      },
      blur ($event) {
        return this.$emit('blur', $event.target.value)
      },
    },
  }
</script>

<style scoped>
  #ux_input {
    display: inline-block;
    min-width: 10em;
  }

  input {
    vertical-align: middle;
    min-height: 1.8em;
  }

  .error-message {
    color: #ed3f14;
    line-height: 2;
    text-indent: .1em;
  }

  .icon-box {
    border: 1px solid #dddee1
  }

  .input-box {
    border-radius: 2px;
  }

  .fa {
    width: 1.5em;
    flex-basis: 1.5em;
    height: 100%;
    font-size: 1em;
  }

  .icon_input, .icon_input:focus {
    box-shadow: none;
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-left: 1px solid #dddee1;
  }

  .fa + * {
    width: calc(100% - 1.5em);
    flex-basis: calc(100% - 1.5em);
  }
</style>
