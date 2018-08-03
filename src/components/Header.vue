<template>
  <div id="headers" class="flex-justify-content-space-between flex-align-items-center">
    <div class="c-1 text-align-center">
      <Icon icon="chevron-left"
            v-if="isBack"
            class="c-1-1"
            @click.stop="$router.back"/>
    </div>
    <div class="c-2 text-align-center">
      <p class="c-2-1">{{title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'header',
  computed: {
    title() {
      return this.$route.meta.title;
    },
    isBack() {
      const { length = window.history.length } = this.$route;
      return length > 1;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  #headers {
    background: #e67a16;
    height: 42px;
    padding: 0 32px;
    overflow: hidden;
  }

  .c-1 {
    width: 25px;
  }

  .c-2 {
    flex-grow: 1;
  }

  .c-1-1, .c-2-1 {
    font-size: 18.8px;
    color: rgba(255, 255, 255, 1);
  }

  .c-2-1 {
    font-weight: initial;
    letter-spacing: 4.666px;
  }

</style>
