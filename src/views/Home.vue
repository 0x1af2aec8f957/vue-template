<template>
  <div id="home">
    <h3 class="home">组件内事件</h3>
    <section>
      <span>count: ==> {{ count }} </span>
      <button @click="increment">count++</button>
    </section>
    <h3>vuex事件</h3>
    <section>
      <p>全局 ==> {{ a }}</p>
      <p>module_1 ==> {{msg}} <button @click="fetchMsg">fetchMsg msg</button></p>
    </section>
    <h3>mock数据及http插件</h3>
    <section>
      <button @click="fetchMockTest">调用fetchMockTest获取mock数据</button>
      <p>mockData ==> {{mockData || '- -'}}</p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapState, mapActions } from 'vuex'; /// https://github.com/ktsn/vuex-class/
import api from '../api/fetchTest';

interface State{
  count: number;
  mockData: object | string
}

export default defineComponent({
    name: 'home',
    /* props: {
        callback: {
            type: Function as PropType<() => void> // 类型批注
        }
    }, */
    data(): State {
        return {
            count: 0,
            mockData: '- -'
        };
    },
    computed: {
        ...mapState('module_1', ['msg'])
    },
    methods: {
        ...mapActions('module_1', ['fetchMsg']),
        increment():void {
            this.count++;
        },
        decrement():void {
            this.count--;
        },
        fetchMockTest(): void {
            api.fetchMockTest().then((r: object): void => {
                this.$data.mockData = JSON.stringify(r, null, 2);
            });
        }
    },
    mounted(): void {
        // console.log('mounted');
    },
    unmounted(): void {
    }
});
</script>

<style scoped>
#home,
.home {
  color: red;
}
</style>
