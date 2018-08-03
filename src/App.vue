<template>
  <router-view :key="renderKey"/>
</template>

<script lang="ts">
// import type { App, WatchCallback, WatchOptions } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'app',
    props: {},
    data() { return {}; },
    setup(props) {},
    computed: {
        renderKey(): string { // 当语言发生改变时，重新加载组件
            const { $i18n: { locale } } = this;
            return `app-key-${locale}-${Math.random()}`;
        }
    },
    watch: {},
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeUnmount() {},
    unmounted() {}
});
</script>
