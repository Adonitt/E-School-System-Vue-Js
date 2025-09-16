<script setup>
import {ref} from "vue";
import UserCreateForm from "@/components/shared/UserCreateForm.vue";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import AdminService from "@/services/adminService.js";
import {useLoading} from "@/composables/useLoading.js";
import {useAppToast} from "@/composables/useAppToast.js";
import router from "@/router/index.js";
import adminService from "@/services/adminService.js";

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

const userFormRef = ref(null);

const {withLoading} = useLoading();
const {showSuccess, showError} = useAppToast();

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    adminExtra.value.photo = file;
    adminExtra.value.previewImage = file ? URL.createObjectURL(file) : null;
  }
}

const onHandleSubmit = async () => {
  if (!userFormRef.value) return;
  const userData = userFormRef.value.user;

  const {photo, previewImage, ...rest} = adminExtra.value;
  const finalData = {...userData, ...rest};

  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(finalData)], {type: "application/json"}));

  if (photo) {
    formData.append("photo", photo);
  }

  await withLoading(async () => {
    try {
      await AdminService.createAdmin(formData);
      showSuccess("Admin created successfully.");
      await router.push({name: "admins"});
    } catch (err) {
      showError(err.response?.data?.message || "Error creating admin!");
      console.error(err);
    }
  });
};


</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <h3 class="mb-3">Create Admin</h3>

  <form @submit.prevent="onHandleSubmit" class="row g-4 p-3">

    <UserCreateForm ref="userFormRef">
      <template #image>
        <div class="col-md-4 d-flex flex-column align-items-center text-center border-end">
          <p class="fw-semibold mb-2 mt-2">User Photo</p>

          <div class="mb-3">
            <img
                v-if="adminExtra.previewImage"
                :src="adminExtra.previewImage"
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

      <div class="col-md-4 d-flex align-items-center">
        <label class="me-2">Accept Terms</label>
        <input type="checkbox" v-model="adminExtra.acceptTermsAndConditions" required/>
      </div>

      <div class="col-12 mt-3">
        <button type="submit" class="btn btn-primary">Save Admin</button>
      </div>

    </UserCreateForm>
  </form>
</template>

<style scoped>
h1 {
  font-weight: 600;
}
</style>
