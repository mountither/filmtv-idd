<template>
    <UserRegisterAlert />
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
import UserRegisterAlert from "../components/alerts/UserRegisterAlert.vue";


export default defineComponent({
    data() {
        return {
            renderSignUpMsg: false as boolean
        }
    },
    components: {
        Footer,
        NavBar,
        UserRegisterAlert
    }
})

</script>


