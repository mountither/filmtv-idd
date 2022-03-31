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
    <RouterView />
  </component>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

html,
body {
  font-family: "IBM Plex Sans", sans-serif;
  background-color: var(--bs-light);
}

body{
  margin: 0; 
  padding: 0;
  overflow-x:hidden;
}

#app {
  font-family: "IBM Plex Sans", sans-serif;
}

// * Responsive text sizes
// Small devices (landscape phones, 576px and up)
@media (min-width: 0px) {
  body {
    font-size: 0.8em;
  }
}

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) {
  body {
    font-size: 1em;
  }
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
  body {
    font-size: 1em;
  }
}

::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

/* Track */
::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: #edf2f7;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 100vh;
  border: 3px solid #edf2f7;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}


</style>
