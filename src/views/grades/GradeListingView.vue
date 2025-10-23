<script setup>
import {onMounted, ref, computed} from "vue";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useLoading} from "@/composables/useLoading.js";
import GradesService from "@/services/gradesService.js";
import StudentService from "@/services/studentService.js";
import SubjectService from "@/services/subjectService.js";
import {useAppToast} from "@/composables/useAppToast.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Grades'},
]

const grades = ref([])
const search = ref("") // <--- input për search
const {withLoading} = useLoading()
const {showError} = useAppToast()

const loadGrades = async () => {
  await withLoading(async () => {
    try {
      const data = await GradesService.getAllGrades()
      grades.value = await Promise.all(
          data.map(async (g) => {
            const student = await StudentService.getStudentById(g.studentId)
            const subject = await SubjectService.getSubjectById(g.subjectId)
            return {
              ...g,
              studentName: student.name + " " + student.surname,
              subjectName: subject.name,
            }
          })
      )
    } catch (err) {
      showError(err.response?.data?.message || "An unexpected error occurred.")
    }
  })
}

onMounted(async () => {
  await loadGrades()
})

// computed property për search
const filteredGrades = computed(() => {
  if (!search.value) return grades.value
  const term = search.value.toLowerCase()
  return grades.value.filter(g =>
      g.studentName.toLowerCase().includes(term) ||
      g.subjectName.toLowerCase().includes(term)
  )
})
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="card shadow-sm mt-4">
    <div class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
      <h5 class="mb-0">Grade Listing</h5>
    </div>
      <input
          v-model="search"
          type="text"
          placeholder="Search by student or subject..."
          class="form-control form-control-sm mt-2 mt-md-0  p-2"
      />
    <br>

    <div class="card-body p-0">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
        <tr>
          <th>#</th>
          <th>Student</th>
          <th>Subject</th>
          <th>Grade</th>
          <th>Semester</th>
          <th>Teacher</th>
          <th>Attendance</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="filteredGrades.length === 0">
          <td colspan="8" class="text-center py-3 text-muted">
            No records found.
          </td>
        </tr>
        <tr v-for="grade in filteredGrades" :key="grade.id">
          <td>{{ grade.id }}</td>
          <td>
            <router-link :to="{ name: 'student-details', params: { id: grade.studentId } }">
              {{ grade.studentName }}
            </router-link>
          </td>
          <td>
            <router-link :to="{ name: 'subject-details', params: { id: grade.subjectId } }">
              {{ grade.subjectName }}
            </router-link>
          </td>
          <td>{{ grade.grade }}</td>
          <td>{{ grade.semester }}</td>
          <td>{{ grade.teacher }}</td>
          <td>{{ grade.attendancePercentageUsed }}%</td>
          <td>
            <router-link :to="{name:'student-grades', params:{id:grade.studentId}}">Details</router-link>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
