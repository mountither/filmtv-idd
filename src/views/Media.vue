<template>
    <!-- Header section -->
    <section class="container-full" style="position: relative; overflow: hidden;">
        <div class="row d-flex">
            <div v-show="isLoading">
                <skeletor :height="350" class="rounded-3 position-absolute" />
            </div>
            <div :style="{ backgroundImage: 'linear-gradient(rgba(255,255,255,0),rgba(255,255,255,1)), url(' + IMAGE_BASE_URL_OG + mediaData.backdrop_path + ')' }"
                class="p-0 overflow-hidden" style="
                    height: 350px; 
                    background-size: cover;
                    background-position: top center;
                    background-repeat: no-repeat;" />
            <div style=" 
                    position: absolute;
                    width: 100%;
                    bottom: 0;
                    left: 0%;">
                <div v-if="isLoading">
                    <skeletor :width="600" :height="100" class="rounded-3 mb-2" />
                </div>
                <div v-else class="d-flex flex-column align-items-start mb-1">
                    <div
                        class="d-flex flex-row align-items-center bg-black bg-opacity-75 rounded-3 p-2 text-white mb-2">
                        <p v-if="formattedYear" style="font-weight: 400;" class="p-0 m-0">{{ formattedYear }}</p>

                        <CircleIcon colour="#FFFF" size="5" />

                        <p v-if="formattedRuntime" class="p-0 m-0" style="font-weight: 200;">{{ formattedRuntime }}</p>

                        <span class="d-flex align-items-center"
                            v-if="mediaType === 'tv' && mediaData.number_of_seasons">
                            <CircleIcon colour="#FFFF" size="5" />
                            <p class="p-0 m-0" style="font-weight: 200;">{{ mediaData.number_of_seasons }} seasons
                            </p>
                        </span>

                    </div>
                    <h1 class="title">{{ mediaData.title || mediaData.name }}</h1>
                    <!-- refactor with mediacard -->
                    <button v-show="isProcessingWatchlistItem" class="btn btn-sm text-white bg-primary" disabled>
                        <div class="d-flex flex-row align-items-center justify-content-between">
                            <font-awesome-icon icon="bookmark" color="white" style="height: 25px" />
                            <span class="spinner-border spinner-border-sm mx-2" role="status" aria-hidden="true"></span>
                            Loading...
                        </div>

                    </button>

                    <button v-show="!isProcessingWatchlistItem" class="btn btn-sm text-white "
                        :class="isMediaAddedToWl ? 'bg-danger' : 'bg-primary'"
                        @click="!isProcessingWatchlistItem ? triggerWatchlist() : undefined">
                        <div class="d-flex flex-row align-items-center justify-content-between">
                            <font-awesome-icon icon="bookmark" color="white" style="height: 25px" />
                            <p style="font-weight: 600;" class="m-0 px-2">
                                {{
                                        `${(isMediaAddedToWl) ? 'Remove from Watchlist' : 'Add to Watchlist'}`
                                }}
                            </p>

                        </div>


                    </button>
                </div>
            </div>

            <div style=" 
                    position: absolute;
                    top: 5%;
                    right: 0;">
                <div class="d-flex flex-column align-items-end">
                    <div v-if="isLoading">
                        <skeletor :width="100" :height="100" class="rounded-3 mb-2" />
                    </div>
                    <div v-else-if="watchProviderData"
                        class="d-flex flex-column align-items-center justify-content-center text-center bg-black bg-opacity-75 rounded-3 p-2 text-white mb-2">
                        <p style="font-weight: 500;" class="p-0 m-0">Where to watch?</p>

                        <img :src="`${IMAGE_BASE_URL_OG}${getWatchProviderImagePreview}`"
                            style="height: 40px; object-fit: cover;" class="mt-2" alt="Featured Watch Provider"/>

                        <button type="button" class="btn btn-link text-tertiary mt-1" style="font-weight: 600;"
                            @click="onViewAllWatchProviders">
                            view
                            all
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- content section -->
    <section class="mb-5">
        <!-- About section -->
        <section v-if="mediaData" class="container mt-5">
            <About :is-loading="isLoading" :poster-path="mediaData.poster_path" :genres="mediaData.genres"
                :media-type="mediaType" :overview="mediaData.overview" />
        </section>

        <!-- Seasons section - tv only -->
        <section v-if="mediaType === 'tv' && (mediaData.seasons && mediaData.seasons.length > 0)"
            class="container mt-5">
            <Seasons :is-loading="isLoading" :season-data="mediaData.seasons" />
        </section>

        <!-- Ratings and Reviews section -->
        <section v-if="mediaData?.reviews?.results" class="container mt-5">
            <RatingsAndReviews :tmdb-review-data="mediaData.reviews.results" :tmdb-vote-average="mediaData.vote_average"
                :media-title="mediaData.title || mediaData.name" :media-id="mediaData.id" :media-type="mediaType" />
        </section>

        <!-- People (cast + crew) section -->
        <section v-if="mediaData?.credits?.crew && (mediaData?.credits?.crew.length > 0 || mediaData?.credits?.cast.length > 0)"
            class="container mt-5">
            <People :credit-data="mediaData.credits" />
        </section>

        <!-- Media Recommendations section -->
        <section v-if="mediaData.recommendations && mediaData.recommendations?.results.length > 0"
            class="container mt-5">
            <Recommendations :media-data="mediaData.recommendations?.results" :media-type="mediaType" />
        </section>
    </section>

    <!-- View all Watch providers modal -->
    <WatchProviderModal v-model="showWatchProviderModal" :data="watchProviderData" :handler="onViewAllWatchProviders" />

    <!-- Non-authenticated user info modal -->
    <NoAccessModal v-model="showNoAccessModal" type="watchlist" :title="mediaData.title || mediaData.name" />
