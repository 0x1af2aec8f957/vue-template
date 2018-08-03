<template>
  <div id="app">
    <!--<Header/>-->
    <Alert/>
    <Confirm/>
    <Toast/>
    <transition name="fade" mode="out-in" appear>
      <router-view/>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import { components } from './plugins/components';
// import { mapState, mapGetters, mapActions } from './utils/common';
const { Alert, Confirm, Toast } = components;

export default {
  name: 'app',
  components: {
    // Header,
    Alert,
    Confirm,
    Toast,
  },
  computed: {},
  watch: {},
  created() {

  },
  methods: {},
};
</script>

<style lang="scss">
  #app {
    height: 100%;
  }
</style>
