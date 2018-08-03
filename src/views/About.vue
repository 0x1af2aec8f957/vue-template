<i18n>
  zh-CN:
  en-US:
</i18n>
<template>
  <div id="about">
    <h3 class="text-align-center">{{msg}}</h3>
  </div>
</template>

<script>
import { mapState } from '../utils/common';

const name = 'about';
export default {
  name,
  computed: {
    ...mapState(name, ['msg']),
  },
};
</script>

<style scoped lang="scss">
  h3 {
    text-indent: 10px
  }
</style>
