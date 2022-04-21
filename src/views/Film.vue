<template >
    <BrowseMediaView media-type="movie" title="Browse Movies" />
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
