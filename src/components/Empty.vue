<template>
  <!-- 空状态 -->
  <div id="empty">
    <div class="background-reset" :style="{width: `${rectSize}px`, height: `${rectSize}px`}"></div>
    <slot name="empty-text"><p class="empty-text no-margin">暂无内容</p></slot>
    <slot><!--  slot-default--></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'empty',
    props: {
        rectSize: {
            type: Number,
            default: 100
        }
    }
});
</script>

<style scoped>
#empty {
  display: inline-block;
  position: relative;
  margin: 0;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.background-reset {
  background-image: url("../assets/images/empty.png");
}

.empty-text {
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  color: #828282;
  line-height: 25px;
}
</style>
