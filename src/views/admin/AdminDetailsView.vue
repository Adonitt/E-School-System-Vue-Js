<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import AdminService from "@/services/adminService.js";
import {useRoute, useRouter} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";
import UserShowDetails from "@/components/user-form/UserShowDetails.vue";
import AppButton from "@/components/app/AppButton.vue";
import {ROLES} from "@/composables/useAdministration.js";
import {useAuthStore} from "@/stores/authStore.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Admin List', to: {name: 'admins'}},
  {label: 'Admin Details'}
]
const {withLoading} = useLoading()
const route = useRoute()
const router = useRouter()
const admin = ref()

const loadAdmin = async (id) => {
  await withLoading(async () => {
    admin.value = await AdminService.getAdminById(id)
  })
}

const toast = useAppToast()
const onDeleteAdmin = async (id) => {
  const result = await toast.showDialog("Are you sure you want to delete this admin?")
  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = AdminService.removeAdmin(id)
        toast.showSuccess("Admin with id: " + id + " deleted successfully")
        await router.push({name: 'admins'})
      })
    } catch (err) {
      throw err;
    }
  }
}


const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}
const authStore = useAuthStore()

onMounted(() => {
  loadAdmin(route.params.id)
})
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
  <div v-if="admin">
    <user-show-details :user="admin">
      <template #buttons>
        <router-link class="btn btn-secondary  " v-if="authStore.loggedInUser?.role === ROLES.ADMIN"
                     :to="{name:'edit-admin', params:{id:route.params.id}}"
        >Update Admin
        </router-link>

      </template>

      <template #other-details>
        <div class="row">
          <div class="col-lg-3 col-md-4 label">Admin Number</div>
          <div class="col-lg-9 col-md-8">{{ admin.adminNumber }}</div>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-4 label">Department</div>
          <div class="col-lg-9 col-md-8">{{ admin.department }}</div>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-4 label">Is Active</div>
          <div class="col-lg-9 col-md-8">
            <span class="badge" :class="admin.active ? 'bg-success' : 'bg-danger'">
              {{ admin.active ? 'Yes' : 'No' }}
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-4 label">Accept Terms</div>
          <div class="col-lg-9 col-md-8">
            <span class="badge" :class="admin.acceptTermsAndConditions ? 'bg-success' : 'bg-danger'">
              {{ admin.acceptTermsAndConditions ? 'Yes' : 'No' }}
            </span>
          </div>
        </div>
      </template>
    </user-show-details>
  </div>
</template>


<style scoped>

</style>