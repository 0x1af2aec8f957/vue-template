<template>
  <div id="app" class="align-center">
    <!--vue.root-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  beforeCreate(){ // 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
  
  },
  created(){ // 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见
  
  },
  beforeMount(){ // 在挂载开始之前被调用：相关的 render 函数首次被调用
  
  },
  mounted() { // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内
  
  },
  beforeUpdate(){ // 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器
  
  },
  updated(){ // 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之
  
  },
  activated(){ // keep-alive 组件激活时调用
  
  },
  deactivated(){ // keep-alive 组件停用时调用
  
  },
  beforeDestroy(){ // 实例销毁之前调用。在这一步，实例仍然完全可用
  
  },
  destroyed(){ // Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁
  
  },
  errorCaptured(){ // 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播
  
  }
};
</script>

<style>
  #app {
    height:100%;
    width: 100%;
  }
</style>
