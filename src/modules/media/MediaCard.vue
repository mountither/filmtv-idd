<template>
    <div
        class="rounded-3 overflow-hidden media-card"
        :class="bgColour == 'netflix' ? 'bg-card-alt' : 'bg-secondary'"
    >
        <router-link :to="`/media/${mediaType}/${id}`" class="text-decoration-none cursor-pointer">
            <img :src="IMAGE_BASE_URL_500 + posterPath" class="poster" />
        </router-link>
        <div class="p-2 overflow-hidden">
            <router-link :to="`/media/${mediaType}/${id}`" class="text-decoration-none">
                <p class="p-0 text-white title-link">{{ title }}</p>
            </router-link>
        </div>
        <p
            v-show="showDate"
            class="text-white text-white-50"
            style="
                    position: absolute;
                    font-size: 12px;
                    left: 7px;
                    bottom: 0px;
                    "
        >{{ formattedDate }}</p>
        <div
            class="quick-action d-flex bg-primary bg-opacity-75 align-items-center align-self-center justify-content-center shadow-lg"
        >
            <font-awesome-icon icon="add" color="white" size="lg" />
        </div>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, } from 'vue'
import { IMAGE_BASE_URL_500 } from '@/common/api/tmdbApi'
import { format } from 'date-fns'

type BGColourTypes = "default" | "netflix"
type MediaTypes = "movie" | "tv"

export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500,
        }
    },
    props: {
        id: Number,
        title: String || undefined,
        releaseDate: String || undefined,
        posterPath: String || undefined,
        mediaType: String as PropType<MediaTypes>,
        showDate: {
            type: Boolean,
            default: false,
            required: false,
        },
        bgColour: {
            type: String as PropType<BGColourTypes>,
            default: "default",
            required: false,
        }
    },
    computed: {
        formattedDate() {
            if (!this.releaseDate) return this.releaseDate;
            return format(new Date(this.releaseDate), 'MMMM/yyyy')
        }
    }

})
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
}
.media-card {
    position: relative;
    min-width: 165px;
    height: 330px;
    z-index: 20;
}
.title-link {
    cursor: pointer;
    height: 100%;
    width: 100%;
    transition: opacity 0.3s ease-in-out;
}
.title-link:hover {
    opacity: 0.7;
    text-decoration: underline;
    transition: opacity 0.3s ease-in-out;
}
.poster {
    height: 230px;
    width: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease-in-out;
}
.poster:hover {
    opacity: 0.6;
    transition: opacity 0.3s ease-in-out;
}
.quick-action {
    position: absolute;
    top: 0;
    cursor: pointer;
    right: 0;
    height: 50px;
    width: 35px;
    border-bottom-left-radius: 5px;
    z-index: 100;
    transition: opacity 0.3s;
}
.quick-action:hover {
    opacity: 0.5;
    transition: opacity 0.3s;
}

@include media-breakpoint-down(md) {
    .media-card {
        min-width: 135px;
        height: 230px;
    }
    .poster {
        height: 140px;
        width: 100%;
        object-fit: cover;
    }
    .quick-action {
        height: 40px;
        width: 30px;
    }
}
</style>