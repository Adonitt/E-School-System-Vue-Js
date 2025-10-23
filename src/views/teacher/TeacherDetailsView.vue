<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import TeacherService from "@/services/teacherService.js";
import {useRoute, useRouter} from "vue-router";
import {useLoading} from "@/composables/useLoading.js";
import UserShowDetails from "@/components/user-form/UserShowDetails.vue";
import AppButton from "@/components/app/AppButton.vue";
import {useAppToast} from "@/composables/useAppToast.js";
import {ROLES} from "@/composables/useAdministration.js";
import {useAuthStore} from "@/stores/authStore.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Teacher List', to: {name: 'teachers'}},
  {label: 'Teacher Details', to: {name: 'teacher-details'}},
]

const route = useRoute()
const teacherId = +route.params.id

const teacher = ref(null)
const {withLoading} = useLoading()

const loadTeacher = async () => {
  await withLoading(async () => {
    teacher.value = await TeacherService.getTeacherById(teacherId)
  })
}

const {showDialog, showError, showWarning, showSuccess} = useAppToast()
const router = useRouter()
const onDeleteTeacher = async (id) => {
  const result = await showDialog('Are you sure you want to delete this admin?')

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = await TeacherService.removeTeacher(id);
        showSuccess("Teacher with id: " + id + " deleted successfully.")
        await router.push({name: 'teachers'})
      })
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.')
    }
  }
}

onMounted(async () => {
  await loadTeacher()
  console.log(teacher.value)
})
const authStore = useAuthStore()

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <user-show-details :user="teacher">

    <template #buttons>
      <router-link class="btn btn-secondary  " :to="{name:'edit-teacher', params:{id:route.params.id}}"
                   v-if="authStore.loggedInUser?.role === ROLES.ADMIN"

      >Update Teacher
      </router-link>

      <app-button class="btn btn-danger flex" @click="onDeleteTeacher(teacher.id)"
                  v-if="authStore.loggedInUser?.role === ROLES.ADMIN"

      >Delete Teacher
      </app-button>
    </template>

    <template #other-details>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Specialization</div>
        <div class="col-lg-9 col-md-8">{{ teacher?.specialization }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Years Of Experience</div>
        <div class="col-lg-9 col-md-8">{{ teacher?.yearsOfExperience }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Employment Date</div>
        <div class="col-lg-9 col-md-8">{{ teacher?.employmentDate }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Qualification</div>
        <div class="col-lg-9 col-md-8">{{ teacher?.qualification }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Subjects</div>
        <div class="col-lg-9 col-md-8">
          <router-link v-for="(subject, index) in teacher?.subjectNames"
                       :key="index"
                       :to="{ name: 'subject-details', params: { id: teacher.subjectIds[index] } }"
                       class="badge bg-info me-1">
            {{ subject }}
          </router-link>
        </div>
      </div>
    </template>
  </user-show-details>


</template>

<style scoped>

</style>