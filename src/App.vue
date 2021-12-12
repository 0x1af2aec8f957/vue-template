<template>
  <router-view :key="renderKey"/>
</template>

<script lang="ts">
// import type { App, WatchCallback, WatchOptions } from 'vue';
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'app',
    props: {},
    data() { return {}; },
    setup(props) {
        const { locale } = useI18n();
        const renderKey = computed(() => `app-key-${locale.value}-${Math.random()}`); // 当语言发生改变时，重新加载组件
        return {
            renderKey
        };
    },
    computed: {},
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
