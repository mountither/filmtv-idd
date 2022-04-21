<template >
    <span :class="`rounded-circle p-0 mx-2`" :style="{
        height: `${size}px`,
        width: `${size}px`,
        backgroundColor: `${colour}`
    }" />
</template>
<script setup lang="ts">

type Props = {
    colour: string,
    size?: string
}

const { colour, size } = withDefaults(defineProps<Props>(), {
    colour: "",
    size: "10"
})


</script>