<template>
  <!-- Header section -->
  <section class="container-full" style="position: relative;overflow: hidden">
    <div class="row d-flex" v-if="headerImages.length > 0">
      <div v-for="(img, i) in headerImages" :key="i"
        :style="{ backgroundImage: 'linear-gradient(rgba(129, 178, 154,0.6),rgba(129, 178, 154,0.6)), url(' + IMAGE_BASE_URL_500 + img + ')' }"
        class="col-4 col-sm-4 bg-img p-0 overflow-hidden" />
      <div class="row search-container-full bg-primary p-4 py-5 rounded-3 shadow-lg">
        <h1 class="search-title p-0">Welcome</h1>
        <p class="search-subtitle p-0">explore all your favourite films and tv shows</p>
        <div class="input-group p-0" style="position: relative;" v-on-click-outside="closeSearchBox">
          <input class="form-control form-control-lg" type="text" @keyup="getSearchResults"
            @keyup.enter.native="onSearchPress" @focus="searchInput !== '' ? isSearchBoxOpen = true : undefined"
            placeholder="Search Films and TV shows" v-model="searchInput" />
          <div class="input-group-append">
            <button @click="onSearchPress" class="btn btn-lg btn-tertiary text-white home-search-btn"
              type="button">Go</button>
          </div>
          <Transition name="slide-fade" style="margin-top: 48px;">
            <div v-show="isSearchBoxOpen"
              style="position: absolute; top:48px, left:0; height:260px; width:100%;z-index: 10;"
              class="bg-white border border-1 border-primary rounded-bottom overflow-scroll">
              <TransitionGroup name="list" v-if="searchResults.length > 0">
                <router-link v-for="result in searchResults" :key="result.id"
                  :to="`/media/${result.media_type}/${result.id}`"
                  class="d-flex flex-row align-items-center border-bottom p-2 search-result-card text-decoration-none text-black">
                  <img :src="IMAGE_BASE_URL_92 + result.poster_path"
                    style="height: 70px; width: 45px; object-fit: cover;" class="rounded-2" />
                  <div>
                    <h6 class="mx-2">{{ result.title || result.name }}</h6>
                    <p class="mx-2">in {{ result.media_type }}</p>
                  </div>
                </router-link>
              </TransitionGroup>
              <div v-else class="d-flex flex-row align-self-center justify-content-center">
                <p>No results found</p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <div v-else>
      <skeletor class="bg-img rounded-0" />
    </div>
  </section>

  <div class="row">
    <div class="col-xl-9">
      <!-- Popular media (week) section -->
      <section class="mt-3">
        <div class="d-flex flex-row justify-content-between align-items-center">
          <h4>
            Popular This Week
            <hr />
          </h4>
          <div class="mb-3">
            <select class="form-select form-select-sm bg-white" aria-label="Default select example"
              v-model="popularMediaSelection" @change="mediaTypeSelection('popular')">
              <option value="movie" selected>Movie</option>
              <option value="tv">TV</option>
            </select>
          </div>
        </div>
        <div class="container-full d-flex px-3 pb-2 px-xl-0 flex-row gap-2"
          style="overflow-x: auto; overflow-y: hidden;">
          <TransitionGroup name="fade">
            <MediaCard v-for="(item) in popularMediaPreview.data" :key="`${item.id}-${popularMediaSelection}`"
              :show-date="showMediaDate" :id="item.id" :title="item.title || item.name || 'untitled'"
              :poster-path="item.poster_path" :release-date="item?.release_date || item?.first_air_date"
              :media-type="popularMediaSelection" style="transition-delay: 200ms;" />
          </TransitionGroup>
        </div>
      </section>

      <!-- Streaming on netflix section -->
      <section class="container-full dark-section mt-5 bg-black py-2 overflow-hidden">
        <div class="d-flex flex-row justify-content-between align-items-center px-3 position-relative">
          <h4 class="text-white" style="position: relative; z-index: 2;">Streaming on Netflix</h4>
          <img src="/images/netflix-logo.png"
            style="position: absolute; top:10%; left:1%; width: 40px; z-index: 1;object-fit: contain;" />
          <div class=" mb-3">
            <select class="form-select form-control form-select-sm bg-white" aria-label="media selection"
              v-model="netflixMediaSelection" @change="mediaTypeSelection('netflix')">
              <option value="movie" selected>Movie</option>
              <option value="tv">TV</option>
            </select>
          </div>
        </div>
        <div class="container-full d-flex px-3 pb-2 flex-row gap-2" style="overflow-x: auto; overflow-y: hidden;">
          <TransitionGroup name="fade">
            <MediaCard :key="`${item.id}-${netflixMediaSelection}`" v-for="(item) in netflixMediaPreview.data"
              :id="item.id" :show-date="showMediaDate" :title="item.title || item.name || 'untitled'"
              :poster-path="item?.poster_path" :release-date="item?.release_date || item.first_air_date"
              bg-colour="netflix" :media-type="netflixMediaSelection" style="transition-delay: 200ms;" />
          </TransitionGroup>
        </div>
      </section>
      <!-- In theaters section -->
      <section class="mt-5">
        <div class="d-flex flex-row justify-content-between align-items-center">
          <h4>
            In theaters now
            <hr />
          </h4>
        </div>
        <div class="container-full d-flex px-3 pb-2 px-xl-0 flex-row gap-2"
          style="overflow-x: auto; overflow-y: hidden;">
          <MediaCard v-for="(item, index) in inTheatreMediaPreview.data" :key="item.id" :show-date="showMediaDate"
            :id="item.id" :title="item.title || item.name || 'untitled'" :poster-path="item.poster_path"
            :release-date="item.release_date || item.first_air_date" media-type="movie" />
        </div>
      </section>
    </div>

    <div class="col-xl mt-4 aside-container">
      <div class="d-flex flex-row">
        <h5>
          Discussions
          <hr />
        </h5>
      </div>

      <div class="overflow-auto container-full">
        <div class="tweet-container d-flex flex-xl-column">
          <div v-for="tweetID in tweets" :key="tweetID" class="tweet-card">
            <Tweet :tweet-id="tweetID" cards="visible" conversation="none" lang="en" :width="200" style="display: flex;"
              theme="light" align="right" :dnt="tweetConfig.dnt">
              <template v-slot:loading>
                <div class="d-flex align-self-center">
                  <skeletor :width="250" :height="420" class="mb-2 rounded-3 tweet-card" />
                </div>
              </template>
            </Tweet>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { discoverMedia, fetchMoviesInTheatre, fetchTrendingMedia, fetchSearchMultiResults, IMAGE_BASE_URL_500, IMAGE_BASE_URL_92 } from '@/common/api/tmdb';