</template>

<script lang="ts">
import { fetchMediaWatchProviders, fetchMediaWithID, IMAGE_BASE_URL_500, IMAGE_BASE_URL_OG } from '@/common/api/tmdb';
import type { MovieTypes } from '@/common/api/tmdb/types/movie';
import type { TVTypes } from '@/common/api/tmdb/types/tv';
import type { WatchProvidersResults, WatchProvidersTypes } from '@/common/api/tmdb/types/watchProviders';
import CircleIcon from '@/common/components/elements/CircleIcon.vue';
import NoAccessModal from '@/common/components/modals/NoAccessModal.vue';
import useManipulateUserWatchlist from '@/modules/media/composables/useManipulateUserWatchlist';
import type { MediaTypes } from '@/modules/media/types';
import WatchProviderModal from '@/modules/watchProviders/WatchProviderModal.vue';
import { defineAsyncComponent, defineComponent, getCurrentInstance, ref, type Ref } from 'vue';
import { useRoute } from "vue-router";
import CreateRatingModal from "../modules/ratingsAndReviews/CreateRatingModal.vue";
import { currentUser } from '@/firebaseConfig';


const About = defineAsyncComponent(() =>
    import('@/modules/media/sections/About.vue')
)
const RatingsAndReviews = defineAsyncComponent(() =>
    import('@/modules/media/sections/RatingsAndReviews.vue')
)
const People = defineAsyncComponent(() =>
    import('@/modules/media/sections/People.vue')
)

const Recommendations = defineAsyncComponent(() =>
    import('@/modules/media/sections/Recommendations.vue')
)

const Seasons = defineAsyncComponent(() =>
    import('@/modules/media/sections/Seasons.vue')
)

type MediaDataTypes = MovieTypes & TVTypes

