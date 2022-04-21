<template>
    <ModalContainer title="Your Rating" :close-handler="modalHandler" name="createRatingModal">
        <!-- Content -->
        <div class="my-5 d-flex flex-column align-self-center justify-content-center">
            <star-rating v-model:rating="rating" :star-size="60" :show-rating="showRating"></star-rating>
            <div v-if="rating > 0"
                class="d-flex align-items-center justify-content-center align-self-center bg-primary rounded-circle p-2 text-white mt-4"
                style="width:100px;height:100px;">
                <h1 style="font-size: 80px;">
                    {{ rating }}<span style="font-size: 14px;">/5</span>
                </h1>
            </div>
            <h3 v-else class="mt-4">No rating added yet.</h3>
        </div>
        <div class="mt-5 mx-0 row gap-3">
            <div class="row gap-2">
                <button class="btn col btn-danger text-white btn-lg" @click="closeRatingModal"
                    style="font-weight: 600;">Cancel</button>
                <button class="btn col btn-primary text-white btn-lg" @click="submitRating"
                    style="font-weight: 600;">Submit</button>
            </div>
        </div>
    </ModalContainer>

</template>
<script lang="ts">

import { defineComponent, type PropType } from 'vue';
//@ts-ignore
import StarRating from 'vue-star-rating';
import type { MediaTypes } from '../media/types';
import { addNewRating, updateRating } from './methods/ratingsAPI';
import { updateRatingInReviewDoc } from './methods/reviewsAPI';
import type {
    UserRatingInfoInDb,
    UserReviewInfoInDb
} from "./types";
import ModalContainer from '@/common/components/modals/ModalContainer.vue';


export default defineComponent({
    data() {
        return {
            rating: this.userMediaRating?.rating as number,
            isMediaRated: false as boolean,
            showRating: false as boolean
        }
    },
    props: {
        mediaId: Number,
        mediaType: String as PropType<MediaTypes>,
        refetchRatingData: Function,
        userMediaRating: {} as PropType<UserRatingInfoInDb>,
        userMediaReview: {} as PropType<UserReviewInfoInDb>,
        modalHandler: Function as PropType<((payload: MouseEvent) => void)>
    },
    watch: {
        //* update this.rating on change db rating
        userMediaRating: function (value) {
            this.rating = value.rating
        }
    },
    components: {
        StarRating, ModalContainer
    },
    computed: {
        user() {
            return this.$store.getters.user
        },
        mediaIdentifier(): string {
            return `${this.mediaId}-${this.mediaType}`;
        },
    },
    methods: {
        async closeRatingModal(): Promise<void> {
            await this.$vfm.hide('createRatingModal')
            if (!this.userMediaRating?.rating) {
                this.rating = 0
            }
            else {
                this.rating = this.userMediaRating?.rating
            }
        },
        async submitRating() {
            try {
                if (this.rating === 0) {
                    this.$toast.open({
                        message: "A rating must be added.",
                        type: "warning",
                    });
                    return;
                }

                if (this.userMediaRating?.isExists) {
                    //* update rating doc only if rating is not changed
                    if (this.userMediaRating.rating !== this.rating) {
                        //* also, update the review document's rating field, if exists
                        if (this.userMediaReview?.isExists) {
                            await updateRatingInReviewDoc({ rating: this.rating, docId: this.userMediaReview.id });
                        }
                        await updateRating({ rating: this.rating, docId: this.userMediaRating.id });
                    }
                    this.$toast.open({
                        message: "Your rating has been updated!",
                        type: "success",
                    });
                } else {
                    await addNewRating({
                        userId: this.user.id,
                        mediaIdentifier: this.mediaIdentifier,
                        rating: this.rating
                    });

                    this.$toast.open({
                        message: "Your rating is submitted successfully",
                        type: "success",
                    });
                }

                //* close rating modal if exists
                this.closeRatingModal();

                if (this.refetchRatingData) {
                    this.refetchRatingData();
                }
            } catch (error) {
                this.$toast.open({
                    message: "Failed to submit your rating, please try again.",
                    type: "error",
                });
            }
        }
    },
})


</script>
<style lang="scss" scoped>
@import "@/assets/sass/modal.scss";
</style>