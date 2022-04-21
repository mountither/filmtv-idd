<template>
    <slot></slot>
    <!-- Placeholder div for infinite api scroll -->
    <div v-if="media?.data?.length" v-observe-visibility="visibilityChanged"></div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { MediaDataList } from "./types";

export default defineComponent({
    props: {
        media: {} as PropType<MediaDataList>,
        page: Number,
        pageIncrementHandler: Function,
        nextPageHandler: Function
    },
    methods: {
        //* invoked everytime page approaches div @ bottom
        async visibilityChanged(isVisible: Boolean) {
            if (!isVisible || !this.media || !this.media.totalPages || !this.page || !this.nextPageHandler || !this.pageIncrementHandler) return;

            //go to next page if not last page.
            if (this.page <= this.media.totalPages) {
                this.pageIncrementHandler()
                // call method append new data. 
                await this.nextPageHandler();
            }
        },
    },

})
</script>
<style lang="">
    
</style>