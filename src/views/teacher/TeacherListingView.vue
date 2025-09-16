<script setup>

import {onMounted, ref} from "vue";
import {DataTable} from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";
import AppButton from "@/components/app/AppButton.vue";
import {useAuthStore} from "@/stores/authStore.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useLoading} from "@/composables/useLoading.js";
import AdminService from "@/services/adminService.js";
import TeacherService from "@/services/teacherService.js";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Teachers List'}
]

const teachers = ref(null)
const {isLoading, withLoading} = useLoading()
const authStore = useAuthStore()

const loadTeachers = async () => {
  await withLoading(async () => {
    teachers.value = await TeacherService.getAllTeachers()
  })
}

const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

const onDeleteTeacher = async (id) => {

}


onMounted(async () => {
  await loadTeachers()
  new DataTablesCore("#teacherTable")
  console.log(teachers.value)
})
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
  <div class="card mt-3">
    <a>
      <router-link :to="{name:'create-teacher'}" class="btn btn-outline-primary float-end m-3">
        Create a new Teacher
      </router-link>
    </a>
    <div class="card-body">
      <h5 class="card-title">Teachers List</h5>

      <div class="table-responsive">
        <table class="table table-striped table-hover" id="teacherTable">
          <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Photo</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Specialization</th>
            <th scope="col">Country</th>
            <th scope="col">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="teacher in teachers" :key="teachers.id">
            <td>{{ teacher.id }}</td>
            <td>
              <img
                  v-if="teacher.photo"
                  :src="getFullImagePath(teacher?.photo)"
                  alt="Teacher Photo"
                  class="rounded-circle"
                  width="50"
                  height="50"
              />
            </td>

            <td>{{ teacher.name + " " + teacher.surname }}</td>
            <td>{{ teacher.email }}</td>
            <td>{{ teacher.specialization }}</td>
            <td>{{ teacher.country }}</td>
            <td>
              <router-link :to="{name:'teacher-details', params:{id:teacher.id}}" class="btn btn-info btn-sm me-1">
                <i class="bi bi-info-circle"></i>
              </router-link>

              <router-link
                  :to="{name:'edit-teacher', params:{id:teacher.id}}"
                  class="btn btn-warning btn-sm me-1">
                <i class="bi bi-pen"></i>
              </router-link>

              <app-button
                  class="btn btn-danger btn-sm"
                  @click="onDeleteTeacher(teacher.id)">
                <i class="bi bi-trash"></i>
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

</style>