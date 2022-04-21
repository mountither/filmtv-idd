<template >
    <vue-final-modal classes="modal-container" content-class="modal-content">
        <div class="row align-items-center">
            <font-awesome-icon icon="exclamation-triangle" color="orange" style="height: 50px" class="col-1" />
            <h6 v-if="type === 'watchlist'" class="col">
                You must be a member to add
                <span v-if="title" style="font-weight: 700;">{{ title }}</span>
                <span v-else>this item</span> to your watchlist
            </h6>
            <h6 v-if="type === 'rating-review'" class="col">
                You must be a member to post a rating/review for 
                <span v-if="title" style="font-weight: 700;">{{ title }}</span>
                <span v-else>this item</span>
            </h6>
        </div>
        <hr class="w-75 my-3 align-self-center" />
        <div class="row gap-1 text-center justify-content-center">
            <router-link to="/signup" class="col-5">
                <button class="btn btn-primary text-white" style="font-weight: 600;">Sign up</button>
            </router-link>
            <router-link to="/signin" class="col-5">
                <button class="btn btn-secondary text-white" style="font-weight: 600;">Sign in</button>
            </router-link>
        </div>
        </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';


export default defineComponent({
    props: {
        title: String,
        type: String as PropType<"watchlist" | "rating-review">
    },
})

</script>
<style lang="scss" scoped>
@import "@/assets/sass/modal.scss";

:deep(.modal-content) {
    max-height: 65vh;
    word-wrap: break-word;
    padding-top: 15px !important;
}
</style>