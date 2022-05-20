<template lang="">
    <section class="mt-5">
        <h1 style="font-weight: 300;">My Ratings <span style="font-weight: 800;">({{ ratingCount }})</span>
        </h1>
        <section class="row mt-5 gap-2 px-2 d-flex justify-content-center">
            <MediaRatingCard 
            class="col-auto"
            v-for="(item) in ratingData" 
            :key="item.mediaId" 
            :poster-path="item.mediaPoster"
            :title="item.mediaTitle"
                        :id="item.mediaId" :media-type="item.mediaType" :rating="item.rating"
                        :rated-at="item.ratedAt" />
        </section>
    </section>
</template>
<script lang="ts">
import { fetchMediaWithID } from "@/common/api/tmdb";
import { currentUser, firestore } from "@/firebaseConfig";
import MediaRatingCard from "@/modules/ratingsAndReviews/components/MediaRatingCard.vue";
import type { RatingData } from '@/modules/ratingsAndReviews/types';
import { getAuth } from "@firebase/auth";
import {
collection, getDocs, orderBy, query,
where
} from "@firebase/firestore";
import { formatDistance } from "date-fns";
import { defineComponent } from "vue";

export default defineComponent({
    components: {
        MediaRatingCard
    },
    data() {
        return {
            ratingData: undefined as RatingData[] | undefined,
            ratingCount: undefined as Number | undefined,
            isLoadingRatings: true as boolean,
            isFetchRatings: false as boolean,
            page: 1 as number,
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
                    await this.fetchRatings();
                }
            }
        }
    },
    methods: {
        async fetchRatings() {
            try {
                //* retrieve user's rating documents 
                const ratingDocRef = collection(firestore, "ratings");

                const ratingQuery = query(
                    ratingDocRef,
                    where("author_id", "==", getAuth().currentUser?.uid),
                    orderBy("created_at", "desc")
                );

                const querySnapshot = await getDocs(ratingQuery);
                if (querySnapshot.empty) {
                    this.$router.back();
                }

                const ratingPromises = querySnapshot.docs.map((doc: any) => {
                    const [id, type] = doc.data().mediaId.split("-");

                    return new Promise((resolve, reject) => {
                        //* fetch media info based on id and type.
                        const mediaData = fetchMediaWithID({ appendResponses: false, id, type });

                        if (!mediaData) reject();

                        resolve(mediaData)

                    }).then((data: any) => {
                        //* get date media added to watchlist from store.
                        if (!data) return;
                        const ratedAt = formatDistance(
                            new Date(doc.data().created_at.seconds * 1000),
                            new Date(),
                            { addSuffix: true }
                        )

                        // structure data fields
                        return {
                            ratedAt,
                            rating: doc.data().rating,
                            mediaId: id,
                            mediaTitle: data.title || data.name,
                            mediaPoster: data.poster_path,
                            mediaType: type,
                        }

                    })
                })

                this.ratingCount = querySnapshot.size

                //resolve all the promises - async calls to fetchMediaID. 
                const ratingData = await Promise.all(ratingPromises)

                this.ratingData = ratingData as RatingData[]

                this.isLoadingRatings = false;

            } catch (error) {
                console.log(error)
                this.isLoadingRatings = false

            }

        },
    }
})

</script>
<style lang="">
    
</style>