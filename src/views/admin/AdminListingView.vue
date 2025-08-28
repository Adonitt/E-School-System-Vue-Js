<script setup>

import {onMounted} from "vue";
import AdminService from "@/services/adminService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useAuthStore} from "@/stores/authStore.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Admin List'}
]
const authStore = useAuthStore()

const admins = AdminService

onMounted(async () => {
  // await admins.getAdminById(authStore.loggedInUser.id)
})
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
</template>

<style scoped>

</style>