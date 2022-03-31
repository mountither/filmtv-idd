<template>
    <div>
        <h1>{{title}}</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';


export default defineComponent({
    data() {
        return {
            title: "" as string,
        }
    },
    beforeRouteEnter(to: any, from: any, next: any) {
        next((vm: any) => {
            console.log('callback:', vm) // VueComponent ...
            vm.title = to.params.slug
        })
    }
})

</script>