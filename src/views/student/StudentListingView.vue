<script setup>

import {onMounted} from "vue";
import StudentService from "@/services/studentService.js";

onMounted(async () => {
  console.log(await StudentService.getStudentById(4))
})
</script>

<template>
  <h1>Students</h1>
</template>

<style scoped>

</style>