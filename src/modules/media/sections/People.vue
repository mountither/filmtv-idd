<template>
    <div class="row">
        <div class="col-lg-5 align-self-center mt-3 mt-lg-0 w-100">
            <h4>People</h4>
            <hr class="my-2" />
            <div class="my-3" v-if="creditData?.cast && creditData.cast.length > 0">
                <h5>Cast</h5>
                <div class="container-full px-3 px-xl-0 py-3 d-flex flex-row align-items-center gap-2 overflow-auto">
                    <div v-for="person in creditData?.cast" :key="person?.id"
                        class="rounded-3 shadow-sm overflow-hidden person-card bg-black position-relative">
                        <img v-if="person.profile_path" :src="`${IMAGE_BASE_URL_500}${person?.profile_path}`"
                            class="person-img" :alt="`${person.name}'s' Profile Image`" />
                        <div v-else class="person-img bg-white bg-opacity-25"></div>

                        <div class="px-2 pt-1 d-flex flex-column">
                            <p class="text-white person-name">{{ person.name }}</p>
                            <p v-if="person?.character" class="text-white person-role">{{ person?.character }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-3" v-if="getDirectors && getDirectors.length > 0">
                <h5>Director</h5>
                <div class="container-full px-3 px-xl-0 py-3 d-flex flex-row align-items-center gap-2 overflow-auto">
                    <div v-for="person in getDirectors" :key="person?.id"
                        class="bg-light rounded-3 shadow-sm overflow-hidden person-card bg-black  bg-secondary position-relative">
                        <img v-if="person?.profile_path" :src="`${IMAGE_BASE_URL_500}${person?.profile_path}`"
                            class="person-img" :alt="`${person.name}'s' Profile Image`" />
                        <div v-else class="person-img bg-white bg-opacity-25"></div>

                        <div class="px-2 pt-1 d-flex flex-column">
                            <p class="text-white person-name">{{ person?.name }}</p>
                            <p v-if="person?.job" class="text-white person-role">{{ person?.job }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-3" v-if="getCreators && getCreators.length > 0">
                <h5>Creator</h5>
                <div class="container-full px-3 px-xl-0 py-3 d-flex flex-row align-items-center gap-2 overflow-auto">
                    <div v-for="person in getCreators" :key="person?.id"
                        class="bg-light rounded-3 shadow-sm overflow-hidden person-card bg-black  bg-secondary position-relative">
                        <img v-if="person.profile_path" :src="`${IMAGE_BASE_URL_500}${person?.profile_path}`"
                            class="person-img" :alt="`${person.name}'s' Profile Image`" />
                        <div v-else class="person-img bg-white bg-opacity-25"></div>

                        <div class="px-2 pt-1 d-flex flex-column">
                            <p class="text-white person-name">{{ person.name }}</p>
                            <p v-if="person?.job" class="text-white person-role">{{ person?.job }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IMAGE_BASE_URL_500 } from "@/common/api/tmdb";
import type { MovieCreditsTypes } from "@/common/api/tmdb/types/movieCredits";
import type { TvCreditsTypes } from "@/common/api/tmdb/types/tvCredits";
import { defineComponent, type PropType } from "vue";

type Credits = TvCreditsTypes & MovieCreditsTypes

export default defineComponent({
    data() {
        return {
            IMAGE_BASE_URL_500
        }
    },
    props: {
        creditData: {} as PropType<Credits>
    },
    computed: {
        getDirectors(): TvCreditsTypes["crew"] | MovieCreditsTypes["crew"] | undefined {
            if (!this.creditData) return;
            const directors = this.creditData.crew.filter((obj: any) => {
                return obj.department === "Directing"
            })
            return directors
        },
        getCreators(): TvCreditsTypes["crew"] | MovieCreditsTypes["crew"] | undefined {
            if (!this.creditData) return;
            const creators = this.creditData.crew.filter((obj: any) => {
                return obj.department === "Writing" || obj.department === "Creator"
            })
            return creators
        }
    }
})
</script>


<style  scoped lang="scss">
@import "@/assets/sass/main.scss";

p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.person-name {
    font-weight: 500;
    font-size: 14px;
}

.person-role {
    font-size: 10px;
    -webkit-line-clamp: 1;
    /* number of lines to show */
    line-clamp: 1;
    position: absolute;
    margin: 0;
    bottom: 5%;
    left: 5%;
}

.person-card {
    width: 140px;
    min-width: 140px;
    height: 200px;
}

.person-img {
    width: 100%;
    height: 60%;
    object-fit: cover;
}

@include media-breakpoint-down(md) {
    .person-card {
        width: 110px;
        min-width: 110px;
        height: 180px;
    }

    .person-name {
        font-size: 12px;
    }

    .person-role {
        font-size: 10px;
    }
}
</style>