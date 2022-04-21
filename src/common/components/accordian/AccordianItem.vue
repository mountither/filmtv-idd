<template>
    <div class="accordion-item border-0" style="background-color: inherit;">
        <div class="accordion-header">
            <button :class="`accordion-button btn-header p-0 shadow-none ${isExpanded ? '' : 'collapsed'}`" type="button"
                data-bs-toggle="collapse" :data-bs-target="`#${id}`" :aria-expanded="isExpanded" :aria-controls="id">
                <h5>{{ title }}</h5>
            </button>
        </div>
        <div :id="id" :class="`p-0 accordion-collapse collapse ${isExpanded ? 'show' : ''}`" :aria-labelledby="id"
            style="transition: 0.3s;">
            <div class="accordion-body p-0 pt-4 px-1">
                <slot></slot>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
    props: {
        title: String,
        id: String,
        isExpanded: {
            default: true,
            type: Boolean
        }
    },

});
</script>

<style lang="scss" scoped>
.btn-header {
    background-color: inherit;
    transition: opacity 0.3s;

}
.btn-header:hover{
    opacity: 0.7;
    transition: opacity 0.3s;
}
</style>