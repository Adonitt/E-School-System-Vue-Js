<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Student List', to: {name: 'students'}},
  {label: 'Student Details'}
]
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
</template>

<style scoped>

</style>