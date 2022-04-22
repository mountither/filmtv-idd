<template>
    <div class="my-5">
        <!-- Profile Header -->
        <section class="d-flex justify-content-between align-items-end">
            <img v-if="user?.photoUrl" :src="user.photoUrl" style="height:70px;width:70px;object-fit:fill;"
                class="rounded-circle mx-2 border" />
            <h1 v-if="user?.name" class="col m-0" style="font-weight: 500;"><span style="font-weight: 300;">Hello,
                </span>{{ user.name }}</h1>
            <h1 v-else class="col m-0">My Profile</h1>

            <button class="btn btn-md btn-danger rounded-3 text-white" @click="onSignOut" style="font-weight: 800;">Sign
                out</button>
        </section>
        <!-- User's Watchlist Preview -->
        <section class="mt-5">
            <div class="d-flex align-items-center justify-content-between mb-2">
                <h3 class="col text-left">My Watchlist <span style="font-weight: 300;">({{ userWatchlistTotal ||
                        0
                }})</span>
                </h3>
                <button v-if="userWatchlistTotal > 10" type="button" class="btn btn-link text-tertiary p-0 shadow-none"
                    @click="onViewAllPress('/mywatchlist')" style="font-weight: 600;">
                    view all
                </button>
            </div>

            <skeletor v-if="watchlist.isLoading" :height="330" />
            <div v-else>
                <div v-if="watchlist.data && watchlist.data.length > 0"
                    class="container-full d-flex px-3 pb-2 px-xl-0 flex-row gap-2"
                    style="overflow-x: auto; overflow-y: hidden;">
                    <MediaCard v-for="(item, index) in watchlist.data" :key="item.id" :show-date="showMediaDate"
                        :id="item.id" :title="item.title || item.name || 'untitled'" :poster-path="item.poster_path"
                        :release-date="item.release_date || item.first_air_date" :media-type="item?.media_type" />
                </div>
                <div v-else class="col text-center">
                    <p>No media found in your watchlist</p>
                    <div class="row justify-content-center">
                        <router-link to="/">
                            <button class="btn col-2 btn-primary btn-sm text-white" style="font-weight: 700;">Explore TV
                                and Movies</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- User's Rating Preview -->
        <section class="mt-5">
            <div class="d-flex align-items-center justify-content-between mb-2">
                <h3 class="col text-left">My Ratings <span style="font-weight: 300;">({{ ratings.total }})</span>
                </h3>
                <button v-if="ratings.total > 5" type="button" class="btn btn-link text-tertiary p-0 shadow-none"
                     @click="onViewAllPress('/myratings')"  style="font-weight: 600;">
                    view all
                </button>
            </div>

            <skeletor v-if="ratings.isLoading" :height="330" />
            <div v-else>
                <div v-if="ratings.data && ratings.data.length > 0"
                    class="container-full d-flex px-3 pb-2 px-xl-0 flex-row gap-2"
                    style="overflow-x: auto; overflow-y: hidden;">
                    <!-- User Media Rating Card -->
                    <MediaRatingCard v-for="(item) in ratings.data" :key="item.mediaId" :poster-path="item.mediaPoster"
                        :id="item.mediaId" :media-type="item.mediaType" :rating="item.rating"
                        :rated-at="item.ratedAt" />
                </div>
                <div v-else class="col text-center">
                    <p>No Ratings found</p>
                    <div class="row justify-content-center">
                        <router-link to="/">
                            <button class="btn col-2 btn-primary btn-sm text-white" style="font-weight: 700;">Rate
                                TV/Movies you've watched</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- User's Review Preview -->
        <section class="mt-5">
            <div class="d-flex align-items-center justify-content-between mb-2">
                <h3 class="col text-left">My Reviews <span style="font-weight: 300;">({{ reviews.total }})</span>
                </h3>
                <button v-if="reviews.total > 5" type="button" class="btn btn-link text-tertiary p-0 shadow-none"
                    @click="onViewAllPress('/myreviews')" style="font-weight: 600;">
                    view all
                </button>
            </div>

            <skeletor v-if="reviews.isLoading" :height="330" />
            <div v-else>
                <div v-if="reviews.data && reviews.data.length > 0"
                    class="container-full d-flex px-3 pb-2 px-xl-0 flex-row gap-2"
                    style="overflow-x: auto; overflow-y: hidden;">
                    <!-- review card -->
                    <ReviewCard v-for="review in reviews.data" :key="review?.id" :agent-image="review.mediaPoster"
                        :agent-name="review.mediaTitle" :rating="review?.rating" :title="review?.title"
                        :agent-is-media="reviewCardConfig.agentIsMedia" :has-spoilers="review.hasSpoilers"
                        :content="review.content" :is-local-review="reviewCardConfig.isLocalReview"
                        :media-info="{ id: review.mediaId, type: review.mediaType }" :reviewed-at="review.reviewedAt" />

                </div>
                <div v-else class="col text-center">
                    <p>No Reviews found</p>
                    <div class="row justify-content-center">
                        <router-link to="/">
                            <button class="btn col-2 btn-primary btn-sm text-white" style="font-weight: 700;">Review
                                TV/Movies you've watched</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script lang="ts">
