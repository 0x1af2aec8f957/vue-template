<template>
    <!-- iframe 组件 -->
    <iframe @load="handleLoad" v-bind="otherProps" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
  
  export default defineComponent({
      name: 'iframe',
      props: {
        needFixInputFontSize: { // 是否需要修复在 iOS 上 input 字体小于16px 时，聚焦会被放大的问题
            type: Boolean,
            default: false,
        },
        src: {
            type: String,
            required: true,
        }
      },
      setup({ needFixInputFontSize, ...otherProps}, { emit }) {
          return {
            otherProps,
            handleLoad: (event: Event) => {
                if (needFixInputFontSize) {
                    const metaEl = document.createElement('meta');
                    metaEl.setAttribute('name', 'viewport')
                    metaEl.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    document.head.append(metaEl);
                }

                emit('onLoad', event);
            }
          }
      },
  });
</script>