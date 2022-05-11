<template>
  <div id="wrap-entry">
    <router-view #default="{ Component }">
      <!-- 支持需要缓存的路由 -->
      <component :is="$route.meta.keepAlive ? KeepAlive : Component">
         <component :is="Component" v-if="$route.meta.keepAlive"/>
      </component>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { KeepAlive } from 'vue';
</script>
