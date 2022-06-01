<template>
    <div class="row">
        <div class="col-lg-5">
            <div v-if="isLoading" class="d-flex align-self-center justify-content-center">
                <skeletor style="height: 300" class="rounded-0 poster"></skeletor>
            </div>

            <div v-else-if="posterPath" v-viewer="posterViewerOpts"
                class="d-flex align-self-center justify-content-center">
                <img :src="`${IMAGE_BASE_URL_500}${posterPath}`" class="poster" :alt="`Media Poster`"/>
            </div>
            <div v-else class="poster border">
            </div>
        </div>
        <div class="col-lg-5 align-self-center mt-3 mt-lg-0">
            <h4>About</h4>
            <hr class="my-2" />
            <div class="d-flex my-3 flex-row gap-2 py-2 px-3" style="overflow-x:auto;">
                <router-link :to="`/${mediaType}?genre=${genre?.id}`" v-for="genre in genres" :key="genre.id"
                    class="d-flex rounded-pill bg-tertiary py-1 px-2 align-items-center justify-content-center mx-0 text-decoration-none genre-pill">
                    <p class="text-white m-0 p-0">{{ genre.name }}</p>
                </router-link>
            </div>
            <div>
                <p class="m-0">{{ overview }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IMAGE_BASE_URL_500 } from '@/common/api/tmdb';
import type { Genre } from '@/common/api/tmdb/types/movie';
import { defineComponent, type PropType } from 'vue';
import type { MediaTypes } from '../types';
import Icon from '@/common/components/elements/Icon.vue';
export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500,
            posterViewerOpts: { navbar: false, title: false, toolbar: false, tooltip: false, movable: false, zoomable: true, rotatable: true, scalable: true, transition: true, },
        }
    },
    components: { Icon },
    props: {
        isLoading: Boolean,
        posterPath: String,
        genres: Array as PropType<Genre[] | undefined>,
        overview: String,
        mediaType: String as PropType<MediaTypes>
    }
})

</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

.poster {
    object-fit: cover;
    width: 255px;
    height: 400px;
    border-radius: 5px;
    cursor: pointer;
}

.genre-pill {
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s;
}

.genre-pill:hover {
    background-color: #f5643d !important;
    transform: scale(1.05);
    transition: all 0.3s;
}

@include media-breakpoint-down(md) {
    .poster {
        width: 155px;
        height: 250px;
    }
}
</style>