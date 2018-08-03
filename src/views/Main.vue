<template>
  <div id="main">
    <Header/>
    <h1 class="text-align-center text-color-amber text-size-20">{{msg}}</h1>
    <Pagination/>
    <transition name="custom-classes-transition" enter-active-class="animated fadeIn" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import { mapState /* , mapGetters, mapActions */} from '../utils/common';
import { components } from '../plugins/components';

const { Header, Pagination } = components;

export default {
  name: 'main',
  components: { Header, Pagination },
  computed: {
    ...mapState(['msg']),
  },
  filters: {},
  mounted() {

  },
  methods: {},
};
</script>
<style scoped lang="scss">
  #main {
    /*background: $background-blue;*/
    /*min-height: calc(100% - 93px)*/
    height: 100%;

    .text-size-20 {
      font-size: 20px
    }
  }
</style>
