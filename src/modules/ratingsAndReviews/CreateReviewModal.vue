<template >
    <ModalContainer title="Your Review" name="createReviewModal" :close-handler="closeReviewModal"
    
    >
        <!-- Content -->
        <div>
            <form class="row gap-2 needs-validation px-4 py-3" novalidate @submit.prevent="submitReview">
                <div class="px-0 position-relative mb-4">
                    <label for="title" class="form-label">Title</label>
                    <div class="input-group">
                        <input type="title" name="title" required id="title" v-model.trim="form.title"
                            class="w-100 form-control" aria-label="title input" />
                    </div>
                    <div class="position-absolute bottom-5" v-for="(error, index) of v$.form.title.$errors"
                        :key="index">
                        <div class="text-danger">{{ error.$message }}</div>
                    </div>
                </div>
                <div class="px-0 position-relative mb-4">
                    <label for="content" class="form-label">Description</label>
                    <div class="input-group">
                        <textarea type="text" name="content" required id="content" v-model.trim="form.content"
                            style="height: 150px;" class="w-100 form-control" aria-label="description input" />
                    </div>

                    <div class="position-absolute bottom-5" v-for="(error, index) of v$.form.content.$errors"
                        :key="index">
                        <div class="text-danger">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="my-2 px-0 position-relative">
                    <label class="form-label">Rating</label>
                    <div class="position-relative d-flex flex-row align-items-center">
                        <star-rating v-model:rating="form.rating" :star-size="40" :show-rating="showRating">
                        </star-rating>
                        <div class="position-absolute" style="bottom:0px; right:0px">
                        <NumericalRating v-if="form.rating" :rating="form.rating" :size="60" :number-font-size="30"/>
                        </div>

                    </div>
                </div>
                <div class="form-check form-switch mt-3">
                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked"
                        v-model="form.hasSpoilers" />
                    <label class="form-check-label text-danger" style="font-weight: 700;"
                        for="flexSwitchCheckChecked">My
                        review includes of spoilers</label>
                </div>
                <div class="mt-5 mx-0 row gap-3">
                    <button class="btn col btn-danger text-white btn-lg" style="font-weight: 600;" @click="closeReviewModal"
                        type="button">Cancel</button>
                    <button v-if="!loading" class="btn col btn-secondary text-white btn-lg" style="font-weight: 600;"
                        :disabled="loading && v$.$invalid" type="submit">Submit</button>
                    <button v-else class="btn col btn-primary text-white btn-lg" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Submitting...
                    </button>
                </div>
            </form>
        </div>
    </ModalContainer>

