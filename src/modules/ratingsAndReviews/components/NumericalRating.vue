<template >
    <div 
        class="d-flex align-items-center justify-content-center align-self-center bg-primary rounded-circle p-2 text-white"
        :style="`width:${size}px;height:${size}px;`">
        <h1 :style="`font-size: ${numberFontSize}px;`">
            {{ rating }}<span style="font-size: 14px;">/5</span>
        </h1>
    </div>
</template>
<script lang="ts">

import { defineComponent } from "vue";

export default defineComponent({
    props: {
        rating: Number,
        numberFontSize:{
            required: false,
            default:80,
            type:Number
        },
        size:{
            required: false,
            default:100,
            type:Number
        }
    }
})
</script>
<style lang="">
    
</style>