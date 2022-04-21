<template >
    <InfiniteScrollContainer :media="filteredMedia" :page="page" :page-increment-handler="pageIncrementor" :next-page-handler="getNextPageData">
        <div class="d-flex w-100 align-items-start gap-2">
            <div class="d-md-flex flex-column mr-3 d-none align-items-start justify-content-center filter-container sticky-top shadow-lg rounded-3 p-3"
                style="min-width: 300px;width:300px;z-index: 10;top: 40px;background-color: #F9F6F0;">
                <div style="word-break: break-all;max-height:95vh;padding-bottom: 70px;overflow-y: overlay;">

                    <MediaFilterSelections name="outer-filter" :media-type="mediaType" :filter-state="filterState"
                        :state-handler="getFilteredMediaData" />
                </div>
            </div>

            <div class="row pb-5 pt-3 gap-2 px-2 justify-content-around
            align-items-center " style="width: 100vw;">
                <!-- Header -->
                <div class="d-flex flex-row align-items-center justify-content-between">
                    <div class="position-relative mb-5 mx-3 mt-3">
                        <h1 style="font-weight: bold;">{{ title }}</h1>
                        <div class="position-absolute bottom-5 left-0 pb-4">
                            <MediaCountHeader :is-loading-data="isLoadingMediaData"
                                :total-results="filteredMedia.totalResults" />
                        </div>
                    </div>

                    <div class="d-flex d-md-none align-items-end flex-column justify-content-center">

                        <button class="btn btn-link text-secondary text-decoration-none" @click="toggleDrawer">
                            <font-awesome-icon icon="filter" size="lg" />
                            <p class="m-0" style="font-size: 12px;">Filters</p>
                        </button>
                    </div>
                </div>

                <MediaList :is-loading-media-data="isLoadingMediaData" :is-fetching-media-data="isFetchingMediaData"
                    :media="filteredMedia" :media-type="mediaType" />

            </div>

        </div>

        <Drawer :is-open="isDrawerOpen" :speed="300" @close="closeDrawer" title="Film filters">
            <MediaFilterSelections name="drawer-filter" :media-type="mediaType" :filter-state="filterState"
                :state-handler="getFilteredMediaData" />
        </Drawer>

    </InfiniteScrollContainer>

</template>

<script lang="ts">

import { discoverMedia } from "@/common/api/tmdb";
import Drawer from "@/common/components/Drawer.vue";
import { runtimeData } from "@/modules/mediaFilters/filterData/runtime";
import MediaFilterSelections from "@/modules/mediaFilters/MediaFilterSelections.vue";
import { defineComponent, type PropType } from "vue";
import type { MediaTypes } from "../media/types";
import type { MediaDataList } from "./types";
import MediaList from "./MediaList.vue";
import MediaCountHeader from "./components/MediaCountHeader.vue";
import InfiniteScrollContainer from "./InfiniteScrollContainer.vue";

export default defineComponent({
    components: {
        Drawer,
        MediaFilterSelections,
        MediaList,
        MediaCountHeader,
        InfiniteScrollContainer
    },
    props: {
        mediaType: String as PropType<MediaTypes>,
        title: String,
    },
    data() {
        return {
            isDrawerOpen: false,
            filterState: {
                watchRegion: "AU",
                genre: [] as Array<number>,
                sortBy: "" as String,
                runtime: [runtimeData.min, runtimeData.max] as Array<number>,
                watchProviders: [] as Array<number>,
            },
            isLoadingMediaData: true as boolean,
            isFetchingMediaData: false as boolean,
            filteredMedia: {} as MediaDataList,
            page: 1 as number,
            filterQuery: "" as string
        };
    },
    async created() {
        //* check if genre is in query params.
        const urlGenre = this.$route.query.genre
        if (urlGenre) {
            this.filterState.genre.push(parseInt(urlGenre as string))
        }

        //* get initial data with initial filter selections
        await this.getFilteredMediaData();

    },
    methods: {
        pageIncrementor() {
            this.page++
        },
        async getNextPageData(): Promise<void> {
            try {
                if (!this.mediaType) return;

                this.isFetchingMediaData = true

                const data = await discoverMedia({ mediaType: this.mediaType, query: this.filterQuery, page: this.page })

                this.filteredMedia.data.push(...data.results);

                this.isFetchingMediaData = false
            } catch (error) {
                console.log(error)
                this.isFetchingMediaData = false

            }
        },
        async getFilteredMediaData(): Promise<void> {
            try {
                if (!this.mediaType) return;
                console.log(JSON.stringify(this.filterState))
                let filters: Array<string> = [];

                if (this.filterState.sortBy) {
                    filters.push(`sort_by=${this.filterState.sortBy}`)
                }
                if (this.filterState.genre.length > 0) {
                    filters.push(`with_genres=${this.filterState.genre.join(',')}`)
                }
                if (this.filterState.runtime.length > 0) {
                    filters.push(`with_runtime.lte=${this.filterState.runtime[1]}`)
                    filters.push(`with_runtime.gte=${this.filterState.runtime[0]}`)
                }
                if (this.filterState.watchProviders.length > 0) {
                    filters.push(`with_watch_providers=${this.filterState.watchProviders.join('|')}&watch_region=${this.filterState.watchRegion}`)
                }

                this.filterQuery = filters.join("&");

                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
                const data = await discoverMedia({ mediaType: this.mediaType, query: this.filterQuery, page: 1 })


                this.filteredMedia.totalResults = data.total_results;
                this.filteredMedia.totalPages = data.total_pages;
                this.filteredMedia.data = data.results;

                this.isLoadingMediaData = false
            }
            catch (error) {
                this.isLoadingMediaData = false
            }

        },
        toggleDrawer() {
            this.isDrawerOpen = !this.isDrawerOpen;
        },
        closeDrawer() {
            this.isDrawerOpen = false;
        },
    },
})


</script>

<style scoped lang="scss">
.filter-container {
    background-color: white;
    border-right: 1px solid #dadada;
    padding-right: 0px !important;

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #E3E8E9;
        border: 5px solid #ffffff;
    }

    ::-webkit-scrollbar-track {
        background: #ffff;
    }
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.25s ease-out;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>
