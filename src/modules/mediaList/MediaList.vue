<template >
    <!-- Loading spinner triggered when loading data on first page initial). -->
    <div v-if="isLoadingMediaData" class="col-12 text-center mt-3">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>


    <div v-if="!isLoadingMediaData && !media?.data?.length" class="text-center mx-5">
        <h5 style="font-weight: 600;">No results found</h5>
    </div>
    <TransitionGroup v-else name="fade">
        <MediaCard class="col-auto" v-for="(item) in media.data" :key="item.id" :show-date="showMediaDate" :id="item.id"
            :title="item.title || item.name || 'untitled'" :poster-path="item.poster_path"
            :release-date="item.release_date || item.first_air_date" :media-type="mediaType || item.media_type"
            :show-media-type="showMediaTypeOnCard" style="transition-delay: 300ms;" />
    </TransitionGroup>

    <!-- Loading spinner triggered when fetching data on scroll. -->
    <div v-if="isFetchingMediaData" class="col-12 text-center mt-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue"
import type { MediaDataList } from "./types";
import MediaCard from "@/modules/media/MediaCard.vue";
import type { MediaTypes } from "../media/types";

export default defineComponent({
    data() {
        return {
            showMediaDate: true,
        }
    },
    components: {
        MediaCard
    },
    props: {
        isLoadingMediaData: Boolean,
        isFetchingMediaData: Boolean,
        media: {} as PropType<MediaDataList>,
        mediaType: String as PropType<MediaTypes | undefined>,
        showMediaTypeOnCard: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
})
</script>
<style>
</style>