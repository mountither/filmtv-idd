<template>
    <vue-final-modal :name="name" classes="modal-container" @click-outside="closeHandler" content-class="modal-content">


        <!-- Header -->
        <div class="row justify-content-between align-items-center sticky-top bg-white py-2 px-2 pb-0 border-bottom">
            <h3 class="col">{{ title }}</h3>
            <div @click="closeHandler" class="col-1 mx-2" style="cursor: pointer;">
                <font-awesome-icon icon="close" style="height: 25px;" />
            </div>
        </div>

        <slot></slot>

    </vue-final-modal>

</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        closeHandler: {
            type: Function as PropType<(payload: MouseEvent) => void>,
            required: true,
        }
    }
});

</script>