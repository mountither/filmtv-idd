<template>
    <div class="row gap-4 w-100 px-2 py-3 accordion">

        <!-- Sort by filter -->
        <AccordianItem id="sort_by" title="Sort By">
            <div :key="option.id" v-for="(option) in filterOptions.sortBy.data" class="form-check">

                <input class="form-check-input shadow-none sort-by-input" type="radio"
                    :name="`${name}-'sort-by-option'`" :value="option.id" v-model="filterState.sortBy"
                    :checked="filterState?.sortBy === option.id" :id="option.id" @change="stateHandler" />
                <label class="form-check-label" :for="option.id">
                    {{ option.label }}
                </label>
            </div>
        </AccordianItem>
        <hr class="m-0" />

        <!-- Runtime slider -->
        <AccordianItem id="runtime" title="Runtime">
            <div class="row text-center pt-5 px-3">
                <Slider v-model="filterState.runtime" :max="filterOptions.runtime.max" :min="filterOptions.runtime.min"
                    :step="30" />
                <p class="pt-3" style="font-weight: 600;">Minutes</p>
                <button class="mt-3 btn-secondary btn btn-sm" style="font-weight: 800;"
                    @click="stateHandler">Apply</button>
            </div>
        </AccordianItem>
        <hr class="m-0" />

        <!-- Genre Filter -->
        <AccordianItem id="genres" title="Genres" :isExpanded="genreUrlQueried() ? true : initCollapsedAccordion">
            <div class="d-flex justify-content-around gap-2 align-items-center flex-wrap w-100">
                <div v-if="filterOptions.genre.isLoading">
                    <skeletor :height="300" class="rounded-0"></skeletor>
                </div>
                <div :key="genre.id" v-for="genre in filterOptions.genre.data">
                    <input type="checkbox" class="btn-check btn-check-input" :id="genre.id.toString()"
                        v-model="filterState.genre" :value="genre.id" @change="stateHandler" autocomplete="off">
                    <label class="btn-check-label btn btn-outline-secondary" :for="genre.id.toString()">
                        {{ genre.name }}</label>
                </div>
            </div>
        </AccordianItem>
        <hr class="m-0" />

        <!-- Watch provider options -->
        <AccordianItem id="watch_providers" title="Watch Providers"
            :isExpanded="watchProviderUrlQueried() ? true : initCollapsedAccordion">
            <div class="pt-3 px-1 d-flex gap-2 flex-row flex-wrap align-items-center justify-content-between">
                <div :key="item.provider_id" v-for="(item) in filterOptions.watchProviders.data" class="cont-checkbox">
                    <input type="checkbox" class="image-checkbox-input" :id="(item.provider_id as string)"
                        :value="item.provider_id" v-model="filterState.watchProviders" autocomplete="off"
                        @change="stateHandler">
                    <label :for="(item.provider_id as string)" class="image-checkbox-label">
                        <span class="cover-checkbox">
                            <svg viewBox="0 0 12 10">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                        </span>
                        <img :src="`${IMAGE_BASE_URL_500}${item.logo_path}`"
                            style="width: 50px;height: 50px;object-fit: cover; font-size: 12px;"
                            class="img-fluid rounded-3" v-tooltip="item.provider_name" />
                    </label>
                </div>
            </div>
        </AccordianItem>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { fetchMediaGenres, fetchWatchProviders, IMAGE_BASE_URL_500 } from "@/common/api/tmdb";
import type { Genres } from "@/modules/mediaFilters/filterData/genres";
import { type Runtime, runtimeData } from "@/modules/mediaFilters/filterData/runtime";

import { filmSortByOptions, tvSortByOptions, type SortByConfig } from "@/modules/mediaFilters/filterData/sortBy";
import Slider from '@vueform/slider'
import type { ProviderInfo } from "@/common/api/tmdb/types/watchProviders";
import type { MediaTypes } from "../media/types";
import AccordianItem from "../../common/components/accordian/AccordianItem.vue";

export default defineComponent({
    components: { Slider, AccordianItem },
    data() {
        return {
            IMAGE_BASE_URL_500,
            initCollapsedAccordion: false as boolean,
            filterOptions: {
                genre: {
                    isLoading: true as Boolean,
                    data: [] as Genres["genres"],
                },
                sortBy: this.mediaType === "tv" ? tvSortByOptions : filmSortByOptions as SortByConfig,
                runtime: runtimeData as Runtime,
                watchProviders: {
                    isLoading: true as Boolean,
                    data: [] as ProviderInfo[]
                },
            },
        }
    },
    props: {
        name: String,
        mediaType: String as PropType<MediaTypes>,
        filterState: {
            type: Object as PropType<{ genre: Array<number>, sortBy: String, runtime: Array<number>, watchProviders: Array<number> }>,
            required: true
        },
        stateHandler: Function as PropType<((payload: MouseEvent | Event) => void)>
    },
    async created() {
        await this.fetchGenreOptions();
        await this.fetchWatchProviderOptions();
    },
    methods: {
        async fetchGenreOptions(): Promise<void> {
            try {
                if (!this.mediaType) return;

                const genreData = await fetchMediaGenres({ type: this.mediaType });

                this.filterOptions.genre.data = genreData.genres;

                this.filterOptions.genre.isLoading = false

            } catch (error) {
                this.$toast.open({
                    message: "Failed to fetch genre options. please try refreshing page.",
                    type: "error",
                });
                this.filterOptions.genre.isLoading = false

            }
        },
        async fetchWatchProviderOptions(): Promise<void> {
            try {
                if (!this.mediaType) return;

                const providerData = await fetchWatchProviders({ type: this.mediaType })

                this.filterOptions.watchProviders.data = providerData.results;

                this.filterOptions.watchProviders.isLoading = false
            } catch (error) {
                this.$toast.open({
                    message: "Failed to fetch watch provider options. please try refreshing page.",
                    type: "error",
                });
                this.filterOptions.watchProviders.isLoading = false

            }
        },
        genreUrlQueried(): boolean {
            return !!this.$route.query.genre
        },
        watchProviderUrlQueried(): boolean {
            return !!this.$route.query.watch_provider
        }
    }
})
</script>
<style lang="scss" scoped>
@import "@/assets/sass/accordian.sass";
@import "@/assets/sass/main.scss";
@import "@/assets/sass/customcheckbox.scss";
</style>