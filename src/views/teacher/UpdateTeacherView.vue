<script setup>

import UserUpdateForm from "@/components/user-show/UserUpdateForm.vue";
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import teacherService from "@/services/teacherService.js";
import {useAppToast} from "@/composables/useAppToast.js";
import {useRoute, useRouter} from "vue-router";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import {useEnumStore} from "@/stores/enumStore.js";


const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Teacher List', to: {name: 'teachers'}},
  {label: 'Update Teacher'}
]

const teacherExtra = ref({
  photo: null,
  previewImage: null,
  specialization: "",
  yearsOfExperience: 0,
  qualification: "",
  employmentDate: null,
  subjectIds: [],
  role: null
})


const teacher = ref(null)
const {withLoading} = useLoading()

const userFormRef = ref(null);
const toast = useAppToast()
const router = useRouter()
const route = useRoute()
const teacherId = +route.params.id;
const enumStore = useEnumStore()

const loadTeacherById = async (id) => {
  await withLoading(async () => {
    teacher.value = await teacherService.getTeacherById(id)

    userFormRef.value.user.personalNumber = teacher.value.personalNumber;
    userFormRef.value.user.name = teacher.value.name;
    userFormRef.value.user.surname = teacher.value.surname;
    userFormRef.value.user.gender = teacher.value.gender;
    userFormRef.value.user.birthDate = teacher.value.birthDate;
    userFormRef.value.user.address = teacher.value.address;

    await enumStore.loadCountries();
    userFormRef.value.user.country = teacher.value.country;

    await enumStore.loadCities(teacher.value.country);
    userFormRef.value.user.city = teacher.value.city;

    userFormRef.value.user.postalCode = teacher.value.postalCode;
    userFormRef.value.user.phoneNumber = teacher.value.phoneNumber;
    userFormRef.value.user.email = teacher.value.email;
    userFormRef.value.user.notes = teacher.value.notes;


    teacherExtra.value.photo = teacher.value.photo;
    teacherExtra.value.previewImage = teacher.value.photo ? getFullImagePath(teacher.value.photo) : null;
    teacherExtra.value.employmentDate = teacher.value.employmentDate;
    teacherExtra.value.specialization = teacher.value.specialization;
    teacherExtra.value.qualification = teacher.value.qualification;
    teacherExtra.value.subjectIds = teacher.value.subjectIds;
    teacherExtra.value.yearsOfExperience = teacher.value.yearsOfExperience;
    teacherExtra.value.role = teacher.value.role;
  })
}
const qualifications = [
  {label: 'Bachelor', value: 'BACHELOR'},
  {label: 'Master', value: 'MASTER'},
  {label: 'Doctor', value: 'DOCTOR'}
]

const roles = [
  {label: 'Teacher', value: 'TEACHER'},
  {label: 'Admin', value: 'ADMINISTRATOR'},
  {label: 'Student', value: 'STUDENT'}
]

const getFullImagePath = (path) => {
  if (!path) return null;
  return "http://localhost:8080/" + path;
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    teacherExtra.value.photo = file;
    teacherExtra.value.previewImage = URL.createObjectURL(file);
  }
}


const onHandleSubmit = async () => {

  const dto = {
    ...userFormRef.value.user,
    specialization: teacherExtra.value.specialization,
    yearsOfExperience: teacherExtra.value.yearsOfExperience,
    qualification: teacherExtra.value.qualification,
    employmentDate: teacherExtra.value.employmentDate,
    subjectIds: teacherExtra.value.subjectIds,
    role: teacherExtra.value.role,
  }

  const formData = new FormData();
  formData.append("dto", new Blob([JSON.stringify(dto)], {type: "application/json"}));

  if (teacherExtra.value.photo instanceof File) {
    formData.append("photo", teacherExtra.value.photo);
  }


  await withLoading(async () => {
    try {
      await teacherService.modifyTeacher(teacherId, formData);
      toast.showSuccess("Teacher with id: " + teacherId + " updated successfully.");
      await router.push({name: "teachers"});
    } catch (err) {
      toast.showError(err.response?.data?.message || "Error updating admin!");
      console.log(err);
    }
  });
};

onMounted(async () => {
  await loadTeacherById(teacherId)
})

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>
  <h3 class="mb-3">Update Teacher with id: {{ teacherId }}</h3>

  <form @submit.prevent="onHandleSubmit" class="row g-4 p-3">
    <user-update-form ref="userFormRef">

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
      <template #other-inputs>
        <hr/>
        <app-select id="role" :options="roles" label="Role" v-model="teacherExtra.role"/>
        <app-input id="specialization" label="Specialization" v-model="teacherExtra.specialization"/>
        <app-input id="yearsOfExperience" label="Years of Experience" type="number"
                   v-model="teacherExtra.yearsOfExperience"/>
        <app-input id="employmentDate" label="Employment Date" type="date" v-model="teacherExtra.employmentDate"/>
        <app-select id="qualification" :options="qualifications" label="Qualification"
                    v-model="teacherExtra.qualification"/>

        <app-select id="subjects" options="subjects" label="Subjects"/>

        <div class="col-12 mt-3">
          <button type="submit" class="btn btn-primary">Update Teacher</button>
        </div>
      </template>
    </user-update-form>
  </form>
</template>

<style scoped>

</style>