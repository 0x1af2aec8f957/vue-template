<i18n>
  zh-CN:
  en-US:
</i18n>
<template>
  <div id="home"><h3 class="text-align-center">{{msg}}</h3></div>
</template>

<script>
import { mapState } from '../utils/common';

const name = 'home';
export default {
  name,
  computed: {
    ...mapState(name, ['msg']),
  },
};
</script>

<style scoped lang="scss">
  h3 {
    text-indent: 30px
  }
</style>
