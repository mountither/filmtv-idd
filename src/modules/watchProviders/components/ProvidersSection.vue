<template>
    <div class="my-2" v-if="data">
        <h5>{{ title }}</h5>
        <div class="row gap-2 justify-content-center mt-1" style="overflow: auto;">
            <div v-for="(item, index) in data" :key="index"
                class="watch-card col-2 col-lg-3 p-0 align-items-center rounded-3 border shadow-sm">
                <router-link :to="`/${$route.params.media_type}?watch_provider=${item?.provider_id}`" class="text-decoration-none">
                    <img :src="`${IMAGE_BASE_URL_500}${item?.logo_path}`" :alt="item?.provider_name" class="rounded-top"
                        style="width: 100%; object-fit: cover;" />
                    <div class="p-1 text-center border-top overflow-hidden">
                        <p class="m-0 text-black-50">{{ item?.provider_name }}</p>
                    </div>
                </router-link>

            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { ProviderInfo } from '@/common/api/tmdb/types/watchProviders';
import { IMAGE_BASE_URL_500 } from '@/common/api/tmdb';


export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500
        }
    },
    props: {
        data: {} as PropType<ProviderInfo[]>,
        title: String
    },
})
</script>
<style lang="scss">
.watch-card {
    cursor: pointer;
    min-width: 100px;
    transition: opacity 0.3s;
}

.watch-card:hover {
    opacity: 0.8;
    transition: opacity 0.3s;
}
</style>