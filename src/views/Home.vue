<template>
  <div id="home">
    <h3 class="home">组件内事件</h3>
    <section>
      <span>count: ==> {{ count }} </span>
      <button @click="increment">count++</button>
    </section>
    <h3>vuex事件</h3>
    <section>
      <p>全局 ==> {{ storeCount }}</p>
      <p>count ==> {{storeCount}} <button @click="storeIncrement">store.increment ++</button></p>
    </section>
    <h3>mock数据及http插件</h3>
    <section>
      <button @click="fetchMockTestFunc">调用fetchMockTest获取mock数据</button>
      <p>mockData ==> {{mockData || '- -'}}</p>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onActivated, getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import useTest from '../store/test';
import { fetchMockTest } from '../api/fetchTest';

export default defineComponent({
    name: 'home-view',
    setup(props, context) {
        const store = useTest();
        const count = ref<number>(0);
        const mockData = ref<string>('--');

        const { count: storeCount } = storeToRefs(store);

        const fetchMockTestFunc = () => {
            fetchMockTest().then((r: object): void => {
                mockData.value = JSON.stringify(r, null, 2);
            }).catch((err: Error) => {
              console.log('err', err);
            });
        };

        const increment = () => {
            count.value++;
        };

        const decrement = () => {
            count.value--;
        };

        /* onActivated(() => {
            console.log('home-view is activated by `KeepAlive` component');
        }); */

        return {
            count,
            storeCount,
            mockData,
            increment,
            decrement,
            storeIncrement: store.increment,
            storeDecrement: store.decrement,
            fetchMockTestFunc
        };
    }
});
</script>

<style scoped>
#home,
.home {
  color: red;
}
</style>
