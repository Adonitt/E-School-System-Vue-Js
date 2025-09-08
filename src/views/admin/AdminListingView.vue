<script setup>

import {onMounted, ref} from "vue";
import AdminService from "@/services/adminService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useAuthStore} from "@/stores/authStore.js";
import {useLoading} from "@/composables/useLoading.js";
import {DataTable} from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";

DataTable.use(DataTablesCore);
DataTable.use(DataTablesBS5);

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Admin List'}
]
const authStore = useAuthStore()

const admins = ref([])
const {withLoading, isLoading} = useLoading()

const loadAdmins = async () => {
  await withLoading(async () => {
    admins.value = await AdminService.getAllAdmins()
  })
}

onMounted(async () => {
  await loadAdmins()
  new DataTablesCore("#adminTable")
})


</script>

<template>
  <bread-crumb :items="breadcrumbs"/>


  <div class="card mt-3">
      <a>
        <button type="button" class="btn btn-outline-primary float-end m-3">
          Create a new Administrator
        </button>
      </a>
    <div class="card-body">
      <h5 class="card-title">Administrators List</h5>

      <!-- Responsive wrapper -->
      <div class="table-responsive">
        <table class="table table-striped table-hover" id="adminTable">
          <thead class="table-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Photo</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Department</th>
            <th scope="col">Country</th>
            <th scope="col">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="admin in admins" :key="admin.id">
            <td>{{ admin.id }}</td>
            <td>
              <img :src="admin.photo" alt="Photo" class="img-thumbnail" style="width: 50px; height: 50px;">
            </td>
            <td>{{ admin.name + " " + admin.surname }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.department }}</td>
            <td>{{ admin.country }}</td>
            <td>
              <router-link :to="{name:'admin-details', params:{id:admin.id}}" class="btn btn-info btn-sm me-1">
                <i class="bi bi-info-circle"></i>
              </router-link>

              <router-link :to="{name:'edit-admin', params:{id:admin.id}}" class="btn btn-warning btn-sm me-1">
                <i class="bi bi-pen"></i>
              </router-link>

              <button type="button" class="btn btn-danger btn-sm">
                <i class="bi bi-trash"></i>
              </button>
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