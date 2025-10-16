<script setup>

import UserCreateForm from "@/components/user-form/UserCreateForm.vue";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {ref} from "vue";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import {useLoading} from "@/composables/useLoading.js";
import {useRouter} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";
import StudentService from "@/services/studentService.js";

const breadCrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Student List', to: {name: 'students'}},
  {label: 'Create Student'}
]

const studentExtra = ref({
  photo: null,
  previewImage: null,
  academicYear: null,
  guardianName: '',
  guardianPhoneNumber: '',
  guardianEmail: '',
  emergencyContactPhone: '',
  relationshipToStudent: null,
  classNumber: 0
})

const guardianEnum = [
  {label: 'Father', value: 'FATHER'},
  {label: 'Mother', value: 'MOTHER'},
  {label: 'Uncle', value: 'UNCLE'},
  {label: 'Aunt', value: 'AUNT'},
  {label: 'Grandfather', value: 'GRANDFATHER'},
  {label: 'Grandmother', value: 'GRANDMOTHER'},
  {label: 'Other', value: 'OTHER'}
]


const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    studentExtra.value.photo = file;
    studentExtra.value.previewImage = file ? URL.createObjectURL(file) : null;
  }
}

const {withLoading} = useLoading()
const router = useRouter();
const {showSuccess, showError} = useAppToast()
const userFormRef = ref(null);


const handeSubmit = async () => {

  if (!userFormRef.value) return;
  const userData = userFormRef.value.user;

  const {photo, previewImage, ...rest} = studentExtra.value
  const finalData = {...userData, ...rest}

  const formData = new FormData();
  formData.append('dto', new Blob([JSON.stringify(finalData)], {type: 'application/json'}));

  if (photo) {
    formData.append('photo', photo);
  }

  await withLoading(async () => {
    try {
      await StudentService.createStudent(formData)
      showSuccess("Student created successfully.")
      await router.push({name: "students"})
    } catch (err) {
      showError(err.response?.data?.message || "Error creating student!")
      console.error(err)
    }
  })
}


</script>

<template>
  <bread-crumb :items="breadCrumbs"/>

  <form @submit.prevent="handeSubmit" class="row g-4 p-3">

    <user-create-form ref="userFormRef">
      <template #image>
        <div class="col-md-4 d-flex flex-column align-items-center text-center border-end">
          <p class="fw-semibold mb-2 mt-2">User Photo</p>

          <div class="mb-3">
            <img
                v-if="studentExtra.previewImage"
                :src="studentExtra.previewImage"
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

      <app-input id="classNumber" label="Class Number" v-model="studentExtra.classNumber"/>

      <div>
        <app-input
            id="academicYear"
            label="Academic Year"
            v-model="studentExtra.academicYear"
        />
        <span class="form-text text-muted">Format: YYYY-YYYY</span>
      </div>

      <hr>
      <h3 class="mb-2">Guardian</h3>
      <app-input id="guardianName" label="Guardian Name" v-model="studentExtra.guardianName"/>
      <app-input id="guardianPhoneNumber" label="Guardian Phone Number" v-model="studentExtra.guardianPhoneNumber"
      />

      <app-input id="guardianEmail" label="Guardian Email" v-model="studentExtra.guardianEmail"
      />

      <app-input id="emergencyContactPhone" label="Emergency Contact Phone"
                 v-model="studentExtra.emergencyContactPhone"/>

      <app-select id="relationshipToStudent" :options="guardianEnum" label="Relationship To Student"
                  v-model="studentExtra.relationshipToStudent"/>

      <div class="col-12 mt-3">
        <button type="submit" class="btn btn-primary">Save Student</button>
      </div>

    </user-create-form>
  </form>
</template>

<style scoped>

</style>