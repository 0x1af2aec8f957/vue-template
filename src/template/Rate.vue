<template>
  <div id="ux_rate">
    <i v-for="(x,i) in 5"
       :class="['fa','fa-star','cursor-pointer',i<value&&'active']"
       @click.stop="$emit('input',i+1)"></i>
  </div>
</template>

<script>
  export default {
    name: 'uxRate',
    props: {
      value: {type: Number, default: 0},
    },
  }
</script>

<style scoped>
  .fa-star {
    color: #e9e9e9;
    transition: color .2s linear;
  }

  .fa-star:not(:first-child) {
    margin-left: .5em;
  }

  .fa-star.active {
    color: #f5a623
  }
</style>
