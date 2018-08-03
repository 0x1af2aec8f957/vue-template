<template>
  <div id="wrap-entry">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'wrap-entry'
});
</script>
