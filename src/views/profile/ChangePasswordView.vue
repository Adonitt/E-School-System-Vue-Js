<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {ref} from "vue";
import {useAppToast} from "@/composables/useAppToast.js";
import {useLoading} from "@/composables/useLoading.js";
import AdminService from "@/services/adminService.js";
import router from "@/router/index.js";

const breadCrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'My Profile', to: {name: 'my-profile'}},
  {label: 'Change Password'},
]

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const {showSuccess, showWarning, showError} = useAppToast()
const {withLoading} = useLoading()

const handleSubmit = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    showWarning('Please fill all fields');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    showWarning('New password and confirm password do not match');
    return;
  }

  await withLoading(async () => {
    try {

      await AdminService.changePassword({
            oldPassword: currentPassword.value,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value,
          }
      )
      showSuccess('Password changed successfully')
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      await router.push({name: 'my-profile'})
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.')
    }
  })
}


</script>

<template>
  <bread-crumb :items="breadCrumbs"/>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body p-4">
            <h4 class="mb-4 text-center fw-bold text-primary">Change Password</h4>

            <form @submit.prevent="handleSubmit">
              <input type="hidden" name="adminId"/>

              <div class="form-group mb-3">
                <label for="current-password" class="form-label">Current Password</label>
                <input
                    type="password"
                    class="form-control form-control-lg"
                    id="current-password"
                    name="currentPassword"
                    v-model.trim="currentPassword"
                    placeholder="Enter current password"
                    required
                />
              </div>

              <div class="form-group mb-3">
                <label for="new-password" class="form-label">New Password</label>
                <input
                    type="password"
                    v-model.trim="newPassword"
                    class="form-control form-control-lg"
                    id="new-password"
                    name="newPassword"
                    placeholder="Enter new password"
                    required
                />
              </div>

              <div class="form-group mb-4">
                <label for="confirm-password" class="form-label">Confirm New Password</label>
                <input
                    type="password"
                    class="form-control form-control-lg"
                    id="confirm-password"
                    v-model.trim="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    required
                />
              </div>

              <button type="submit" class="btn btn-primary w-100 btn-lg">
                <i class="bi bi-lock me-2"></i> Change Password
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>