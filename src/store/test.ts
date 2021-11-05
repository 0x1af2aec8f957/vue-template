import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('test', () => {
    const count = ref<number>(0);

    const increment = () => {
        count.value++;
    };
    const decrement = () => {
        count.value--;
    };

    return {
        count,
        increment,
        decrement
    };
});
