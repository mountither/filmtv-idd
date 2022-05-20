<template>
    <AuthContainer imageName="sign-up-cover.jpg" imageAlt="Sign up cover image - tv on table">
        <div class="col mt-5 mb-5">
            <div class="d-flex justify-content-between align-items-center">
                <h3 style="font-weight: 700;">Register an account</h3>
            </div>
            <form novalidate @submit.prevent="onSignup">
                <!-- email input -->
                <div class="mt-5 position-relative">
                    <div class="input-group">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" name="email" required id="email" v-model="form.email"
                            class="w-100 form-control" aria-label="email input" />
                    </div>
                    <!-- input errors - email -->
                    <div class="position-absolute bottom-5" v-for="(error, index) of v$.form.email.$errors"
                        :key="index">
                        <div class="text-danger">{{ error.$message }}</div>
                    </div>
                </div>
                <!-- Name input -->
                <div class="mt-5 position-relative">
                    <label for="name" class="form-label">Name</label>
                    <div class="input-group">
                        <input type="name" name="name" required id="name" v-model="form.name" class="w-100 form-control"
                            aria-label="name input" />
                    </div>
                    <!-- input errors - name -->
                    <div class="position-absolute bottom-5" v-for="(error, index) of v$.form.name.$errors" :key="index">
                        <div class="text-danger">{{ error.$message }}</div>
                    </div>
                </div>

                <!-- Password input -->
                <div class="mt-5 position-relative">
                    <div class="input-group mt-3">
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

                <!-- Confirm confirm password input -->
                <div class="mt-5 position-relative">
                    <div class="input-group mt-3">
                        <label for="cpassword" class="form-label">Confirm Password</label>
                        <br />
                        <input type="password" name="cpassword" id="cpassword" v-model="form.cpassword"
                            class="w-100 form-control" aria-label="confirm password input" />
                    </div>
                    <!-- input errors - confirm password -->
                    <div v-for="(error, index) of v$.form.cpassword.$errors" :key="index">
                        <div class="text-danger">{{ error.$message }}</div>
                    </div>
                </div>

                <div class="mt-5 col text-center">
                    <button v-if="!loadingUser" class="btn btn-primary text-white btn-lg" style="font-weight: 600;"
                        :disabled="loadingUser" type="submit">Sign Up</button>
                    <button v-else class="btn btn-primary text-white btn-lg" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Signing Up...
                    </button>
                </div>
            </form>

            <!-- <div class="my-5">
                <h5>or register with:</h5>
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
import { defineComponent, type PropType } from 'vue';
//@ts-ignore
import AuthContainer from '@/modules/auth/AuthContainer.vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required, helpers, maxLength, email, sameAs } from '@vuelidate/validators'
import { currentUser } from '../firebaseConfig';
//@ts-ignore
import { getAuthErrorString } from '@/modules/auth/utils/errorStrings'

export default defineComponent({
    data() {
        return {
            form: {
                email: "",
                name: "",
                password: "",
                cpassword: "",
            }

        }
    },
    components: { AuthContainer },
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
                cpassword: {
                    required: helpers.withMessage('Please confirm your password', required),
                    sameAsPassword: helpers.withMessage('Passwords must match', sameAs(this.form.password)),
                },
                name: {
                    required: helpers.withMessage('Please enter your name', required),
                    minLength: helpers.withMessage('Name must at least 1 character long', minLength(2)),
                    maxLength: helpers.withMessage('Name field has exceeded the 100 character limit', maxLength(100)),
                }

            },
        }
    },
    computed: {
        comparePasswords() {
            return this.password !== this.cpassword ? 'Passwords do not match' : ''
        },
        user() {
            return this.$store.getters.user
        },
        errorUser() {
            return this.$store.getters.errorUser
        },
        loadingUser() {
            return this.$store.getters.loadingUser
        }
    },
    methods: {
        async onSignup() {
            const isFormValid = await this.v$.$validate();
            if (!isFormValid) return;

            // * generate a random image for user.
            const userProfileImage = `https://avatars.dicebear.com/api/identicon/${Math.random() * 501}.svg`

            //* dispatch user registration with relevant info.
            await this.$store.dispatch('registerUser', { email: this.form.email, password: this.form.password, displayName: this.form.name, photoUrl: userProfileImage });

            //* check if user logged in after registration. 
            if (await currentUser()) {
                this.$toast.open({
                    message: 'Successful account registration.',
                    type: 'success'
                });
                this.$router.push('/');
            }
            else {
                this.$toast.open({
                    message: getAuthErrorString(this.errorUser) as string,
                    type: 'error',
                });
            }

        },
    }
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
</style>
