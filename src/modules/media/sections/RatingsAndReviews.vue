<template>
    <div class="row">
        <div class="col-lg-5 align-self-center mt-3 mt-lg-0 w-100">
            <h4>Rating and Reviews</h4>
            <hr class="my-2" />
            <div class="col">
                <div class="row d-flex flex-row justify-content-between my-3">
                    <div class="d-flex flex-column col">
                        <h1 v-if="voteAverage > 0" style="font-size: 90px; white-space: nowrap">
                            {{ voteAverage }}<span style="font-size: 20px;">/5</span>
                        </h1>
                        <p v-else class="my-5">No Ratings added yet.</p>

                        <div class="d-flex flex-row align-items-center gap-2 bg-primary rounded-3 px-3 py-1 mb-5"
                            style="width:150px" v-if="userRatingInfoDb.rating">
                            <p class="m-0 text-white">Your Rating:</p>
                            <h1 class="text-white" style="font-size: 40px; white-space: nowrap">
                                {{ userRatingInfoDb.rating }}<span style="font-size: 12px;">/5</span>
                            </h1>
                        </div>

                        <div class="d-flex flex-row align-items-center">
                            <img src="/images/tmdb-logo.svg" style="width: 40px;" />
                            <p class="m-0 mx-2">
                                <span style="font-weight:600">{{ tmdbVoteAverage }}</span>/10
                            </p>
                        </div>
                    </div>
                    <div class="row gap-3 align-self-start" style="font-weight: 800; width: 150px;">
                        <button class="btn btn-primary text-white" style="font-weight: 600;"
                            @click="onShowRatingModal">{{ userRatingInfoDb.isExists ? "Edit" : "Add" }} Rating</button>
                        <button class="btn btn-secondary text-white" style="font-weight: 600;"
                            @click="onShowReviewModal">{{ userReviewInfoDb.isExists ? "Edit" : "Add" }} Review</button>
                    </div>
                </div>

                <div class="container-full d-flex flex-row gap-3 py-2 px-3 px-xl-0"
                    style="overflow-x: auto; white-space:normal" v-if="allReviews && allReviews?.length > 0">
                    <!-- review card -->
                    <ReviewCard
                        v-for="review in allReviews" :key="review?.id"
                        :agent-image="review.author_details?.avatar_path"
                        :agent-name="review?.author_details?.name || review?.author"
                        :rating="review?.rating || (review?.author_details?.rating && (review.author_details.rating/2))"
                        :title="review?.title"
                        :has-spoilers="review.has_spoilers"
                        :content="review.content"
                        :is-local-review="review.is_local"
                        :reviewed-at="review.created_at"
                    />
                </div>
                <div v-else>
                    <p class="mt-5">No Reviews added yet.</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Rating Modal -->
    <CreateRatingModal v-model="showCreateRatingModal" :media-id="mediaId" :modal-handler="onShowRatingModal"
        :media-type="mediaType" :user-media-rating="userRatingInfoDb" :user-media-review="userReviewInfoDb"
        :refetch-rating-data="updateRating" />

    <!-- Review form modal -->
    <CreateReviewModal v-model="showCreateReviewModal" :media-id="mediaId" :modal-handler="onShowReviewModal"
        :user-media-rating="userRatingInfoDb" :user-media-review="userReviewInfoDb" :media-type="mediaType"
        :refetch-rating-data="updateRating" :refetch-review-data="updateReview" />

    <!-- Non-authenticated user info modal -->
    <NoAccessModal v-model="showNoAccessModal" :title="mediaTitle" type="rating-review" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { ReviewsTypes } from '@/common/api/tmdb/types/reviews'
import CreateRatingModal from "@/modules/ratingsAndReviews/CreateRatingModal.vue";
import CreateReviewModal from "@/modules/ratingsAndReviews/CreateReviewModal.vue";

import ReadMoreContentModal from "@/common/components/modals/ReadMoreContentModal.vue";

