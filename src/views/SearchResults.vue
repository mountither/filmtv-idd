<template>
    <section class="my-5">

        <InfiniteScrollContainer :media="searchResults" :page="page" :page-increment-handler="pageIncrementor"
            :next-page-handler="getNextPageData">
            <div class="position-relative">
                <h5 style="font-weight: 400;">Search results for <span style="font-weight: 800;">{{
                        searchInput
                }}</span>
                </h5>
                <div class="position-absolute bottom-5 left-0 pb-4">
                    <MediaCountHeader :is-loading-data="isLoadingMediaData"
                        :total-results="searchResults.totalResults" />
                </div>
            </div>

            <!-- media list section -->
            <section class="media-card row mt-5 pb-5 pt-3 gap-2 d-flex justify-content-center">
                <MediaList :is-loading-media-data="isLoadingMediaData" :is-fetching-media-data="isFetchingMediaData"
                    :media="searchResults" :show-media-type-on-card="mediaCardConfig.showMediaType" />
            </section>
        </InfiniteScrollContainer>
    </section>

</template>
<script lang="ts">
import { fetchSearchMultiResults } from "@/common/api/tmdb";
import type { MediaDataList } from "@/modules/mediaList/types";
import { defineComponent } from "vue";
import MediaList from "@/modules/mediaList/MediaList.vue";
import MediaCountHeader from "@/modules/mediaList/components/MediaCountHeader.vue";
import InfiniteScrollContainer from "@/modules/mediaList/InfiniteScrollContainer.vue";

export default defineComponent({
    components: {
        MediaList,
        MediaCountHeader,
        InfiniteScrollContainer
    },
    data() {
        return {
            mediaCardConfig: {
                showMediaType: true
            },
            searchInput: "" as string | undefined,
            searchResults: {} as MediaDataList,
            isLoadingMediaData: true as boolean,
            isFetchingMediaData: false as boolean,
            page: 1 as number,
        }
    },
    async created() {
        const searchInputUrl = this.$route.params.search_input as string
        if (searchInputUrl) {
            this.searchInput = searchInputUrl as string

            await this.fetchInitialSearchResult()
        }
    },
    methods: {
        async fetchInitialSearchResult() {
            try {
                if (!this.searchInput) {
                    throw Error("no search input");
                };
                const results = await fetchSearchMultiResults({ query: this.searchInput, page: 1 });
                this.searchResults = {
                    data: results?.data,
                    totalPages: results?.total_pages,
                    totalResults: results?.total_results
                };
                this.isLoadingMediaData = false
            } catch (error) {
                console.log(error)
                this.isLoadingMediaData = false

            }
        },
        pageIncrementor() {
            this.page++
        },
        async getNextPageData(): Promise<void> {
            try {
                if (!this.searchInput) return;
                this.isFetchingMediaData = true

                const results = await fetchSearchMultiResults({ query: this.searchInput, page: this.page });

                this.searchResults.data.push(...results?.data);

                this.isFetchingMediaData = false
            } catch (error) {
                console.log(error)
                this.isFetchingMediaData = false

            }
        },
    }
})
</script>
<style lang="scss">
</style>