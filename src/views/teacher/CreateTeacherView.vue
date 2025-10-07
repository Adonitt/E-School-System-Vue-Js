<script setup>
import UserCreateForm from "@/components/user-show/UserCreateForm.vue";
import {ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import {useAppToast} from "@/composables/useAppToast.js";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import TeacherService from "@/services/teacherService.js";
import router from "@/router/index.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Teacher List', to: {name: 'teachers'}},
  {label: 'Create Teacher'}
]

const teacherExtra = ref({
  specialization: "",
  yearsOfExperience: 0,
  qualification: "",
  employmentDate: null,
  subjectIds: [],
  photo: null,
  previewImage: null
})

const qualifications = [
  {label: 'Bachelor', value: 'BACHELOR'},
  {label: 'Master', value: 'MASTER'},
  {label: 'Doctor', value: 'DOCTOR'}
]

const userFormRef = ref(null);

const {withLoading} = useLoading()
const {showSuccess, showError} = useAppToast()

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    teacherExtra.value.photo = file;
    teacherExtra.value.previewImage = file ? URL.createObjectURL(file) : null;
  }
}

const onHandleSubmit = async () => {
  if (!userFormRef.value) {
    showError("User form not loaded yet!");
    return;
  }

  const userData = userFormRef.value.user;


  const {photo, previewImage, ...dto} = teacherExtra.value
  const finalData = {...userData, ...dto}

  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(finalData)], {type: "application/json"}));
  if (photo) {
    formData.append("photo", photo);
  }

  await withLoading(async () => {
    try {
      await TeacherService.createTeacher(formData)
      showSuccess("Teacher created successfully.")
      await router.push({name: "teachers"})
    } catch (err) {
      showError(err.response?.data?.message || "Error creating teacher!")
      console.error(err)
    }
  })

}

const subjects = [{name: 'subject1'}, {name: 'subject2'}]

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
  <form @submit.prevent="onHandleSubmit" class="row g-4 p-3">
    <UserCreateForm ref="userFormRef">

      <template #image>
        <div class="col-md-4 d-flex flex-column align-items-center text-center border-end">
          <p class="fw-semibold mb-2 mt-2">User Photo</p>

          <div class="mb-3">
            <img
                v-if="teacherExtra.previewImage"
                :src="teacherExtra.previewImage"
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

      <app-input id="specialization" label="Specialization" v-model="teacherExtra.specialization"/>

      <app-input id="yearsOfExperience" label="Years of Experience" type="number"
                 v-model="teacherExtra.yearsOfExperience"/>


      <app-input id="employmentDate" label="Employment Date" type="date" v-model="teacherExtra.employmentDate"/>

      <app-select id="qualification" :options="qualifications" label="Qualification"
                  v-model="teacherExtra.qualification"/>

      <!--      <app-select id="Subjects" :options="subjects.name" label="Subjects" v-model="teacherExtra.subjectIds"/>-->

      <div class="col-12 mt-3">
        <button type="submit" class="btn btn-primary">Save Teacher</button>
      </div>
    </UserCreateForm>
  </form>
</template>

<style scoped>

</style>