// @ts-ignore
import { IMAGE_BASE_URL_92 } from "@/common/api/tmdb";
import type { MediaTypes } from "../types";
import type { UserRatingInfoInDb, UserReviewInfoInDb } from "@/modules/ratingsAndReviews/types";
import { fetchUserReview, fetchAllMediaReviews } from '@/modules/ratingsAndReviews/methods/reviewsAPI'
import { fetchUserMediaRating, fetchMediaVoteAverage } from '@/modules/ratingsAndReviews/methods/ratingsAPI'
import NoAccessModal from '@/common/components/modals/NoAccessModal.vue';
import ReviewCard from "@/modules/ratingsAndReviews/components/ReviewCard.vue";


export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_92,
            showCreateRatingModal: false as boolean,
            showCreateReviewModal: false as boolean,
            showNoAccessModal: false as boolean,
            userRatingInfoDb: {} as UserRatingInfoInDb,
            userReviewInfoDb: {} as UserReviewInfoInDb,
            localReviews: [] as ReviewsTypes["results"],
            voteAverage: 0 as Number,
        }
    },
    components: {
        CreateRatingModal,
        CreateReviewModal,
        ReadMoreContentModal,
        NoAccessModal,
        ReviewCard
    },
    props: {
        tmdbVoteAverage: Number,
        tmdbReviewData: [] as PropType<ReviewsTypes["results"]>,
        mediaId: Number,
        mediaTitle: String || undefined,
        mediaType: String as PropType<MediaTypes>,
    },
    computed: {
        user() {
            return this.$store.getters.user
        },
        mediaIdentifier(): string {
            return `${this.mediaId}-${this.mediaType}`;
        },
        //* collate local db reviews + tmdb reviews in 1 array.
        allReviews(): ReviewsTypes["results"] | undefined {
            if (!this.tmdbReviewData || !this.localReviews) return;
            const sortedTmdbReviewData = this.tmdbReviewData.sort((a, b) =>
                new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
            );
            return this.localReviews.concat(sortedTmdbReviewData);
        },
    },
    watch: {
        user: {
            immediate: true,
            handler(value) {
                if (value !== undefined) {
                    //* if user is logged in, fetch all + user's ratings/reviews.
                    this.getUserMediaRating();
                    this.getUserMediaReview();
                }
            },
        },
    },
    mounted() {
        this.processVoteAverage();
        this.getAllMediaReviews();
    },
    methods: {
     
        onShowRatingModal() {
            if (!this.user) {
                this.showNoAccessModal = true;
                return;
            }
            this.showCreateRatingModal = !this.showCreateRatingModal;
        },
        onShowReviewModal() {
            if (!this.user) {
                this.showNoAccessModal = true;
                return;
            }
            this.showCreateReviewModal = !this.showCreateReviewModal;
        },
        async getAllMediaReviews(): Promise<void> {
            try {
                const reviewData = await fetchAllMediaReviews({
                    mediaIdentifier: this.mediaIdentifier
                })

                this.localReviews = reviewData;

            } catch (error) {
                this.$toast.open({
                    message: `Failed to fetch all reviews`,
                    type: "error",
                });
            }
        },
        async processVoteAverage(): Promise<void> {
            try {
                const voteAverage = await fetchMediaVoteAverage({ mediaIdentifier: this.mediaIdentifier });

                this.voteAverage = voteAverage;

            } catch (error) {
                this.$toast.open({
                    message: `Failed to fetch ${this.mediaType} ratings`,
                    type: "error",
                });
            }
        },
        //* update methods invoked when rating or review is submitted.
        updateRating(): void {
            this.getUserMediaRating()
        },
        updateReview(): void {
            this.getUserMediaReview();
            this.getAllMediaReviews();

        },
        async getUserMediaRating(): Promise<void> {
            try {
                const userRatingInfoDb = await fetchUserMediaRating({
                    mediaIdentifier: this.mediaIdentifier,
                    userId: this.user.id
                });

                this.userRatingInfoDb = userRatingInfoDb;
            }
            catch (error) {
                this.$toast.open({
                    message: "Failed to fetch your ratings.",
                    type: "error",
                });
            }
        },
        async getUserMediaReview(): Promise<void> {
            try {
                const userReviewInfoDb = await fetchUserReview({ mediaIdentifier: this.mediaIdentifier, userId: this.user.id })

                this.userReviewInfoDb = userReviewInfoDb;

            } catch (error) {
                this.$toast.open({
                    message: "Failed to fetch your reviews",
                    type: "error",
                });
            }
        }
    },
})

</script>