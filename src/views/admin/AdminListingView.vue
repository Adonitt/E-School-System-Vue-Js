<script setup>

import {onMounted, ref} from "vue";
import AdminService from "@/services/adminService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useAuthStore} from "@/stores/authStore.js";
import {useLoading} from "@/composables/useLoading.js";
import {DataTable} from "datatables.net-vue3";
import DataTablesCore from "datatables.net";
import DataTablesBS5 from "datatables.net-bs5";
import AppButton from "@/components/app/AppButton.vue";
import {useAppToast} from "@/composables/useAppToast.js";

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

const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

const {showSuccess, showDialog, showError} = useAppToast()

const onDeleteAdmin = async (id) => {
  const result = await showDialog('Are you sure you want to delete this admin?')

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = await AdminService.removeAdmin(id);
        showSuccess("Admin with id: " + id + " deleted successfully.")
        await loadAdmins()
      })
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.')
    }
  }
}


onMounted(async () => {
  await loadAdmins()
  new DataTablesCore("#adminTable")
  console.log("img url " + import.meta.env.VITE_IMG_URL)
})

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="card mt-3">
    <a>
      <router-link :to="{name:'create-admin'}" class="btn btn-outline-primary float-end m-3">
        Create a new Administrator
      </router-link>
    </a>
    <div class="card-body">
      <h5 class="card-title">Administrators List</h5>

      <div class="table-responsive">
        <table class="table table-striped table-hover" id="adminTable">
          <thead>
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
            <td class="text-center align-middle">
              <img
                  v-if="admin.photo"
                  :src="getFullImagePath(admin.photo)"
                  alt="Admin Photo"
                  class="rounded-circle"
                  width="50"
                  height="50"
              />
            </td>

            <td>{{ admin.name + " " + admin.surname }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.department }}</td>
            <td>{{ admin.country }}</td>
            <td>
              <router-link :to="{name:'admin-details', params:{id:admin.id}}" class="btn btn-info btn-sm me-1">
                <i class="bi bi-info-circle"></i>
              </router-link>

              <router-link
                  :to="{name:'edit-admin', params:{id:admin.id}}"
                  class="btn btn-warning btn-sm me-1">
                <i class="bi bi-pen"></i>
              </router-link>

              <app-button
                  v-if="authStore.loggedInUser.id !== admin.id"
                  class="btn btn-danger btn-sm"
                  @click="onDeleteAdmin(admin.id)">
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