</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
//@ts-ignore
import StarRating from 'vue-star-rating'
import { minLength, required, helpers, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import type { MediaTypes } from '../media/types';
import { addNewRating, updateRating } from './methods/ratingsAPI';
import { addNewReview, updateReview } from './methods/reviewsAPI';
import ModalContainer from '@/common/components/modals/ModalContainer.vue';


import NumericalRating from "./components/NumericalRating.vue";
export default defineComponent({
    data() {
        return {
            showRating: false as Boolean,
            form: {
                title: this.userMediaReview?.title as string,
                content: this.userMediaReview?.content as string,
                hasSpoilers: this.userMediaReview?.hasSpoilers || false as boolean,
                rating: this.userMediaRating?.rating as number,
            },
            loading: false as Boolean
        }
    },
    setup: () => ({ v$: useVuelidate() as any}),
    components: { StarRating, ModalContainer, NumericalRating },
    props: {
        mediaId: Number,
        mediaType: String as PropType<MediaTypes>,
        userMediaRating: {} as PropType<{
            isExists: boolean | undefined,
            id: string | undefined,
            rating: number | undefined
        }>,
        userMediaReview: {} as PropType<{
            isExists: boolean | undefined,
            id: string | undefined,
            title: string | undefined,
            content: string | undefined,
            hasSpoilers: boolean | undefined,
        }>,
        refetchRatingData: Function,
        refetchReviewData: Function,
        modalHandler: Function as PropType<((payload: MouseEvent) => void)>
    },
    watch: {
        //* update forms' this.rating on change db rating
        userMediaRating: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.form.rating = value.rating
                }
            }
        },
        //* update form's this.review infno on change db review info
        userMediaReview: {
            immediate: true,
            handler(value) {
                this.form.title = value.title;
                this.form.content = value.content;
                this.form.hasSpoilers = value.hasSpoilers;
            }
        }

    },
    validations() {
        return {
            form: {
                title: {
                    required: helpers.withMessage('Please enter title', required),
                    minLength: helpers.withMessage(
                        () => `Title must at least 4 characters`,
                        minLength(4)
                    ),
                    maxLength: helpers.withMessage(
                        () => `Your title has exceeded the 50 character limit`,
                        maxLength(50)
                    ),
                },
                content: {
                    required: helpers.withMessage('Please enter a description', required),
                    minLength: helpers.withMessage(
                        () => `Descriptions must at least 20 characters`,
                        minLength(20)
                    ),
                    maxLength: helpers.withMessage(
                        () => `Your description has exceeded the 1000 character limit`,
                        maxLength(1000)
                    ),
                },
            },
        }
    },
    computed: {
        user() {
            return this.$store.getters.user
        },
        mediaIdentifier(): string {
            return `${this.mediaId}-${this.mediaType}`;
        }
    },
    methods: {
        async closeReviewModal(): Promise<void> {
            await this.$vfm.hide('createReviewModal');
            this.v$.$reset();

            if (!this.userMediaRating?.rating) {
                this.form.rating = 0;
            }
            else {
                this.form.rating = this.userMediaRating?.rating
            }

            if (!this.userMediaReview?.isExists) {
                this.form.title = "";
                this.form.content = "";
                this.form.hasSpoilers = false;
            }
            else {
                this.form.title = this.userMediaReview?.title || ""
                this.form.content = this.userMediaReview?.content || ""
                this.form.hasSpoilers = this.userMediaReview?.hasSpoilers || false
            }

        },
        async writeToRatingDoc() {
            try {
                if (this.userMediaRating?.isExists) {
                    //* update rating doc only if rating is not changed
                    if (this.userMediaRating.rating !== this.form.rating) {
                        //* also, update the review document's rating field, if exists
                        await updateRating({ rating: this.form.rating, docId: this.userMediaRating.id });
                    }
                } else {
                    await addNewRating({
                        userId: this.user.id,
                        mediaIdentifier: this.mediaIdentifier,
                        rating: this.form.rating
                    });
                }
            } catch (error) {
                this.$toast.open({
                    message: "Failed to submit your rating, please try again.",
                    type: "error",
                });
            }
        },
        async submitReview() {
            try {
                const isFormValid = await this.v$.$validate()

                if (!isFormValid) {
                    this.$toast.open({
                        message: "Please input the correct info",
                        type: "warning",
                    });
                    return;
                }

                if (this.form.rating === 0) {
                    this.$toast.open({
                        message: "A rating must be added.",
                        type: "warning",
                    });
                    return;
                }

                await this.writeToRatingDoc();

                //* check reviews.
                if (this.userMediaReview?.isExists) {

                    await updateReview({
                        docId: this.userMediaReview.id,
                        title: this.form.title,
                        content: this.form.content,
                        hasSpoilers: this.form.hasSpoilers,
                        rating: this.form.rating
                    })

                    this.$toast.open({
                        message: "Your review has been updated!",
                        type: "success",
                    });
                }
                else {
                    await addNewReview({
                        title: this.form.title,
                        content: this.form.content,
                        hasSpoilers: this.form.hasSpoilers,
                        userId: this.user.id,
                        mediaIdentifier: this.mediaIdentifier,
                        rating: this.form.rating
                    })

                    this.$toast.open({
                        message: "Your reviews is submitted successfully",
                        type: "success",
                    });
                }

                await this.closeReviewModal();
                if (this.refetchRatingData) {
                    this.refetchRatingData()
                }

                if (this.refetchReviewData) {
                    this.refetchReviewData()
                }

            } catch (error) {
                this.$toast.open({
                    message: "Failed to submit your review, please try again.",
                    type: "error",
                });
                console.log(error)
            }
        }
    }
})
</script>
<style lang="scss" scoped>
@import "@/assets/sass/modal.scss";


label {
    font-weight: 800;
}
</style>