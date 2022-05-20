<template lang="">
    <section class="mt-5">
        <h1 style="font-weight: 300;">My Reviews <span style="font-weight: 800;">({{ reviewCount }})</span>
        </h1>
        <section class="row mt-5 gap-2 px-2 d-flex justify-content-center">
            <ReviewCard v-for="review in reviewData" :key="review?.id" :agent-image="review.mediaPoster"
                        :agent-name="review.mediaTitle" :rating="review?.rating" :title="review?.title"
                        :agent-is-media="reviewCardConfig.agentIsMedia" :has-spoilers="review.hasSpoilers"
                        :content="review.content" :is-local-review="reviewCardConfig.isLocalReview"
                        :media-info="{ id: review.mediaId, type: review.mediaType }" :reviewed-at="review.reviewedAt" />
        </section>
    </section>
</template>
<script lang="ts">
import { fetchMediaWithID } from "@/common/api/tmdb";
import { currentUser, firestore } from "@/firebaseConfig";
import ReviewCard from "@/modules/ratingsAndReviews/components/ReviewCard.vue";
import type { ReviewData } from '@/modules/ratingsAndReviews/types';
import {
collection, getDocs, orderBy, query,
where
} from "@firebase/firestore";
import { defineComponent } from "vue";

export default defineComponent({
    components: {
        ReviewCard
    },
    data() {
        return {
            reviewData: undefined as ReviewData[] | undefined,
            reviewCount: undefined as Number | undefined,
            isLoadingReviews: true as boolean,
            reviewCardConfig: {
                isLocalReview: true as boolean,
                agentIsMedia: true as boolean,
            },
        }
    },
    computed: {
        user() {
            return this.$store.getters.user;
        },
    },
    watch: {
        user: {
            immediate: true,
            async handler() {
                if (await currentUser()) {
                    await this.fetchReviews();
                }
            }
        }
    },
    methods: {
        async fetchReviews() {
            try {
                //* retrieve user's review documents 
                const reviewDocRef = collection(firestore, "reviews");

                const reviewQuery = query(
                    reviewDocRef,
                    where("author_id", "==", this.user.id),
                    orderBy("created_at", "desc"),
                );

                const querySnapshot = await getDocs(reviewQuery);

                if (querySnapshot.empty) {
                    this.$router.back();
                }

                const reviewPromises = querySnapshot.docs.map((doc: any) => {
                    const [id, type] = doc.data().mediaId.split("-");

                    return new Promise((resolve, reject) => {
                        //* fetch media info based on id and type.
                        const mediaData = fetchMediaWithID({ appendResponses: false, id, type });

                        if (!mediaData) reject();

                        resolve(mediaData)

                    }).then((data: any) => {
                        //* get date media added to watchlist from store.
                        if (!data) return;
                        const reviewedAt = doc.data()?.created_at

                        return {
                            reviewedAt,
                            rating: doc.data().rating,
                            mediaId: id,
                            mediaTitle: data.title || data.name,
                            mediaPoster: data.poster_path,
                            mediaType: type,
                            content: doc.data().content,
                            title: doc.data().title,
                            hasSpoilers: doc.data().has_spoilers,
                        }

                    })
                })

                this.reviewCount = querySnapshot.size

                //resolve all the promises - async calls to fetchMediaID. 
                const reviewData = await Promise.all(reviewPromises)


                this.reviewData = reviewData as ReviewData[]

                this.isLoadingReviews = false;

            } catch (error) {
                // console.log(error)
                this.isLoadingReviews = false

            }

        },
    }
})

</script>
<style lang="">
    
</style>