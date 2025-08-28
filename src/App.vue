<script setup>
import TheSideBar from "@/components/ui/TheSideBar.vue";
import TheLayout from "@/components/ui/TheLayout.vue";
import {useAuthStore} from "@/stores/authStore.js";
import AuthView from "@/views/auth/AuthView.vue";
import ErrorBoundary from "@/components/shared/ErrorBoundary.vue";

const authStore = useAuthStore();
</script>

<template>

  <error-boundary>
    <auth-view v-if="!authStore.isLoggedIn"/>
    <the-layout v-else/>
  </error-boundary>
</template>

<style scoped>
</style>