import { fetchMediaWithID } from "@/common/api/tmdb";
import type { MovieTypes } from "@/common/api/tmdb/types/movie";
import type { TVTypes } from "@/common/api/tmdb/types/tv";
import { currentUser, firestore } from "@/firebaseConfig";
import MediaCard from '@/modules/media/MediaCard.vue';
import type { MediaTypes } from "@/modules/media/types";
import {
    collection, doc, getDoc, getDocs, limit, orderBy, query,
    where
} from "@firebase/firestore";
import { defineComponent } from "vue";
import { formatDistance } from 'date-fns';
import MediaRatingCard from '@/modules/ratingsAndReviews/components/MediaRatingCard.vue';
import ReviewCard from "@/modules/ratingsAndReviews/components/ReviewCard.vue";
import type {RatingData, ReviewData} from '@/modules/ratingsAndReviews/types'

const PREVIEW_ITEMS_MAX = 8;
type MediaDataTypes = MovieTypes & TVTypes & { date_added_wl?: number, media_type: MediaTypes }



export default defineComponent({
    components: { MediaCard, MediaRatingCard, ReviewCard },
    data() {
        return {
            watchlist: {
                data: [] as MediaDataTypes[],
                isLoading: true as boolean,
            },
            ratings: {
                data: [] as Array<RatingData>,
                total: undefined as Number | undefined,
                isLoading: true as boolean,
            },
            reviews: {
                data: [] as Array<ReviewData>,
                total: undefined as Number | undefined,
                isLoading: true as boolean,
            },
            reviewCardConfig: {
                isLocalReview: true as boolean,
                agentIsMedia: true as boolean,
            },
            showMediaDate: false,
        }
    },
    methods: {
        async onSignOut() {
            await this.$store.dispatch('signOut')
            this.$router.push('/')
            this.$toast.open({
                message: 'You have signed out',
                type: 'info',
            });
        },
        async fetchUserWatchlist() {
            try {
                if (!this.userWatchlistSortedPreview) return

                const wlTempArray = [];

                for (var media in this.userWatchlistSortedPreview) {
                    const id = this.userWatchlistSortedPreview[media].id;
                    const type = this.userWatchlistSortedPreview[media].mediaType;

                    //* fetch media info based on id and type.
                    const data = await fetchMediaWithID({ appendResponses: false, id, type });

                    if (!data) continue;

                    const date_added_wl = this.userWatchlistSortedPreview[media].date_added.seconds
                    // append new field - date added to watchlust.
                    wlTempArray.push({ ...data, date_added_wl, media_type: type })
                }



                //* sort by most recent (default) + get only top 10 results.
                this.watchlist.data = wlTempArray;

                // console.log(JSON.stringify(this.watchlistData, null, 4))
                this.watchlist.isLoading = false;
            }
            catch (error) {
                //TODO - add toast message here

                console.log(error)
                this.watchlist.isLoading = false;

            }

        },
        async fetchRatings(): Promise<void> {
            try {

                //* retrieve user's rating documents 
                const ratingDocRef = collection(firestore, "ratings");

                const ratingQuery = query(
                    ratingDocRef,
                    where("author_id", "==", this.user.id),
                    orderBy("created_at", "desc"),
                    limit(5)
                );

                const querySnapshot = await getDocs(ratingQuery);
                const tempRatingData: RatingData[] = []
                for (var doc of querySnapshot.docs) {
                    //* fetch relevant rating info for media
                    //* title, poster path, id, media type, rating number, rating created_at,

                    const [id, type] = doc.data().mediaId.split("-");
                    //* fetch media info based on id and type.
                    const mediaData = await fetchMediaWithID({ appendResponses: false, id, type });

                    if (!mediaData) continue;

                    const ratedAt = formatDistance(
                        new Date(doc.data().created_at.seconds * 1000),
                        new Date(),
                        { addSuffix: true }
                    )

                    tempRatingData.push({
                        ratedAt,
                        rating: doc.data().rating,
                        mediaId: id,
                        mediaTitle: mediaData.title || mediaData.name,
                        mediaPoster: mediaData.poster_path,
                        mediaType: type,
                    })
                }
                //* grab user's rating count from their document
                const { ratingCount } = Object(await this.userRatingReviewCount);

                this.ratings.total = ratingCount;
                this.ratings.data = tempRatingData;

                this.ratings.isLoading = false

            } catch (error) {
                console.log(error)
                //TODO - add toast message here

                this.ratings.isLoading = false

            }
        },
        async fetchReviews(): Promise<void> {
            try {

                //* retrieve user's review documents 
                const reviewDocRef = collection(firestore, "reviews");

                const reviewQuery = query(
                    reviewDocRef,
                    where("author_id", "==", this.user.id),
                    orderBy("created_at", "desc"),
                    limit(5)
                );

                const querySnapshot = await getDocs(reviewQuery);
                const tempReviewData: ReviewData[] = []
                for (var doc of querySnapshot.docs) {
                    //* fetch relevant rating info for media
                    //* title, poster path, id, media type, rating number, rating created_at,

                    const [id, type] = doc.data().mediaId.split("-");
                    //* fetch media info based on id and type.
                    const mediaData = await fetchMediaWithID({ appendResponses: false, id, type });

                    if (!mediaData) continue;

                    const reviewedAt = doc.data()?.created_at

                    tempReviewData.push({
                        reviewedAt,
                        rating: doc.data().rating,
                        mediaId: id,
                        mediaTitle: mediaData.title || mediaData.name,
                        mediaPoster: mediaData.poster_path,
                        mediaType: type,
                        content: doc.data().content,
                        title: doc.data().title,
                        hasSpoilers: doc.data().has_spoilers,
                    })
                }

                //* grab user's review count from their document
                const { reviewCount } = Object(await this.userRatingReviewCount);

                this.reviews.total = reviewCount;
                this.reviews.data = tempReviewData;

                // console.log(JSON.stringify(this.reviews.data, null, 4))
                this.reviews.isLoading = false

            } catch (error) {
                console.log(error)
                //TODO - add toast message here

                this.reviews.isLoading = false

            }
        },
        onViewAllPress(path: string) {
            this.$router.push({ path })
        }
    },
    computed: {
        user() {
            return this.$store.getters.user;
        },
        userWatchlist() {
            return this.$store.getters.userWatchlist
        },
        userWatchlistSortedPreview(): Array<any> | undefined {
            if (this.userWatchlist) {
                //* sort by date added + get top N items. 
                return (<any>Object).entries(this.userWatchlist).map((entry: any) => entry[1]).sort((x: any, y: any) => {
                    return y.date_added.seconds - x.date_added.seconds;
                }).slice(0, PREVIEW_ITEMS_MAX)
            }
        },
        userWatchlistError() {
            return this.$store.getters.userWatchlistError
        },
        userWatchlistTotal() {
            return this.$store.getters.userWatchlistTotal
        },
        async userRatingReviewCount(): Promise<{ ratingCount: number, reviewCount: number } | undefined> {
            try {
                const userDocRef = doc(firestore, "users", this.user.id)
                const query = await getDoc(userDocRef);
                const ratingCount = query?.data()?.ratingCount;
                const reviewCount = query?.data()?.reviewCount;

                return {
                    ratingCount: ratingCount || 0,
                    reviewCount: reviewCount || 0,
                }

            } catch (error) {
                console.log(error)
            }
        }
    },
    watch: {
        userWatchlist: {
            immediate: true,
            async handler() {
                if (await currentUser()) {
                    this.fetchUserWatchlist();
                }
            },
        },
        userWatchlistError: {
            immediate: true,
            async handler(value) {
                if (value) {
                    this.watchlist.isLoading = false
                }
            },
        },
        user: {
            immediate: true,
            async handler() {
                if (await currentUser()) {
                    await this.fetchRatings();
                    await this.fetchReviews();

                }
            }
        }
    }
})
</script>
<style scoped>
</style>