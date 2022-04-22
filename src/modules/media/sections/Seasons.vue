<template >
    <div class="row">
        <div class="col-lg-5 align-self-center mt-3 mt-lg-0 w-100 mb-5">
            <h4>Seasons</h4>
            <hr class="my-2" />
            <div class="container-full d-flex px-3 pb-2 px-xl-0 flex-row gap-2"
                style="overflow-x: auto; overflow-y: hidden;">
                <div v-for="(item) in filteredSeasons" :key="item.id"
                    style="min-width:150px;width:150px;max-width: 150px; height:240px"
                    class="col gap-2 border rounded-3">
                    <div v-if="!item.poster_path"  class="season-poster bg-primary opacity-50"/>
                    <img v-else :src="`${IMAGE_BASE_URL_500}${item.poster_path}`" :alt="item.name + 'poster'"
                        class="rounded-top season-poster" />
                    <div class="p-2">
                        <p style="font-weight: 600;" class="m-0">{{ item.name }}</p>
                        <p class="text-black-50">{{ item.episode_count }} episodes</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { IMAGE_BASE_URL_500 } from '@/common/api/tmdb';
import type { Season } from '@/common/api/tmdb/types/tv';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500
        }
    },
    props: {
        isLoading: Boolean,
        seasonData: Array as PropType<Season[] | undefined>,
    },
    computed: {
        filteredSeasons(): Season[] | void {
            if (!this.seasonData) return;

            return this.seasonData.filter(m => { return m.name !== 'Specials' });
        }
    }
});

</script>

<style>
    .season-poster{
        object-fit: cover;
        height: 170px;
        width: 100%;
    }
</style>