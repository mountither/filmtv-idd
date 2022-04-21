<template>
    <header class="sticky-top" style="position: -webkit-sticky; z-index:100;">
        <nav class="navbar navbar-expand navbar-light shadow-sm" style="background-color:rgba(255, 255, 255, 0.95);">
            <div class="container">
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav m-auto">
                        <li v-for="(route, i) in routes" :key="i" class="nav-item hover-overlay">
                            <router-link :to="route.to"
                                class="link d-flex flex-column flex-sm-row align-items-center justify-content-center"
                                :style="{ color: currentRouteName === route.key ? 'black' : '#949494' }">
                                <Icon :name="route.iconName || route.key"
                                    :colour="currentRouteName === route.key ? 'black' : '#949494'" />

                                <p class="nav-text mb-0 mx-sm-2">{{ route.label }}</p>
                            </router-link>
                        </li>
                        <!-- user tab item (sign in or profile) -->
                        <li class="nav-item hover-overlay ">
                            <div v-if="loadingUser" class="spinner-grow spinner-grow-sm text-primary" role="status">
                            </div>
                            <router-link v-else :to="user ? '/profile' : '/signin'"
                                class="link d-flex flex-column flex-sm-row align-items-center justify-content-center"
                                :style="{ color: isAuthPage ? 'black' : '#949494' }">
                                <Icon name="user" :colour="isAuthPage ? 'black' : '#949494'" />

                                <p class="nav-text mb-0 mx-sm-2">{{ user ? 'Profile' : 'Sign In' }}</p>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from './elements/Icon.vue';

type Routes = {
    key: string,
    label: string,
    to: string,
    iconName?: string
}
export default defineComponent({
    components: {
        Icon,
    },
    data() {
        return {
            routes: [
                {
                    key: "home",
                    to: "/",
                    label: "Home"
                },
                {
                    key: "tv",
                    to: "/tv",
                    label: "TV"
                },
                {
                    key: "movie",
                    to: "/movie",
                    label: "Movies"
                }
            ] as Routes[],
            isUserLoggedIn: false as boolean,
        }
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        isAuthPage(): boolean {
            return this.currentRouteName === 'profile' || this.currentRouteName === 'signin'
        },
        user() {
            return this.$store.getters.user
        },
        loadingUser() {
            return this.$store.getters.loadingUser
        }
    },
})

</script>
<style scoped lang="scss">
@import "@bs-scss/bootstrap-grid.scss";

.navbar-nav>li {
    padding-left: 5vw;
    padding-right: 5vw;
}

.link {
    text-decoration: none;
    color: white;
    opacity: 0.7;
    // transition: opacity 0.3s, visibility 0.3s;
}

.link:hover {
    opacity: 1;
    // transition: opacity 0.3s, visibility 0.3s;
}

.nav-text {
    font-weight: 500;
}
</style>