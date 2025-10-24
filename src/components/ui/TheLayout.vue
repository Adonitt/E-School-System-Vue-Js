<script setup>
import { ref } from "vue";
import TheSideBar from "@/components/ui/TheSideBar.vue";
import TheNavbar from "@/components/ui/TheNavbar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>

<template>
  <the-side-bar :is-open="sidebarOpen" @close="sidebarOpen = false" />
  <the-navbar @toggle-sidebar="toggleSidebar" />
  <main id="main" class="main">
    <router-view />
  </main>
  <the-footer />
</template>
