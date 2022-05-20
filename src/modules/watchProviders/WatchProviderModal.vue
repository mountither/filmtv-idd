<template >
    <ModalContainer name="watchProviderModal" title="Watch Providers" :close-handler="handler">
        <!-- Content -->
        <div class="p-2">
            <ProvidersSection title="Stream" :data="data?.flatrate" />
            <ProvidersSection title="Purchase" :data="data?.buy" />
            <ProvidersSection title="Rent" :data="data?.rent" />
            <ProvidersSection title="Free" :data="data?.free" />
            <ProvidersSection title="Ads" :data="data?.ads" />
        </div>
    </ModalContainer>

</template>
<script lang="ts">
import { IMAGE_BASE_URL_500 } from '@/common/api/tmdb';
import type { WatchProvidersResults } from '@/common/api/tmdb/types/watchProviders';
import { defineComponent, type PropType } from 'vue';
import ProvidersSection from './components/ProvidersSection.vue';
import ModalContainer from '@/common/components/modals/ModalContainer.vue';


export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500
        };
    },
    props: {
        data: {} as PropType<WatchProvidersResults["AU"]>,
        value: Boolean,
        handler: {
            type: Function as PropType<(payload: MouseEvent) => void>,
            required: true
        }
    },
    components: { ProvidersSection, ModalContainer },
})

</script>
<style lang="scss" scoped>
@import "@/assets/sass/modal.scss";

:deep(.modal-content) {
    max-height: 60vh;
}
</style>