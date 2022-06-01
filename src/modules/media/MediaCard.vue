<template>
    <div class="position-relative">
        <!-- Media Type tag -->
        <div v-if="showMediaType"
            class="d-flex align-items-center justify-content-center rounded-circle shadow-lg bg-white"
            style="position: absolute; top: -5px; left:-5px; height: 50px;width: 50px; z-index: 51;">
            <div class="d-flex flex-column align-items-center justify-content-center">
                <Icon :name="mediaType" colour="#878787" />
                <p class="m-0 text-primary" style="font-size: 10px; font-weight: 800;">{{ mediaType }}</p>
            </div>
        </div>

        <!-- Image/Title -->
        <div class="rounded-3 overflow-hidden media-card"
            :class="bgColour == 'netflix' ? 'bg-card-alt' : 'bg-secondary'">

            <!-- Add to my watchlist action button -->
            <div @click="!isProcessingWatchlistItem ? manipulateUserWatchlist() : undefined"
                class="quick-action d-flex align-items-center align-self-center justify-content-center shadow-lg"
                :class="isMediaAddedToWl ? 'bg-tertiary' : 'bg-primary'">
                <font-awesome-icon v-show="!isProcessingWatchlistItem" :icon="isMediaAddedToWl ? 'check' : 'add'"
                    color="white" size="lg" />
                <div v-show="isProcessingWatchlistItem" class="spinner-border text-light spinner-border-sm"
                    role="status">
                </div>
            </div>

            <router-link :to="`/media/${mediaType}/${id}`" class="text-decoration-none cursor-pointer">
                <img v-if="posterPath" :src="IMAGE_BASE_URL_500 + posterPath" class="poster" :alt="`${title}'s' Poster`"/>
                <div v-else class="poster bg-black opacity-25"></div>
            </router-link>
            <div class="p-2 overflow-hidden">
                <router-link :to="`/media/${mediaType}/${id}`" class="text-decoration-none">
                    <p 
                        class="p-0 text-white title-link" 
                        data-toggle="tooltip" 
                        data-placement="bottom"
                        :title="title"
                    >{{ title }}</p>
                </router-link>
            </div>

            <!-- Bottom -->
            <div style="position: absolute; left: 7px; bottom: 0px;">
                <!-- Date released -->
                <p v-if="showDate && formattedDate" class="text-white text-white-50" style="font-size: 12px;">{{
                        formattedDate
                }}</p>
            </div>

        </div>
        <!-- Non-authenticated user info modal -->
        <NoAccessModal v-model="showNoAccessModal" :title="title" type="watchlist" />
    </div>
</template>

<script lang="ts">
import { IMAGE_BASE_URL_500 } from '@/common/api/tmdb';
import { format } from 'date-fns';
import { defineComponent, getCurrentInstance, ref, type PropType } from 'vue';
import useManipulateUserWatchlist from './composables/useManipulateUserWatchlist';
import type { MediaTypes } from './types';
import NoAccessModal from '@/common/components/modals/NoAccessModal.vue';
import { currentUser } from '@/firebaseConfig';
import Icon from "@/common/components/elements/Icon.vue";

type BGColourTypes = "default" | "netflix"

export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500,
            addedToWatchList: false as boolean,
            loadingWatchlistInfo: true as boolean,
        };
    },
    props: {
        id: Number || String || undefined,
        title: String || undefined,
        releaseDate: String || undefined,
        posterPath: String || undefined,
        mediaType: String as PropType<MediaTypes>,
        showDate: {
            type: Boolean,
            default: false,
            required: false,
        },
        showMediaType: {
            type: Boolean,
            default: false,
            required: false,
        },
        bgColour: {
            type: String as PropType<BGColourTypes>,
            default: "default",
            required: false,
        }
    },
    setup(props) {
        //* init ref related to watchlist
        const showNoAccessModal = ref(false as boolean);
        const isMediaAddedToWl = ref(false as boolean);
        const isProcessingWatchlistItem = ref(true as boolean);
        const isErrorWl = ref(false as boolean);
        //* get toast instance
        const toastInstance = getCurrentInstance()?.appContext.config.globalProperties.$toast;
        const mediaInfo = {
            id: props.id,
            title: props.title,
            type: props.mediaType
        };
        const { manipulateUserWatchlist, checkMediaInWatchlist } = useManipulateUserWatchlist(toastInstance, showNoAccessModal, isMediaAddedToWl, isProcessingWatchlistItem, isErrorWl, mediaInfo);

        return {
            manipulateUserWatchlist,
            checkMediaInWatchlist,
            showNoAccessModal,
            isMediaAddedToWl,
            isProcessingWatchlistItem
        };
    },
    computed: {
        formattedDate(): string | undefined {
            if (!this.releaseDate) return;
            return format(new Date(this.releaseDate), "MMMM/yyyy");
        },
        errorUser() {
            return this.$store.getters.errorUser;
        },
        loadingUser() {
            return this.$store.getters.loadingUser;
        },
        userWatchlistError() {
            return this.$store.getters.userWatchlistError;
        },
        userWatchlistLoading() {
            return this.$store.getters.userWatchlistLoading;
        },
        user() {
            return this.$store.getters.user;
        },
        userWatchlist() {
            return this.$store.getters.userWatchlist;
        },
        mediaIdentifier() {
            return `${this.id}-${this.mediaType}`;
        },
    },
    watch: {
        //* checks:
        //if watchlist exists (fetched at app init @ main.ts & stored in vuex), check if current media instance exists in array.
        userWatchlist: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.checkMediaInWatchlist();
                }
            },
        },
        // if watclist error arises (e.g no wl made), resolve processing wl to false.
        userWatchlistError: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.isProcessingWatchlistItem = false;
                }
            }
        },
        // if user is not logged in, watchlist is noexistent, then resolve processing wl to false.
        loadingUser: {
            immediate: true,
            async handler(value) {
                if (!value && !await currentUser()) {
                    this.isProcessingWatchlistItem = false
                }
            }
        }
    },
    components: { NoAccessModal, Icon }
})
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

:deep(.modal-container) {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    width: 100vw;
}

:deep(.modal-content) {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    width: 600px;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
}

.title {
    font-size: 6vw;
    font-weight: 900;
}

p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.media-card {
    position: relative;
    min-width: 165px;
    width: 165px;
    height: 330px;
    z-index: 20;
}

.title-link {
    cursor: pointer;
    height: 100%;
    width: 100%;
    transition: opacity 0.3s ease-in-out;
}

.title-link:hover {
    opacity: 0.7;
    text-decoration: underline;
    transition: opacity 0.3s ease-in-out;
}

.poster {
    height: 230px;
    width: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease-in-out;
}

.poster:hover {
    opacity: 0.6;
    transition: opacity 0.3s ease-in-out;
}

.quick-action {
    position: absolute;
    top: 0;
    cursor: pointer;
    right: 0;
    height: 50px;
    width: 35px;
    border-bottom-left-radius: 5px;
    z-index: 51;
    transition: opacity 0.3s;
}

.quick-action:hover {
    opacity: 0.9;
    transition: opacity 0.3s;
}

@include media-breakpoint-down(md) {
    .media-card {
        min-width: 150px;
        width: 150px;
        height: 250px;
    }

    .poster {
        height: 140px;
        width: 100%;
        object-fit: cover;
    }

    .quick-action {
        height: 40px;
        width: 30px;
    }
}
</style>