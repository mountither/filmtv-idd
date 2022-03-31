<template>
    <a
        v-if="currentRouteName != 'account'"
        class="top-alert d-flex bg-secondary text-center text-white py-3 align-items-center justify-content-center text-decoration-none"
        href="/account"
    >
        <Icon name="signin" colour="#ededed" />
        <p class="p-0 px-2 m-0">Sign up now to access more features!</p>
    </a>
    <NavBar />
    <div class="container-xl">
        <div class="col">
            <main>
                <div class="container-xl mx-auto px-2 py-8">
                    <slot />
                </div>
            </main>
            <Footer />
        </div>
    </div>
</template>

<script lang="ts">
import NavBar from "../components/NavBar.vue";
import Footer from "../components/Footer.vue";
import { defineComponent } from 'vue';
import Icon from "../components/elements/Icon.vue";

export default defineComponent({
    components: {
        Icon,
        Footer,
        NavBar
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
    },
})

</script>

<style lang="scss">

.top-alert {
    font-weight: 400;
    cursor: pointer;
    transition: opacity 0.3s;
}
.top-alert:hover {
    opacity: 0.9;
    transition: opacity 0.3s;
}
</style>


