<script setup>

import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading";
import {useAppToast} from "@/composables/useAppToast";
import adminService from "@/services/adminService";
import {useRoute, useRouter} from "vue-router";
import UserUpdateForm from "@/components/shared/UserUpdateForm.vue";

const breadcrumbs = [
  {label: "Dashboard", to: {name: "home"}},
  {label: "Admin List", to: {name: "admins"}},
  {label: "Create Admin"}
];

const adminExtra = ref({
  photo: null,
  previewImage: null,
  role: "ADMINISTRATOR",
  adminNumber: "",
  department: "",
  active: false,
  acceptTermsAndConditions: false
});

const departments = [
  {label: "Finance", value: "FINANCE"},
  {label: "IT", value: "IT"},
  {label: "HR", value: "HUMAN_RESOURCES"},
  {label: "Administration", value: "ADMINISTRATION"},
  {label: "Academic", value: "ACADEMIC"},
  {label: "Student Affairs", value: "STUDENT_AFFAIRS"}
];

const admin = ref(null)
const route = useRoute()


const loadAdminById = async (id) =>
    await withLoading(async () => {
      admin.value = await adminService.getAdminById(id);

      if (admin.value) {
        userFormRef.value.user.personalNumber = admin.value.personalNumber;
        userFormRef.value.user.name = admin.value.name;
        userFormRef.value.user.surname = admin.value.surname;
        userFormRef.value.user.gender = admin.value.gender;
        userFormRef.value.user.birthDate = admin.value.birthDate;
        userFormRef.value.user.address = admin.value.address;
        userFormRef.value.user.city = admin.value.city;
        userFormRef.value.user.country = admin.value.country;
        userFormRef.value.user.postalCode = admin.value.postalCode;
        userFormRef.value.user.phoneNumber = admin.value.phoneNumber;
        userFormRef.value.user.email = admin.value.email;
        userFormRef.value.user.notes = admin.value.notes;

        adminExtra.value.adminNumber = admin.value.adminNumber;
        adminExtra.value.department = admin.value.department;
        adminExtra.value.active = admin.value.active;
        adminExtra.value.acceptTermsAndConditions = admin.value.acceptTermsAndConditions;
        adminExtra.value.photo = admin.value.photo;
        adminExtra.value.previewImage = admin.value.photo;
      }
    });

const adminId = +route.params.id;

const userFormRef = ref(null);
const toast = useAppToast()
const router = useRouter()
const {withLoading} = useLoading();

const onHandleSubmit = async () => {

  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(adminExtra.value)], {type: "application/json"}));
  formData.append("photo", adminExtra.value.photo);

  await withLoading(async () => {
    try {
      await adminService.modifyAdmin(adminId.value, formData);
      toast.showSuccess("Admin updated successfully.");
      await router.push({name: "admins"});
    } catch (err) {
      toast.showError(err.response?.data?.message || "Error updating admin!");
      console.log(err);
    }
  });
};


const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    adminExtra.value.photo = file;
    adminExtra.value.previewImage = file ? URL.createObjectURL(file) : null;
  }
}

onMounted(async () => {
  await loadAdminById(adminId)
  console.log(adminId)
})

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <h3 class="mb-3">Update Admin with id: {{ adminId }}</h3>

  <form @submit.prevent="onHandleSubmit" class="row g-4 p-3">

    <UserUpdateForm ref="userFormRef">
      <template #image>
        <div class="col-md-4 d-flex flex-column align-items-center text-center border-end">
          <p class="fw-semibold mb-2 mt-2">User Photo</p>

          <div class="mb-3">
            <img
                v-if="adminExtra.previewImage"
                :src="getFullImagePath(adminExtra.previewImage)"
                class="rounded-circle border"
                width="150"
                height="150"
                alt="Preview"
            />
            <div v-else class="rounded-circle border bg-light d-flex align-items-center justify-content-center"
                 style="width:150px; height:150px;">
              <span class="text-muted">Preview</span>
            </div>
          </div>

          <input
              type="file"
              class="form-control"
              accept="image/*"
              @change="onFileChange"
          />
        </div>

      </template>

      <AppInput
          id="adminNumber"
          v-model="adminExtra.adminNumber"
          label="Admin Number"
          type="number"
          required
      />

      <AppSelect
          id="department"
          v-model="adminExtra.department"
          label="Department"
          :options="departments"
          required
      />

      <br>
      <div class="col-md-4 d-flex align-items-center">
        <label class="me-2">Active</label>
        <input type="checkbox" v-model="adminExtra.active"/>
      </div>

      <div class="col-12 mt-3">
        <button type="submit" class="btn btn-primary">Update Admin</button>
      </div>

    </UserUpdateForm>
  </form>
</template>

<style scoped>

</style>