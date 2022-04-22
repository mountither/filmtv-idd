<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { RouterView, useRouter } from 'vue-router';

const { currentRoute } = useRouter()

const layout = computed(
  () => { return `${currentRoute.value.meta.layout}-layout` }
)
</script>

<template>
  <component :is="layout">
    <RouterView :key="$route.path" />
  </component>
</template>

<style lang="scss">
@import "@/assets/sass/main.scss";
@import "@/assets/sass/animations.scss";
@import "@/assets/sass/font.scss";
@import "@/assets/sass/scrollbar.scss";
@import "@/assets/sass/customgrid.scss";

@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

html,
body {
  font-family: "IBM Plex Sans", sans-serif;
  background-color: var(--bs-light);
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  font-family: "IBM Plex Sans", sans-serif;
}
</style>
