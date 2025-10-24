<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import UserShowDetails from "@/components/user-form/UserShowDetails.vue";
import {onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import {useRoute} from "vue-router";
import StudentService from "@/services/studentService.js";
import {useAppToast} from "@/composables/useAppToast.js";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Student List', to: {name: 'students'}},
  {label: 'Student Details'}
]

const student = ref(null)
const {withLoading} = useLoading()
const route = useRoute()
const studentId = +route.params.id


const loadStudentById = async () => {
  await withLoading(async () => {
    student.value = await StudentService.getStudentById(studentId)
  })
}

const {showDialog, showSuccess, showError} = useAppToast()

const onDeactivateStudent = async (id) => {
  const result = await showDialog("Are you sure you want to deactivate this student?");
  if (result.isConfirmed) {
    await withLoading(async () => {
      try {
        await StudentService.deactivateStudent(id);
        showSuccess("Student with id: " + id + " deactivated successfully.");
        await loadStudentById()
      } catch (err) {
        showError(err.response?.data?.message || 'An unexpected error occurred.');
      }
    });
  }
};

const onActivateStudent = async (id) => {
  const result = await showDialog("Are you sure you want to activate this student?");

  if (result.isConfirmed) {
    await withLoading(async () => {
      try {
        await StudentService.activateStudent(id);
        showSuccess("Student with id: " + id + " activated successfully.")
        await loadStudentById()
      } catch (err) {
        showError(err.response?.data?.message || 'An unexpected error occurred.')
      }
    })
  }
}

onMounted(async () => {
  await loadStudentById(studentId)
  console.log(student.value.subjectIds)
})
const authStore = useAuthStore()
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <user-show-details :user="student">

    <template #buttons>
      <router-link class="btn btn-secondary  " :to="{name:'edit-student', params:{id: +route.params.id}}"
                   v-if="authStore.loggedInUser?.role === ROLES.ADMIN"
      >Update Student
      </router-link>

      <button class="btn flex text-white"
              :class="student?.active ? 'bg-danger' : 'bg-success'"
              v-if="authStore.loggedInUser?.role === ROLES.ADMIN"

              @click="student?.active ? onDeactivateStudent(studentId) : onActivateStudent(studentId)">
        {{ student?.active ? 'Deactivate Student' : 'Activate Student' }}
      </button>

    </template>

    <template #other-details>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Is Active?</div>
        <div class="col-lg-9 col-md-8">
                    <span class="badge" :class="student?.active ? 'bg-success' : 'bg-danger'">
              {{ student?.active ? 'Yes' : 'No' }}
            </span>

        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Graduated?</div>
        <div class="col-lg-9 col-md-8">
                    <span class="badge" :class="student?.graduated ? 'bg-success' : 'bg-danger'">
              {{ student?.graduated ? 'Yes' : 'No' }}
            </span>

        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Current Semester</div>
        <div class="col-lg-9 col-md-8"> {{ student?.currentSemester }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">GPA</div>
        <div class="col-lg-9 col-md-8"> {{ student?.gpa }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Completed Semesters</div>
        <div class="col-lg-9 col-md-8"> {{ student?.completedSemesters }}</div>
      </div>
      <hr>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Attendance Record</div>
        <div class="col-lg-9 col-md-8">
          <router-link
              :to="{ name: 'student-attendances', params: { id:+route.params.id } }"
              class="btn btn-primary btn-sm"
          >
            <i class="bi bi-journal-text me-1"></i> View Attendances
          </router-link>
        </div>

      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Grades</div>
        <div class="col-lg-9 col-md-8">
          <router-link :to="{name:'student-grades',params:{id: route.params.id}}"
                       class="btn btn-primary btn-sm"><i class="bi-sort-numeric-up-alt"></i> Student Grades
          </router-link>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Class Number</div>
        <div class="col-lg-9 col-md-8">
          <router-link
              v-if="student?.classNumber"
              :to="{ name: 'students-by-class-number', params:{ classNumber: student.classNumber } }"
          >
            {{ student.classNumber }}
          </router-link>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-lg-3 col-md-4 label">Subjects</div>
        <div class="col-lg-9 col-md-8">
          <router-link
              :to="{ name: 'student-subjects', params: { id: studentId } }"
              class="btn btn-primary btn-sm"
          >
            <i class="bi bi-journal-bookmark me-1"></i> Student Subjects
          </router-link>
        </div>
      </div>
      <hr>


      <div class="row">
        <div class="col-lg-3 col-md-4 label">Guardian Name</div>
        <div class="col-lg-9 col-md-8"> {{ student?.guardianName }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Guardian Phone Number</div>
        <div class="col-lg-9 col-md-8"> {{ student?.guardianPhoneNumber }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Guardian Email</div>
        <div class="col-lg-9 col-md-8"> {{ student?.guardianEmail }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Relationship To Student</div>
        <div class="col-lg-9 col-md-8"> {{ student?.relationshipToStudent }}</div>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-4 label">Emergency Contact Phone</div>
        <div class="col-lg-9 col-md-8"> {{ student?.emergencyContactPhone }}</div>
      </div>


    </template>

  </user-show-details>

</template>

<style scoped>

</style>