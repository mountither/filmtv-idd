<template >
    <vue-final-modal  classes="modal-container" content-class="modal-content">
            <p>{{fullText}}</p>
        </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';


export default defineComponent({
    props: {
        fullText: String,
    },
})

</script>
<style lang="scss" scoped>
@import "@/assets/sass/modal.scss";

:deep(.modal-content) {
    max-height: 65vh;
    word-wrap: break-word;
    padding-top: 15px !important;

}
</style>