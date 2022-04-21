<template>
    <Transition name="fade">
        <router-link v-if="renderSignUpMsg"
            class="top-alert d-flex bg-secondary text-center text-white py-3 align-items-center justify-content-center text-decoration-none"
            to="/signup">
            <Icon name="signin" colour="#ededed" />
            <p class="p-0 px-2 m-0">Sign up now to access more features!</p>
        </router-link>
    </Transition>
</template>
<script lang="ts">

import { defineComponent } from 'vue';
import { currentUser } from "@/firebaseConfig";
import Icon from "@/common/components/elements/Icon.vue";

export default defineComponent({
    data() {
        return {
            renderSignUpMsg: false as boolean
        }
    },
    components: {
        Icon,
    },
    watch: {
        currentRouteName: {
            immediate: true,
            async handler(value) {
                if ((!await currentUser()) && value != 'signin' && value != 'signup') {
                    this.renderSignUpMsg = true;
                }
                else {
                    this.renderSignUpMsg = false;
                }
            }
        }
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
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
<style lang="scss" scoped>
.top-alert {
    font-weight: 500; 
    cursor: pointer;
    transition: opacity 0.4s;
}

.top-alert:hover {
    opacity: 0.9;
    transition: opacity 0.4s;
}
</style>