<template>
    <div class="drawer" :class="{ 'is-open': isOpen, 'is-visible': isVisible }">
        <div class="drawer__overlay" :style="{ transitionDuration: `${speed}ms` }"></div>
        <div v-on-click-outside="closeDrawer" class="drawer__content" :style="{
            maxWidth: maxWidth,
            transitionDuration: `${speed}ms`,
            backgroundColor: backgroundColor,
        }">
            <!-- Drawer Header -sticky -->
            <div
                class="d-flex flex-row justify-content-between align-items-center sticky-top bg-white border-bottom px-3 pt-3">
                <h5>{{ title }}</h5>
                <div class="close-btn" @click="closeDrawer">
                    <font-awesome-icon icon="close" style="height: 20px;" />
                </div>

            </div>

            <div class="py-3 px-2" >
                <slot></slot>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

export default defineComponent({
    directives: {
        OnClickOutside: vOnClickOutside
    },
    props: {
        isOpen: {
            type: Boolean,
            required: false,
            default: false,
        },
        title: {
            type: String || undefined,
            required: false,
            default: undefined,
        },
        maxWidth: {
            type: String,
            required: false,
            default: "400px",
        },
        // Transition Speed in Milliseconds
        speed: {
            type: Number,
            required: false,
            default: 300,
        },
        backgroundColor: {
            type: String,
            required: false,
            default: "#ffff",
        },
    },
    data() {
        return {
            isTransitioning: false as Boolean,
            isVisible: false as Boolean
        };
    },
    watch: {
        isOpen(val) {
            this.isTransitioning = true;

            if (val) {
                this.toggleBackgroundScrolling(true);
                this.isVisible = true;
            } else {
                this.toggleBackgroundScrolling(false);
                setTimeout(() => (this.isVisible = false), this.speed);
            }

            setTimeout(() => (this.isTransitioning = false), this.speed);
        },
    },
    methods: {
        toggleBackgroundScrolling(enable: Boolean): void {
            const body = document.querySelector("body");
            if (!body) return;
            body.style.overflow = enable ? "hidden" : "";
        },
        closeDrawer(): void {
            if (!this.isTransitioning) {
                this.$emit("close");
            }
        },
    },

    mounted() {
        this.isVisible = this.isOpen;
    },
});

</script>

<style lang="scss" scoped>
.drawer {
    visibility: hidden;


    &.is-visible {
        visibility: visible;
    }

    &.is-open {
        .drawer__overlay {
            opacity: 0.5;
        }

        .drawer__content {
            transform: translateX(0);
        }
    }

    &__overlay {
        position: fixed;
        top: 0;
        right:0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        opacity: 0;
        transition-property: opacity;
        background-color: #000000;
        user-select: none;
    }

    &__content {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 100%;
        width: 70%;
        z-index: 9999;
        overflow: overlay;
        transition-property: transform;
        display: flex;
        flex-direction: column;
        transform: translateX(-100%);
        box-shadow: 0 2px 6px #777;
    }
}

.close-btn {
    cursor: pointer;
}

.close-btn:hover {
    opacity: 0.7;
}
</style>