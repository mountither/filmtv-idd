<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="onClick">Click me</button>
    <input type="text" @keyup.prevent.stop.enter="onKeyPress(myinput)" v-model="myinput"/>
  </div>
</template>


<script lang="ts">

import { defineComponent } from "vue";

export default defineComponent({
  data(){
    return{
      myinput: "" as string
    }
  },
  methods: {
    onClick() {
      console.log("hello")
    },
    onKeyPress(text: string){
      console.log(text)
    }
  }
})

</script>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    align-items: center;
  }
}
</style>
