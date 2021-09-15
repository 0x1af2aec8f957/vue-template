<template>
    <!-- 图片预览·支持svg -->
    <div v-if="isSvg" class="image-preview" v-html="svgContentStr" :style="{ width: width, height: height }" ref="svgParentContainer"/> <!-- svg -->
    <img v-else class="image-preview" :src="src" :style="{ width: width, height: height }" /> <!-- image -->
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onBeforeMount, nextTick } from 'vue';
import axios from 'axios';

const props = defineProps({
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '100%'
    },
    src: {
        type: String,
        required: true
    }
});

const isSvg = computed<boolean>(() => /(\.svg)$/igm.test(props.src)); // 是否是svg格式的图片
const svgContentStr = ref<string>(''); // svg字符串内容
const svgParentContainer = ref<HTMLElement>(document.body);

onBeforeMount(() => {
    if (isSvg.value) { // 如果是svg就加载svg图片
        axios.get(props.src).then(({ data }) => {
            svgContentStr.value = data; // 保存svg内容
            nextTick(() => {
                const svgEl = svgParentContainer.value.querySelector('svg');
                if (svgEl !== null) {
                    const svgRect: DOMRect = svgEl.getBBox();
                    svgEl.setAttribute('viewBox', `${svgRect.x} ${svgRect.y} ${svgRect.width} ${svgRect.height}`); // 让svg自适应展示
                }
            });
        });
    }
});
</script>

<style scoped lang="scss">
.image-preview {
  overflow: hidden;
  background-color: transparent;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;

  :deep(svg) {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
