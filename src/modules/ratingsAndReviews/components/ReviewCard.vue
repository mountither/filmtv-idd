<template>
    <div
        class="review-card col-xs align-items-center rounded-3 shadow-sm bg-light p-3 py-3 border border-1 position-relative">
        <div class="d-flex flex-row justify-content-between align-items-start p-0">
            <!-- Author OR Media img + name - right side of card -->
            <div class="d-flex flex-column">
                <span v-if="!agentImage"
                    :class="`${agentIsMedia ? 'media-image' : 'profile-image'} bg-tertiary rounded-circle p-0`" />
                <img v-else @click="agentIsMedia ? navigateToMedia() : undefined" :src="getDisplayPhoto()"
                    :class="`${agentIsMedia ? 'rounded-2 media-image' : 'rounded-circle profile-image border'} shadow-sm`" />
                <div class="mt-1">
                    <p class="m-0 agent-name text-secondary">{{ agentName }}
                    </p>
                </div>
            </div>
            <!-- review star rating - left side of card-->
            <star-rating v-if="rating" :rating="rating" :read-only="starRatingConfig.readOnly"
                :show-rating="starRatingConfig.showText" :increment="0.5" :star-size="15"></star-rating>
        </div>
        <!-- title, spoiler alert and content -->
        <div class="d-flex flex-column pb-3 mt-1">
            <p v-if="title" class="m-0 my-2 text-decoration-underline">{{ title }}</p>
            <p v-if="hasSpoilers" style="font-weight: 600;" class="m-0 text-danger">Spoiler
                Alert!</p>
            <p v-if="content" class="my-2 review-content ">{{
                    displayReviewContent(content).text
            }}<span @click="openReadMoreModal(content)" class="btn-link read-more-lnk">{{
        displayReviewContent(content).isLong ?
            "... read more" : ""
}}</span></p>
        </div>
        <!-- bottom section - tmdb review ? and time ago published -->
        <img v-if="!isLocalReview" src="/images/tmdb-logo.svg" style="width: 40px; bottom:8px"
            class="position-absolute" />

        <div v-show="reviewedAt" class="position-absolute" style="bottom: 8px; right: 8px;">
            <p class="m-0 text-black-50">{{ formatReviewDate(reviewedAt, isLocalReview) }}
            </p>
        </div>
    </div>
    <!-- Read more modal for review content  -->
    <ReadMoreContentModal v-model="showReadMoreModal" name="readMoreContentModal" :full-text="readMoreFullText" />
</template>

<script lang="ts">

import { defineComponent, type PropType } from "vue"
import ReadMoreContentModal from "../../../common/components/modals/ReadMoreContentModal.vue"
import { IMAGE_BASE_URL_500 } from "@/common/api/tmdb";
import { format, formatDistance } from 'date-fns';
import StarRating from 'vue-star-rating'
import type { MediaTypes } from "@/modules/media/types";
import type { Timestamp } from "@firebase/firestore";

export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500,
            showReadMoreModal: false as boolean,
            showNoAccessModal: false as boolean,
            readMoreFullText: "" as string,
            readMoreContent: false as boolean,
            starRatingConfig: {
                readOnly: true as boolean,
                showText: false as boolean
            }
        }
    },
    props: {
        agentImage: String || undefined,
        agentName: String || undefined,
        agentIsMedia: {
            type: Boolean,
            default: false,
            required: false,
        },
        mediaInfo: {
            type: Object as PropType<{ id: String, type: MediaTypes } | undefined>,
            default: undefined,
            required: false,
        },
        rating: Number || undefined,
        title: String || undefined,
        hasSpoilers: Boolean || undefined,
        content: String || undefined,
        isLocalReview: Boolean || undefined,
        reviewedAt: {} as PropType<Timestamp> || String || undefined,
    },
    components: { ReadMoreContentModal, StarRating },
    methods: {
        getDisplayPhoto(): string | undefined {
            if (!this.agentImage) return;

            const tmdbImgUrl = `${IMAGE_BASE_URL_500}${this.agentImage}`
            //if from local db, img path is full
            if (this.isLocalReview && !this.agentIsMedia) {
                return this.agentImage
            }

            //check if image is from tmdb. sometimes tmdb stores user image @ gravatar + if agent is media, use tmdb url
            if (!this.agentImage.includes("gravatar") || this.agentIsMedia) {
                return tmdbImgUrl
            } else {
                //remove leading forward slash from gravatar url 
                // (e.g /https://...)
                return this.agentImage.substring(1)
            }
        },
        displayReviewContent(content: string): { isLong: boolean, text: string } {
            let isLong = false;
            if (content.length > 200) {
                isLong = true
            }
            return { isLong, text: content.slice(0, 200) }
        },
        openReadMoreModal(content: string | undefined): void {
            if (!content) return;
            this.readMoreFullText = content;
            this.showReadMoreModal = !this.showReadMoreModal;
        },
        formatReviewDate(date: any, isLocal: boolean | undefined): string | undefined {
            if (!date) return;
            let reviewDate: Date;
            if (isLocal) {
                reviewDate = new Date(date.seconds * 1000);
            }
            else {
                reviewDate = new Date(date);
            }
            return formatDistance(
                reviewDate,
                new Date(),
                { addSuffix: true }
            )
        },
        navigateToMedia(): void {
            this.$router.push(`/media/${this.mediaInfo?.type}/${this.mediaInfo?.id}`)
        }
    }
})
</script>

<style scoped>
.review-card {
    min-width: 300px;
    width: 300px;
}

.profile-image {
    object-fit: cover;
    height: 40px;
    width: 40px;
}

.media-image {
    object-fit: cover;
    height: 90px;
    width: 60px;
    cursor: pointer;
    transition: opacity 0.3s;
}

.media-image:hover {
    opacity: 0.8;
    transition: opacity 0.3s;
}

.agent-name {
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-weight: 600;
}

.read-more-lnk {
    cursor: pointer;
    color: #1a0dab;
    font-weight: 600;
}
</style>