<template>
    <div class="row">
        <div class="col-lg-5 align-self-center mt-3 mt-lg-0 w-100">
            <h4>Recommendations</h4>
            <hr class="my-2" />
            <div class="container-full d-flex px-3 pb-2 px-xl-0 flex-row gap-2"
                style="overflow-x: auto; overflow-y: hidden;">
                <MediaCard v-for="(item, index) in mediaData" :key="item.id" :id="item.id"
                    :title="item.title || item.name || 'untitled'" :poster-path="item.poster_path"
                    :release-date="item.release_date || item.first_air_date" 
                    :media-type="mediaType"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { MovieTypes } from '@/common/api/tmdb/types/movie'
import MediaCard from '@/modules/media/MediaCard.vue';
import type { TVTypes } from '@/common/api/tmdb/types/tv'
import type { MediaTypes } from "../types";
type MediaDataTypes = MovieTypes & TVTypes

export default defineComponent({
    components: { MediaCard },
    props: {
        mediaData: Array as PropType<MediaDataTypes[]>,
        mediaType: String as PropType<MediaTypes>
    },
})

</script>