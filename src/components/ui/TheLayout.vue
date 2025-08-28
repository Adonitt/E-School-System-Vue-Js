<script setup lang="ts">

import TheSideBar from "@/components/ui/TheSideBar.vue";
import TheNavbar from "@/components/ui/TheNavbar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";


</script>

<template>

  <the-side-bar/>
    <the-navbar/>
  <main id="main" class="main">
    <router-view/>
  </main>
  <the-footer/>
</template>

<style scoped>

</style>