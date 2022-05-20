<template>
    <AuthContainer imageName="sign-in-cover.jpg" imageAlt="Sign in cover image - Film Tapes">
        <div class="col mt-5 mb-5">
            <div class="d-flex justify-content-between align-items-center">
                <h3 style="font-weight: 700;">Sign in</h3>
                <p class="m-0">
                    Not a member yet?
                    <router-link to="/signup" style="font-weight: 700;">Register now!</router-link>
                </p>
            </div>
            <form novalidate @submit.prevent="onSignin" class="mt-5">
                <!-- email input -->
                <div class="position-relative">
                    <div class="input-group">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" name="email" id="email" v-model="form.email" class="w-100 form-control"
                            aria-label="email input" />
                    </div>
                    <!-- input errors - email -->
                    <div class="position-absolute bottom-5" v-for="(error, index) of v$.form.email.$errors"
                        :key="index">
                        <div class="text-danger">{{ error.$message }}</div>
                    </div>
                </div>
                <!-- password input -->
                <div class="position-relative">
                    <div class="input-group mt-5">
                        <label for="password" class="form-label">Password</label>
                        <br />
                        <input type="password" name="password" id="password" v-model="form.password"
                            class="w-100 form-control" aria-label="password input" />

                    </div>
                    <!-- input errors - password -->
                    <div class="position-absolute bottom-5" v-for="(error, index) of v$.form.password.$errors"
                        :key="index">
                        <div class="text-danger">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="mt-5 col text-center">
                    <button v-if="!loadingUser" class="btn btn-secondary text-white btn-lg" style="font-weight: 600;"
                        :disabled="loadingUser" type="submit">Sign In</button>
                    <button v-else class="btn btn-secondary text-white btn-lg" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Signing In...
                    </button>
                </div>
            </form>

            <!-- <div class="my-5">
                <h5>or sign in with:</h5>
                <div class="d-flex flex-row mt-3 justify-content-center">
                    <div class="icon-button">
                        <font-awesome-icon :icon="['fab', 'google']" color="black" class="brand-icon" />
                    </div>
                    <div class="icon-button">
                        <font-awesome-icon :icon="['fab', 'twitter']" color="black" class="brand-icon" />
                    </div>
                </div>
            </div> -->
        </div>
    </AuthContainer>
</template>


<script lang="ts">
import { currentUser } from '@/firebaseConfig';
import AuthContainer from '@/modules/auth/AuthContainer.vue';
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, required } from '@vuelidate/validators';
import { defineComponent } from 'vue';
import { getAuthErrorString } from '@/modules/auth/utils/errorStrings'

export default defineComponent({
    data() {
        return {
            form: {
                email: "" as string,
                password: "" as string,
            },
            isImageLoading: true as boolean,
        }
    },
    computed: {
        errorUser() {
            return this.$store.getters.errorUser
        },
        loadingUser() {
            return this.$store.getters.loadingUser
        },
    },
    setup: () => ({ v$: useVuelidate() as any}),
    validations() {
        return {
            form: {
                email: {
                    required: helpers.withMessage('Please enter your email', required),
                    email: helpers.withMessage('Please enter a valid email', email)
                },
                password: {
                    required: helpers.withMessage('Please enter your password', required),

                },
            },
        }
    },
    methods: {
        async onSignin() {
            const isFormValid = await this.v$.$validate();
            if (!isFormValid) return;

            // dispatch user sign in with email and password. 
            await this.$store.dispatch('signInUser', { email: this.form.email, password: this.form.password });

            //* wait until user is logged in successfully.
            if (await currentUser()) {
                this.$toast.open({
                    message: 'Successfully signed in.',
                    type: 'success',
                });
                this.$router.push('/')
            }
            else {
                this.$toast.open({
                    message: getAuthErrorString(this.errorUser) as string,
                    type: 'error',
                });
            }
        },
    },
    components: { AuthContainer },

})


</script>

<style scoped>
label {
    font-weight: 600;
}

.brand-icon {
    height: 50px;
    margin-right: 50px;
}

.icon-button {
    cursor: pointer;
    transition: opacity 0.3s ease-in-out;
}

.icon-button:hover {
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
}

.cover-image {
    height: 100%;
    object-fit: cover;
    width: 100%;
}
</style>