import { defineComponent, ref } from 'vue';
import Tweet from "vue-tweet";
import MediaCard from '../modules/media/MediaCard.vue';
import type { MovieTypes } from '@/common/api/tmdb/types/movie'
import type { TVTypes } from '@/common/api/tmdb/types/tv'
import type { SearchDataTypes } from '@/common/api/tmdb/types/searchResult'
import { onClickOutside } from '@vueuse/core'
import type { MediaTypes } from '@/modules/media/types';
import { vOnClickOutside } from '@vueuse/components'

type MediaDataTypes = MovieTypes & TVTypes

export default defineComponent({
  data() {
    return {
      IMAGE_BASE_URL_500,
      IMAGE_BASE_URL_92,
      searchInput: "" as string,
      searchResults: [] as SearchDataTypes["results"],
      isSearchBoxOpen: false as boolean,
      tweets: [
        "1508745882975588357",
        "1508134925400223763",
        "1508546817390047234",
        "1508301410915393540",
      ],
      tweetConfig: {
        dnt: false
      },
      showMediaDate: true,
      headerImages: [] as Array<string>,
      netflixMediaSelection: "movie" as MediaTypes,
      popularMediaSelection: "movie" as MediaTypes,
      netflixMediaPreview: {
        data: [] as MediaDataTypes[],
        isLoading: true as boolean,
        isError: false as boolean
      },
      popularMediaPreview: {
        data: [] as MediaDataTypes[],
        isLoading: true as boolean,
        isError: false as boolean
      },
      inTheatreMediaPreview: {
        data: [] as MediaDataTypes[],
        isLoading: true as boolean,
        isError: false as boolean
      },
    };
  },
  directives: {
    //* used for closing search box when click outside
    OnClickOutside: vOnClickOutside
  },
  methods: {
    onSearchPress() {
      this.$router.push({ path: this.searchInput ? `/search/${this.searchInput}` : '/' })
    },
    closeSearchBox() {
      this.isSearchBoxOpen = false;
    },
    async getSearchResults() {
      if (!this.searchInput) {
        this.isSearchBoxOpen = false
        return
      };
      this.isSearchBoxOpen = true
      const results = await fetchSearchMultiResults({ query: this.searchInput, page: 1 });
      this.searchResults = results?.data;
    },
    async mediaTypeSelection(section: "popular" | "netflix") {
      try {
        if (section === "netflix") {
          const data = await discoverMedia({ mediaType: this.netflixMediaSelection, query: `with_watch_providers=8&watch_region=AU`, page: 1 })
          this.netflixMediaPreview.data = data.results;
          this.netflixMediaPreview.isLoading = false;
        }
        else if (section === "popular") {
          const data = await fetchTrendingMedia({ mediaType: this.popularMediaSelection, window: "week" });
          this.popularMediaPreview.data = data.results;
          this.popularMediaPreview.isLoading = false;
        }

      } catch (error) {
        if (section === "netflix") {
          this.netflixMediaPreview.isError = true;
          this.netflixMediaPreview.isLoading = false;
        }
        else if (section === "popular") {
          this.popularMediaPreview.isError = true;
          this.popularMediaPreview.isLoading = false;
        }
      }
    },
    async processInTheatresData() {
      try {
        //*fetch movies in theatre (region - AU) 

        const data = await fetchMoviesInTheatre();
        this.inTheatreMediaPreview.data = data.results;
        this.inTheatreMediaPreview.isLoading = false;

      } catch (error) {
        this.inTheatreMediaPreview.isError = true;
        this.inTheatreMediaPreview.isLoading = false;
      }
    },
    processHeaderImages() {
      if (!this.popularMediaPreview.data || this.popularMediaSelection === "tv") return;
      const posters = this.popularMediaPreview?.data?.map((media: any) => media.poster_path)
      this.headerImages = posters.sort(() => .5 - Math.random()).slice(0, 3);
    },
  },
  async created(): Promise<void> {
    await this.mediaTypeSelection("popular");
    this.processHeaderImages()
    await this.mediaTypeSelection("netflix");
    await this.processInTheatresData();
  },
  components: { MediaCard, Tweet }
})
</script>

