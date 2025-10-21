<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import GradesService from "@/services/gradesService.js";
import {useAppToast} from "@/composables/useAppToast.js";
import StudentService from "@/services/studentService.js";
import SubjectService from "@/services/subjectService.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Grades'},
]

const grades = ref([])
const {withLoading} = useLoading()
const {showSuccess, showError} = useAppToast()

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
  console.log(grades.value)
})

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="card shadow-sm mt-4">
    <div class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
      <h5 class="mb-0">Grade Listing</h5>

      <!--      <div class="d-flex gap-2 flex-wrap">-->
      <!--        <input-->
      <!--            v-model="search"-->
      <!--            type="text"-->
      <!--            placeholder="Search by student or subject..."-->
      <!--            class="form-control form-control-sm"-->
      <!--        />-->
      <!--        <input-->
      <!--            v-model="filterDate"-->
      <!--            type="date"-->
      <!--            class="form-control form-control-sm"-->
      <!--        />-->
    </div>
    <div class="card-body p-0">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
        <tr>
          <th scope="col" style="width: 5%">#</th>
          <th scope="col" style="width: 20%">Student</th>
          <th scope="col" style="width: 15%">Subject</th>
          <th scope="col" style="width: 15%">Grade</th>
          <th scope="col" style="width: 15%">Semester</th>
          <th scope="col" style="width: 15%">Teacher</th>
          <th scope="col" style="width: 15%">Attendance</th>
          <th scope="col" style="width: 15%">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="grades.length === 0">
          <td colspan="12" class="text-center py-3 text-muted">
            No attendance records found.
          </td>
        </tr>
        <tr v-for="grade in grades" :key="grade.id">
          <td>{{ grade.id }}</td>
          <td>
            <router-link
                :to="{ name: 'student-details', params: { id: grade.studentId } }"
                class="text-decoration-none fw-semibold"
            >
              {{ grade.studentName }}
            </router-link>
          </td>
          <td>
            <router-link
                :to="{ name: 'subject-details', params: { id: grade.subjectId } }"
                class="text-decoration-none fw-semibold"
            >
              {{ grade.subjectName }}
            </router-link>
          </td>
          <td>{{ grade.grade }}</td>
          <td>{{ grade.semester }}</td>
          <td>
            <router-link
                :to="{ name: 'teacher-details', params: { id: grade.teacherId } }"
                class="text-decoration-none fw-semibold"
            >
              {{ grade.teacher }}
            </router-link>
          </td>


          <td>{{ grade.attendancePercentageUsed }}%</td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>


</template>

<style scoped>

</style>