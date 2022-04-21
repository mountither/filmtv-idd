<template >
    <BrowseMediaView media-type="tv" title="Browse TV Shows" />
</template>

<script lang="ts">

import BrowseMediaView from "@/modules/mediaList/BrowseMediaView.vue";
import { defineComponent } from "vue";


export default defineComponent({
    components: {
        BrowseMediaView
    }
})


</script>
