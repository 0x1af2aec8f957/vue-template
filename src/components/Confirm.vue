<template>
<transition name="fade" mode="out-in">
  <div id="confirm" v-if="isShow"></div>
</transition>
</template>

<script>
export default {
  name: 'confirm',
  data() {
    return {
      isShow: false,
    };
  },
};
</script>

<style scoped lang="scss">

</style>
