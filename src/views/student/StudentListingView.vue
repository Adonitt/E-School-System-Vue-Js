<script setup>

import {nextTick, onMounted, ref} from "vue";
import StudentService from "@/services/studentService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useLoading} from "@/composables/useLoading.js";
import AppButton from "@/components/app/AppButton.vue";
import {DataTable} from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";
import {useAppToast} from "@/composables/useAppToast.js";
import {ROLES} from "@/composables/useAdministration.js";
import {useAuthStore} from "@/stores/authStore.js";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Students List'},
]

const students = ref([])
const allStudents = ref([]);

const {withLoading} = useLoading()

const loadStudents = async () => {
  await withLoading(async () => {
    students.value = await StudentService.getAllStudents()
    allStudents.value = await StudentService.getAllStudents()
  })
}

const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

const {showSuccess, showError, showDialog} = useAppToast()

const onActivateStudent = async (id) => {
  const result = await showDialog("Are you sure you want to activate this student?");

  if (result.isConfirmed) {
    await withLoading(async () => {
      try {
        await StudentService.activateStudent(id);
        showSuccess("Student with id: " + id + " activated successfully.")
        await loadStudents()
      } catch (err) {
        showError(err.response?.data?.message || 'An unexpected error occurred.')
      }
    })
  }
}

const onDeactivateStudent = async (id) => {
  const result = await showDialog("Are you sure you want to deactivate this student?");
  if (result.isConfirmed) {
    await withLoading(async () => {
      try {
        await StudentService.deactivateStudent(id);
        showSuccess("Student with id: " + id + " deactivated successfully.");
        await loadStudents();
      } catch (err) {
        showError(err.response?.data?.message || 'An unexpected error occurred.');
      }
    });
  }
};


onMounted(async () => {
  await nextTick();
  await loadStudents()
  new DataTablesCore("#studentTable")
})
const authStore = useAuthStore()
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="card mt-3">
    <a>
      <router-link :to="{name:'create-student'}" class="btn btn-outline-primary float-end m-3"
                   v-if="authStore.loggedInUser?.role === ROLES.ADMIN"
      >
        Create a new Student
      </router-link>
    </a>


    <div class="card-body">
      <h5 class="card-title">Students List</h5>
      <div class="table-responsive">
        <table class="table table-striped table-hover" id="studentTable">
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Photo</th>
            <th scope="col">Personal Nr</th>
            <th scope="col">Name</th>
            <th scope="col">Gender</th>
            <th scope="col">Country</th>
            <th scope="col">Class Number</th>
            <th scope="col">Status</th>
            <th scope="col"
            >Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="student in students" :key="student.id">

            <td>{{ student.id }}</td>
            <td class="text-center align-middle">
              <img
                  v-if="student.photo"
                  :src="getFullImagePath(student.photo)"
                  alt="Student Photo"
                  class="rounded-circle "
                  width="50"
                  height="50"
              />
            </td>
            <td>{{ student.personalNumber }}</td>
            <td>{{ student.name + " " + student.surname }}</td>
            <td>{{ student.gender }}</td>
            <td>{{ student.country }}</td>
            <td>{{ student.classNumber }}</td>
            <td><span class="badge" :class="student.active ? 'bg-success' : 'bg-danger'">
              {{ student.active ? 'Yes' : 'No' }}
            </span></td>
            <td>
              <router-link :to="{name:'student-details', params:{id:student?.id}}" class="btn btn-info btn-sm me-1"
                           v-if="authStore.loggedInUser?.role === ROLES.ADMIN || authStore.loggedInUser?.role === ROLES.TEACHER"
              >
                <i class="bi bi-info-circle"></i>
              </router-link>

              <router-link
                  :to="{name:'edit-student', params:{id:student.id}}"
                  v-if="authStore.loggedInUser?.role === ROLES.ADMIN"
                  class="btn btn-warning btn-sm me-1">
                <i class="bi bi-pen"></i>
              </router-link>

              <app-button
                  :class="student.active ? 'btn btn-danger btn-sm' : 'btn btn-success btn-sm'"
                  v-if="authStore.loggedInUser?.role === ROLES.ADMIN"
                  @click="student.active ? onDeactivateStudent(student.id) : onActivateStudent(student.id)"
              >
                <i :class="student.active ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
              </app-button>


            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>


</template>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

</style>