<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import {useAppToast} from "@/composables/useAppToast.js";
import SubjectService from "@/services/subjectService.js";
import AppButton from "@/components/app/AppButton.vue";


const breadCrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Subjects'}
]

const subjects = ref([])
const {withLoading} = useLoading()
const {showSuccess, showError, showDialog} = useAppToast()

const loadSubjects = async () => {
  await withLoading(async () => {
    subjects.value = await SubjectService.getAllSubjects()
  })
}

const onDeleteSubject = async (id) => {

  const result = await showDialog('Are you sure you want to delete this subject?')

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = await SubjectService.deleteSubject(id);
        showSuccess("Subject with id: " + id + " deleted successfully.")
        await loadSubjects()
      })
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.')
    }
  }
}

onMounted(async () => {
  await loadSubjects()
})

</script>

<template>
  <bread-crumb :items="breadCrumbs"/>

  <div class="card mt-3">
    <a>
      <router-link :to="{name:'create-subject'}" class="btn btn-outline-primary float-end m-3">
        Create a new Subject
      </router-link>
    </a>


    <div class="card-body">
      <h5 class="card-title">Subjects List</h5>
      <div class="table-responsive">
        <table class="table table-striped table-hover" id="subjectsTable">
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Teachers</th>
            <th scope="col">Total Hours</th>
            <th scope="col">Semesters</th>
            <th scope="col">Class Number</th>
            <th scope="col">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="subject in subjects" :key="subject.id">
            <td>{{ subject.id }}</td>
            <td>{{ subject.name }}</td>
            <td>{{ subject.teacherNames?.join(", ") }}</td>
            <td>{{ subject.totalHours }}</td>
            <td>{{ subject?.semester?.join(", ").replaceAll("_", " ") }}</td>
            <td>{{ subject.classNumber.join(", ") }}</td>
            <td>
              <router-link :to="{name:'subject-details', params:{id:subject.id}}" class="btn btn-info btn-sm me-1">
                <i class="bi bi-info-circle"></i>
              </router-link>

              <router-link
                  :to="{name:'edit-subject', params:{id:subject.id}}"
                  class="btn btn-warning btn-sm me-1">
                <i class="bi bi-pen"></i>
              </router-link>
              <app-button
                  class="btn btn-danger btn-sm"
                  @click="onDeleteSubject(subject.id)">
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