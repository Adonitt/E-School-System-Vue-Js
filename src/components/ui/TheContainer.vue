<script setup>
import { useAuthStore } from "@/stores/authStore.js";

const authStore = useAuthStore();
const userName = authStore.loggedInUser?.fullName || "Student";
</script>

<template>
  <section class="welcome-page vh-100 d-flex align-items-center justify-content-center">
    <div class="text-center animate-fade-in">
      <h1 class="display-1 fw-bold mb-3 text-white">Welcome, {{ userName }}!</h1>
      <p class="lead text-white-75">Get ready to explore your school dashboard and discover amazing features!</p>
    </div>
  </section>
</template>

<style scoped>
.welcome-page {
  background: linear-gradient(135deg, #9fa6bd 0%, #f3f0f0 100%);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-white-75 {
  color: rgba(255, 255, 255, 0.85);
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1.5s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
