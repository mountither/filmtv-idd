<template>
    <!-- Header section -->
    <section class="container-full" style="position: relative; overflow: hidden;">
        <div class="row d-flex">
            <div v-if="isLoading">
                <skeletor :height="650" class="rounded-3" />
            </div>
            <div
                v-else
                :style="{ backgroundImage: 'linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1)), url(' + IMAGE_BASE_URL_OG + mediaData.backdrop_path + ')' }"
                class="p-0 overflow-hidden"
                style="
                    height: 350px; 
                    background-size: cover;
                    background-position: top center;
                    background-repeat: no-repeat;"
            />
            <div
                style=" 
                    position: absolute;
                    width: 100%;
                    bottom: 0;
                    left: 0%;"
            >
                <div v-if="isLoading">
                    <skeletor :width="600" :height="100" class="rounded-3 mb-2" />
                </div>
                <div v-else class="d-flex flex-column align-items-start">
                    <div
                        class="d-flex flex-row align-items-center bg-black bg-opacity-75 rounded-3 p-2 text-white mb-2"
                    >
                        <p style="font-weight: 400;" class="p-0 m-0">{{ formattedYear }}</p>

                        <span
                            class="bg-white rounded-circle p-0 mx-2"
                            style="height: 5px; width: 5px;"
                        />

                        <p class="p-0 m-0" style="font-weight: 200;">{{ formattedRuntime }}</p>
                    </div>
                    <h1 class="title">{{ mediaData.title || mediaData.name }}</h1>
                </div>
            </div>

            <div
                style=" 
                    position: absolute;
                    top: 5%;
                    right: 0;"
            >
                <div v-if="isLoading">
                    <skeletor :width="100" :height="100" class="rounded-3 mb-2" />
                </div>
                <div v-else class="d-flex flex-column align-items-end">
                    <div
                        class="d-flex flex-row align-items-center bg-black bg-opacity-75 rounded-3 p-2 text-white mb-2"
                    >
                        <p style="font-weight: 400;" class="p-0 m-0">where to watch</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About section -->
    <section class="row mt-5">
        <div class="col ">
            <skeletor v-if="isLoading" class="poster"></skeletor>
            <div else v-viewer="posterViewerOpts" >
                <img :src="`${IMAGE_BASE_URL_500}${mediaData.poster_path}`" class="poster" />
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { fetchMediaWithID, IMAGE_BASE_URL_OG, IMAGE_BASE_URL_500 } from '@/common/api/tmdbApi';
import type { MovieTypes } from '@/modules/media/types/movie';
import type { TVTypes } from '@/modules/media/types/tv';
import { defineComponent } from 'vue';

type MediaDataTypes = MovieTypes & TVTypes

export default defineComponent({
    data() {
        return {
            mediaData: [] as MediaDataTypes,
            mediaType: "" as "movie" | "tv",
            isError: false as boolean,
            isLoading: true as boolean,
            IMAGE_BASE_URL_OG,
            IMAGE_BASE_URL_500,
            posterViewerOpts: { navbar: false, title: false, toolbar: false, tooltip: false, movable: false, zoomable: true, rotatable: true, scalable: true, transition: true,}
        }
    },
    methods: {
        maximisePoster() {
            this.$viewerApi({
                images: [`${IMAGE_BASE_URL_OG}${this.mediaData.poster_path}`],
            })
        },
    },
    beforeRouteEnter(to: any, from: any, next: any) {
        next(async (vm: any) => {
            try {
                const data = await fetchMediaWithID({ id: to.params.slug, type: to.params.media_type })

                console.log(data)

                vm.mediaData = data;
                vm.mediaType = to.params.media_type

                vm.isLoading = false;

            } catch (error) {
                console.log(error)
                vm.isLoading = false;
                vm.isError = true;

            }
        })
    },
    computed: {
        formattedYear() {
            if (this.mediaType === "movie") {
                if (!this.mediaData?.release_date) return;
                return this.mediaData?.release_date.split('-')[0]
            }
            if (this.mediaType === "tv") {
                if (!this.mediaData?.first_air_date) return;
                return this.mediaData?.first_air_date.split('-')[0]
            }
            return;
        },
        formattedRuntime() {
            let runtime;

            if (this.mediaType === "movie") {
                runtime = this.mediaData?.runtime
            }
            if (this.mediaType === "tv") {
                runtime = this.mediaData?.episode_run_time[0]

            }

            var hours = `${Math.floor(runtime / 60) > 0 ? `${Math.floor(runtime / 60)} hr` : ''}`;
            var minutes = `${runtime % 60 > 0 ? `${runtime % 60} min` : ''}`;

            console.log(hours, minutes)

            return `${hours} ${minutes}`
        }
    }
})

</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

.title {
    font-size: 6vw;
    font-weight: 900;
}

.poster {
    object-fit: cover;
    height: 260px;
    width: 170px;
    border-radius: 5px;
    cursor: pointer;
}

@include media-breakpoint-up(xl) {
    .title {
        font-size: 70px;
    }
}
</style>