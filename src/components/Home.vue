<template>
  <div id="home">
    <img src="../assets/images/logo.png" alt="LOGO">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      msg: 'Hello Vue.js',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#home{
text-align: center;
}
</style>