export default defineComponent({
    components: {
        RatingsAndReviews,
        People,
        Recommendations,
        About,
        Seasons,
        WatchProviderModal,
        CreateRatingModal,
        NoAccessModal,
        CircleIcon
    },
    data() {
        return {
            mediaData: [] as MediaDataTypes,
            mediaType: "" as MediaTypes,
            watchProviderData: {} as WatchProvidersResults["AU"],
            isError: false as boolean,
            isLoading: true as boolean,
            IMAGE_BASE_URL_OG,
            IMAGE_BASE_URL_500,
            showWatchProviderModal: false as boolean,
            addedToWatchList: false as boolean,
            loadingWatchlistInfo: true as boolean,
        }
    },
    methods: {
        maximisePoster(): void {
            this.$viewerApi({
                images: [`${IMAGE_BASE_URL_OG}${this.mediaData.poster_path}`],
            })
        },
        onViewAllWatchProviders(): void {
            this.showWatchProviderModal = !this.showWatchProviderModal;
        },
        async getMediaData(): Promise<void> {
            try {
                const mediaType = this.$route.params.media_type as MediaTypes;
                const id = this.$route.params.slug as string;

                //* fetch this instance media with predefined appended responses (ratings/reviees, recommendations etc.)
                const data: MediaDataTypes = await fetchMediaWithID({ appendResponses: true, id, type: mediaType })

                //* fetch watch providers for this media.
                const providerData: WatchProvidersTypes = await fetchMediaWatchProviders({ id, type: mediaType });

                this.mediaData = data;
                this.mediaType = mediaType
                //* default to Australia.
                this.watchProviderData = providerData?.results?.AU;
                this.isLoading = false;

            } catch (error) {
                console.log(error)
                this.isLoading = false;
                this.isError = true;

            }
        },
        triggerWatchlist(){
            this.mediaTitleInWlToast = this.mediaData.title || this.mediaData.name
            this.manipulateUserWatchlist();
        }
    },
    setup() {
        const route = useRoute();
        //* init ref related to watchlist
        const showNoAccessModal = ref(false as boolean)
        const isMediaAddedToWl = ref(false as boolean)
        const isProcessingWatchlistItem = ref(true as boolean)
        const isErrorWl = ref(false as boolean)
        const mediaTitleInWlToast = ref(undefined as string | undefined)

        //* get toast instance
        const toastInstance = getCurrentInstance()?.appContext.config.globalProperties.$toast;

        const mediaInfo = {
            id: route?.params.slug as string,
            title: mediaTitleInWlToast as Ref<string | undefined>,
            type: route?.params.media_type as MediaTypes | undefined
        }

        const { manipulateUserWatchlist, checkMediaInWatchlist } = useManipulateUserWatchlist(
            toastInstance,
            showNoAccessModal,
            isMediaAddedToWl,
            isProcessingWatchlistItem,
            isErrorWl,
            mediaInfo
        )

        return {
            manipulateUserWatchlist,
            checkMediaInWatchlist,
            showNoAccessModal,
            isMediaAddedToWl,
            isProcessingWatchlistItem,
            isErrorWl,
            mediaTitleInWlToast
        }
    },
    watch: {
        //* checks:
        //if watchlist exists (fetched at app init @ main.ts & stored in vuex), check if current media instance exists in array.
        userWatchlist: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.checkMediaInWatchlist();
                }
            },
        },
        // if watclist error arises (e.g no wl made), resolve processing wl to false.
        userWatchlistError: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.isProcessingWatchlistItem = false;
                }
            }
        },
        // if user is not logged in, watchlist is noexistent, then resolve processing wl to false.
        loadingUser: {
            immediate: true,
            async handler(value) {
                if (!value && !await currentUser()) {
                    this.isProcessingWatchlistItem = false
                }
            }
        }
    },
    created() {
        // watch the params of the route to fetch the data again
        this.$watch(
            () => this.$route.params,
            () => {
                this.getMediaData()
                if (this.userWatchlist) {
                    console.log("checking")
                    this.checkMediaInWatchlist();
                }
            },
            // fetch the data when the view is created and the data is
            // already being observed
            { immediate: true }
        )
    },
    computed: {
        formattedYear(): string | undefined {
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
        formattedRuntime(): string | undefined {
            let runtime;
            if (this.mediaType === "movie") {
                runtime = this.mediaData?.runtime
            }
            else if (this.mediaType === "tv" && this.mediaData.episode_run_time) {
                runtime = this.mediaData?.episode_run_time[0]

            }

            if (!runtime) return;

            var hours = `${Math.floor(runtime / 60) > 0 ? `${Math.floor(runtime / 60)} hr` : ''}`;
            var minutes = `${runtime % 60 > 0 ? `${runtime % 60} min` : ''}`;

            return `${hours} ${minutes}`
        },
        getWatchProviderImagePreview(): string | undefined {
            return this.watchProviderData?.flatrate && this.watchProviderData?.flatrate[0].logo_path || this.watchProviderData?.buy && this.watchProviderData?.buy[0].logo_path || this.watchProviderData?.rent && this.watchProviderData?.rent[0].logo_path || this.watchProviderData?.ads && this.watchProviderData?.ads[0].logo_path || this.watchProviderData?.free && this.watchProviderData?.free[0].logo_path
        },
        user() {
            return this.$store.getters.user
        },
        userWatchlist() {
            return this.$store.getters.userWatchlist
        },
        userWatchlistError() {
            return this.$store.getters.userWatchlistError;
        },
    }
})

</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.scss";

:deep(.modal-container) {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    width: 100vw;
}

:deep(.modal-content) {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    width: 500px;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
}

.modal__title {
    font-size: 1.5rem;
    font-weight: 700;
}

.title {
    font-size: 6vw;
    font-weight: 900;
}

@include media-breakpoint-down(sm) {
    .poster {
        width: 150px;
    }
}

@include media-breakpoint-up(xl) {
    .title {
        font-size: 70px;
    }
}
</style>