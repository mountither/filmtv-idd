<template>
  <div class="container py-3 border-top" style="height: 400px;">
    <p class="mb-2 mb-lg-0">© Copyright {{ currentYear }}</p>

    <div class="d-flex gap-3 align-items-center flex-md-row flex-column">
      <a href="#" class="mr-6 hover:text-gray-900">Terms of Service</a>
      <a href="#" class="mr-6 hover:text-gray-900">Privacy Policy</a>
      <a href="#" class="hover:text-gray-900">About Us</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const currentYear = ref<number>(new Date().getFullYear())
</script>
