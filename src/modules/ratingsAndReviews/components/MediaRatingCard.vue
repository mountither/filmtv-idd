<template>
    <div class="media-card shadow-md rounded-3 border overflow-hidden p-0">
        <router-link :to="`/media/${mediaType}/${id}`" class="text-decoration-none cursor-pointer">
            <img v-if="posterPath" :src="IMAGE_BASE_URL_500 + posterPath" class="poster" />
            <div v-else class="poster bg-black opacity-25"></div>
        </router-link>
        <div class="d-flex flex-column justify-content-center align-items-center px-1 bg-white overflow-hidden">
            <!-- Star Rating -->
            <star-rating v-if="!!rating" :rating="rating" :read-only="starRatingConfig.readOnly" class="py-2"
                :show-rating="starRatingConfig.showText" :increment="0.5" :star-size="20">
            </star-rating>

            <p class="text-black-50 m-0">{{ ratedAt }}</p>
        </div>

    </div>
</template>
<script lang="ts">
import { IMAGE_BASE_URL_500 } from "@/common/api/tmdb";
import type { MediaTypes } from "@/modules/media/types";
import { defineComponent, type PropType } from "vue";
import StarRating from 'vue-star-rating'

export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500,
            starRatingConfig: {
                readOnly: true as boolean,
                showText: false as boolean
            }
        }
    },
    components: { StarRating },
    props: {
        id: String,
        posterPath: String || undefined,
        rating: Number,
        title: String || undefined,
        ratedAt: String,
        mediaType: String as PropType<MediaTypes>
    }
})

</script>
<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.media-card {
    position: relative;
    min-width: 165px;
    width: 165px;
    height: 300px;
    z-index: 20;
}

.poster {
    height: 230px;
    width: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease-in-out;
}

.poster:hover {
    opacity: 0.8;
    transition: opacity 0.3s ease-in-out;
}

@include media-breakpoint-down(md) {
    .media-card {
        min-width: 125px;
        width: 125px;
        height: 210px;
    }

    .poster {
        height: 140px;
        width: 100%;
        object-fit: cover;
    }

}
</style>