<style scoped lang="scss">
@import "@bs-scss/bootstrap-grid.scss";

.bg-img {
  background-repeat: no-repeat;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  height: 650px;
}

.search-container-full {
  position: absolute;
  width: 50%;
  top: 30%;
  left: 8%;
}

.home-search-btn {
  font-weight: 700;
}

.search-title {
  font-weight: 700;
  color: #ffff;
  // font-size: 70px;
}

.search-subtitle {
  color: #ffff;
  // font-size: 20px;
  font-weight: 300;
}

.dark-section {

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #000000;
    border: 3px solid #505050;
  }

  ::-webkit-scrollbar-track {
    background: #505050;
  }
}

.aside-container {
  width: 100%;
  border-left: 1px solid #dadada;
}

.tweet-container {
  max-width: 200px;
  width: 200px;
  align-items: center;
}

.tweet-card {
  display: flex;
}

//*search input results animations
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-2px);
  opacity: 0;
}

.search-result-card {
  cursor: pointer;
}

.search-result-card:hover {
  background-color: #aee4ca;
}

//* search input list item animations
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}

.list-leave-active {
  position: absolute;
}

//* custom breakpoint for home backdrop
@include media-breakpoint-down(xl) {
  .aside-container {
    width: 100%;
    border-left: 0;
  }

  .tweet-container {
    max-width: 100%;
    width: 100%;
    align-items: flex-start;
  }

  .tweet-card {
    margin-right: 50px;
  }
}

@include media-breakpoint-down(md) {
  input {
    font-size: 14px;
  }

  .search-container-full {
    width: 90%;
  }
}
</style>