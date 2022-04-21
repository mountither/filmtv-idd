<template lang="">
     <Transition appear name="fade" mode="out-in">
                    <skeletor v-if="isLoadingData" class="rounded-3" style="width:100px;height:30px" />
                    <p :key="totalResults" v-else-if="totalResults"
                        class="text-decoration-underline text-black-50" style="font-weight: 800;">{{
                            totalResults.toLocaleString()
                        }} Results</p>
                </Transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        isLoadingData: Boolean,
        totalResults: Number || undefined,
    }
})

</script>
<style lang="">
    
</style>