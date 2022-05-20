<template>
    <section class="mt-5">

        <h1 style="font-weight: 300;">My Watchlist <span style="font-weight: 800;">({{ userWatchlistTotal }})</span>
        </h1>
        <section class="row mt-5 pb-5 pt-3 gap-2 d-flex justify-content-center">
            <MediaList :is-loading-media-data="isLoadingMediaData" :is-fetching-media-data="isFetchingMediaData"
                :media="watchlistData" :show-media-type-on-card="mediaCardConfig.showMediaType" />
        </section>
    </section>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import MediaList from "@/modules/mediaList/MediaList.vue";
import type { MediaDataList } from "@/modules/mediaList/types";
import { fetchMediaWithID } from "@/common/api/tmdb";

export default defineComponent({
    components: {
        MediaList,
    },
    data() {
        return {
            mediaCardConfig: {
                showMediaType: true
            },
            watchlistData: {} as MediaDataList,
            isLoadingMediaData: true as boolean,
            isFetchingMediaData: false as boolean,
            page: 1 as number,
        }
    },
    watch: {
        userWatchlist: {
            immediate: true,
            async handler(value) {
                if (value) {
                    await this.fetchWatchlistData();
                }
            }
        }
    },
    methods: {
        async fetchWatchlistData() {
            try {
                if (!this.userWatchlistSorted) return;

                const mediaPromises = Object.keys(this.userWatchlistSorted).map((media: any) => {
                    if (!this.userWatchlistSorted) return;

                    const id = this.userWatchlistSorted[media].id;
                    const type = this.userWatchlistSorted[media].mediaType;

                    return new Promise((resolve, reject) => {
                        //* fetch media info based on id and type.
                        const data = fetchMediaWithID({ appendResponses: false, id, type });

                        if (!data) reject();

                        resolve(data)

                    }).then((data: any) => {
                        if (!this.userWatchlistSorted) return;

                        //* get date media added to watchlist from store.
                        if (!data) return;
                        const date_added_wl = this.userWatchlistSorted[media].date_added.seconds
                        // append new field - date added to data.
                        return { ...data, date_added_wl, media_type: type }
                    })
                })

                //resolve all the promises - async calls to fetchMediaID. 
                const mediaData = await Promise.all(mediaPromises)

                //* OLD way - slower
                // for (var media in this.userWatchlistSorted) {
                //     const id = this.userWatchlistSorted[media].id;
                //     const type = this.userWatchlistSorted[media].mediaType;

                //     //* fetch media info based on id and type.
                //     const data = await fetchMediaWithID({ appendResponses: false, id, type });

                //     if (!data) continue;

                //     const date_added_wl = this.userWatchlistSorted[media].date_added.seconds
                //     // append new field - date added to watchlust.
                //     wlTempArray.push({ ...data, date_added_wl, media_type: type })
                // }

                this.watchlistData = {
                    data: mediaData.filter(media => media !== undefined),
                    totalPages: 1,
                    totalResults: this.userWatchlistTotal
                }

                this.isLoadingMediaData = false;

            } catch (error) {
                console.log(error)
                this.isLoadingMediaData = false

            }
        },
    },
    computed: {
        user() {
            return this.$store.getters.user;
        },
        userWatchlist() {
            return this.$store.getters.userWatchlist
        },
        userWatchlistSorted(): Array<any> | undefined {
            if (this.userWatchlist) {
                //* sort by date added
                return (<any>Object).entries(this.userWatchlist).map((entry: any) => entry[1]).sort((x: any, y: any) => {
                    return y.date_added.seconds - x.date_added.seconds;
                })
            }
        },
        userWatchlistError() {
            return this.$store.getters.userWatchlistError
        },
        userWatchlistTotal() {
            return this.$store.getters.userWatchlistTotal
        },
    },
})
</script>
<style lang="scss" scoped>
</style>