<template >
    <div class="container" >
        <div class="row">
            <div class="col d-lg-flex d-none" style="height: 100vh;">
                <skeletor v-show="isImageLoading" class="cover-image rounded-0" />
                <img
                    v-show="!isImageLoading"
                    :src="`/images/${imageName}`"
                    :alt="imageAlt"
                    style="height: 100%; object-fit: cover; width: 100%;"
                    class="cover-image"
                    @load="onImgLoad"
                />
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            isImageLoading: true as boolean,
        }
    },
    props: {
        imageName: String,
        imageAlt: String,
    },
    mounted(){
        console.log(this.imageName)
    },
    methods: {
        onImgLoad(): void {
            this.isImageLoading = false;
        }
    }
})
</script>
<style>
.cover-image {
    height: 100%;
    object-fit: cover;
    width: 100%;
}
</style>