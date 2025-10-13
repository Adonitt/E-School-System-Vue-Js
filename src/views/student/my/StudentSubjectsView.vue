<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import StudentService from "@/services/studentService.js";
import {useAuthStore} from "@/stores/authStore.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Students', to: {name: 'students'}},
  {label: 'Student Details', to: {name: 'student-details'}},
  {label: 'My Subjects'}
]

const student = ref(null)
const route = useRoute()
const studentId = +route.params.id

const authStore = useAuthStore()

const loadStudentById = async (id) => {
  student.value = await StudentService.getStudentById(id)
}

onMounted(async () => {
  await loadStudentById(studentId)
})


</script>
<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="container mt-4 text-center">
    <h4 class="mb-4 text-primary">
      {{ student?.name + " " + student?.surname}}'s Subjects!
    </h4>
    <div class="row justify-content-center">
      <div
          v-if="student?.subjectNames?.length"
          v-for="(subject, index) in student.subjectNames"
          :key="index"
          class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
      >
        <div class="card h-100 shadow-sm text-center">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title text-primary">{{ subject }}</h5>
            <router-link
                :to="{name:'subject-details', params:{id:student.subjectIds[index]}}"
                class="btn btn-outline-primary btn-sm mt-auto"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
      <div v-else class="col-12 text-center text-muted">
        No subjects enrolled.
      </div>
    </div>
  </div>
</template>


<style scoped>
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.subject-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.subject-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #0d6efd;
}

.subject-info {
  font-size: 0.85rem;
  color: #6c757d;
}

.no-subjects {
  grid-column: 1/-1;
  text-align: center;
  color: #6c757d;
  font-size: 1rem;
}
</style>
