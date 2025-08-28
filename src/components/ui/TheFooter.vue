<script setup>
import {useAuthStore} from "@/stores/authStore.js";

const authStore = useAuthStore()

</script>

<template>
  <footer id="footer" class="footer">
    <div class="copyright">
      {{ authStore.loggedInUser.fullName + " - " + authStore.loggedInUser.role }}<br>
      © Copyright <strong><span>E-School System</span></strong>. <br>All Rights Reserved
    </div>
  </footer>
</template>

<style scoped>

</style>