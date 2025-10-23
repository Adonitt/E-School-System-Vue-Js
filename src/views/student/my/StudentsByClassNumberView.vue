<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";
import {useLoading} from "@/composables/useLoading.js";
import StudentService from "@/services/studentService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";
const route = useRoute();
const classNumber = route.params.classNumber;

const students = ref([])
const breadcrumbs=[
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Students', to: {name: 'students'}},
  {label: 'By Class Number '+ route.params.classNumber}
]

const {showError} = useAppToast();
const {withLoading} = useLoading();

const loadStudents = async () => {
  await withLoading(async () => {
    try {
      students.value = await StudentService.getStudentByClassNumber(classNumber);
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to load students.");
      console.error(err);
    }
  });
};

const authStore = useAuthStore();

onMounted(async () => {
  await loadStudents();
});
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
  <div class="card mt-4 shadow-sm">
    <div class="card-header bg-light">
      <h5>Students in Class {{ classNumber }}</h5>
    </div>
    <div class="card-body p-0">
      <table class="table table-striped mb-0">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Surname</th>
          <th>Email</th>
          <th
              v-if="authStore.loggedInUser?.role === ROLES.ADMIN || authStore.loggedInUser?.role === ROLES.TEACHER "
          >Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="students.length === 0">
          <td colspan="5" class="text-center text-muted py-3">No students found.</td>
        </tr>
        <tr v-for="(student, index) in students" :key="student.id">
          <td>{{ index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.surname }}</td>
          <td>{{ student.email }}</td>
          <td>
            <router-link
                :to="{ name: 'student-details', params: { id: student.id } }"
                class="btn btn-sm btn-primary"
                v-if="authStore.loggedInUser?.role === ROLES.ADMIN || authStore.loggedInUser?.role === ROLES.TEACHER "
            >
              View
            </router-link>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
}
</style>
