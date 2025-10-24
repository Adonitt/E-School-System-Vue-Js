<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import {useAppToast} from "@/composables/useAppToast.js";
import AppInput from "@/components/app/AppInput.vue";
import SubjectService from "@/services/subjectService.js";
import AppSelect from "@/components/app/AppSelect.vue";
import GradesService from "@/services/gradesService.js";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";

const route = useRoute()
const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Subject Details', to: {name: 'subject-details', params: {id: route.query.subjectId}}},
  {label: 'Add Grade'}
]

const gradeToSubmit = reactive({
  studentId: '',
  subjectId: '',
  grade: null,
  attendancePercentageUsed: 0.0,
  semester: null
})


const grades = [
  {label: '5', value: 'FIVE'},
  {label: '6', value: 'SIX'},
  {label: '7', value: 'SEVEN'},
  {label: '8', value: 'EIGHT'},
  {label: '9', value: 'NINE'},
  {label: '10', value: 'TEN'},
]


const router = useRouter()
const {withLoading} = useLoading()
const {showError, showSuccess, showWarning, showDialog} = useAppToast()
const subject = ref(null)
const studentOptions = ref([])
const semesterOptions = ref([])
const selectedStudent = ref(null)

const loadSubject = async () => {
  try {
    subject.value = await SubjectService.getSubjectById(route.query.subjectId)
    studentOptions.value = subject.value.studentNames.map((name, index) => ({
      label: name,
      value: subject.value.students[index]
    }))
    semesterOptions.value = subject.value.semester.map((semester, index) => ({
      label: semester,
      value: subject.value.semester[index]
    }))
  } catch (err) {
    showError(err.response?.data?.message || 'An unexpected error occurred.')
    console.error(err)
  }
}

const studentsWithGrades = ref([])

const loadStudentsWithGrades = async () => {
  await withLoading(async () => {
    studentsWithGrades.value = await GradesService.getGradesBySubjectId(route.query.subjectId)
  })
}

const gradeToNumber = {
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10
};

studentsWithGrades.value.map(g => {
  g.gradeNumber = gradeToNumber[g.grade];
});

const onHandleSubmit = async () => {
  if (gradeToSubmit.studentId === '' || gradeToSubmit.grade === '' || gradeToSubmit.semester === '') {
    showWarning('Please fill all required fields!')
  }

  await withLoading(async () => {
    try {
      const dto = {
        studentId: selectedStudent.value,
        subjectId: subject.value.id,
        grade: gradeToSubmit.grade,
        attendancePercentageUsed: gradeToSubmit.attendancePercentageUsed,
        semester: gradeToSubmit.semester
      }

      await GradesService.createGrade(dto)
      const studentName = studentOptions.value.find(s => s.value === selectedStudent.value)?.label
      showSuccess(`Grade for student ${studentName} added successfully.`)
      await loadStudentsWithGrades()

      selectedStudent.value = null;
      gradeToSubmit.grade = null;
      gradeToSubmit.attendancePercentageUsed = 0.0;
      gradeToSubmit.semester = null;
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.')
      console.error(err)
    }
  })
}

const showEditModal = ref(false)
const editGrade = ref(null)

const openEditModal = (grade) => {
  editGrade.value = {...grade};

  gradeToUpdate.gradeId = grade.id;
  gradeToUpdate.grade = grade.grade;
  gradeToUpdate.attendancePercentageUsed = grade.attendancePercentageUsed;
  gradeToUpdate.semester = grade.semester;

  showEditModal.value = true;
};


const gradeToUpdate = reactive({
  gradeId: '',
  grade: null,
  attendancePercentageUsed: 0.0,
  semester: null
})

const updateGrade = async () => {
  await withLoading(async () => {
    try {
      const dto = {
        gradeId: gradeToUpdate.gradeId,
        grade: gradeToUpdate.grade,
        attendancePercentageUsed: gradeToUpdate.attendancePercentageUsed,
        semester: gradeToUpdate.semester
      }

      await GradesService.modifyGrade(gradeToUpdate.gradeId, dto);
      const student = studentsWithGrades.value.find(g => g.id === gradeToUpdate.gradeId);

      showSuccess(`Grade for student ${student?.studentName} updated successfully.`)
      await loadStudentsWithGrades();
      showEditModal.value = false;
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.');
      console.error(err);
    }
  });
};

const removeGrade = async (grade) => {
  const result = await showDialog('Are you sure you want to delete this grade?')

  if (result.isConfirmed) {
    await withLoading(async () => {
          try {
            await GradesService.deleteGrade(grade.id)
            showSuccess(`Grade for student ${grade.studentName} deleted successfully.`)
            await loadStudentsWithGrades()
          } catch (err) {
            showError(err.response?.data?.message || 'An unexpected error occurred.')
            console.error(err)
          }
        }
    )
  }

}


const authStore = useAuthStore()
onMounted(async () => {
  await loadSubject()
  await loadStudentsWithGrades()

  console.log(studentsWithGrades.value)
})
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="d-flex justify-content-center">
    <div class="card shadow-sm border-0 mb-4 col-md-8 text-center">
      <div class="card-header bg-light text-dark">
        <h5 class="mb-0"><i class="bi bi-journal-plus"></i> Add Grade on <b>
          <router-link :to="{name:'subject-details',params:{id: route.query.subjectId}}">{{
              subject?.name
            }}
          </router-link>
        </b></h5>
      </div>

      <form @submit.prevent="onHandleSubmit" class="row g-4 p-3">
        <app-input id="subjectId" label="Subject ID" :value="subject?.id" disabled/>
        <app-input id="subjectName" label="Subject" :value="subject?.name" disabled/>

        <app-select
            id="students"
            :options="studentOptions"
            label="Students"
            placeholder="Choose a student..."
            v-model="selectedStudent"
        />

        <app-select
            id="semester"
            :options="semesterOptions"
            label="Semester"
            v-model="gradeToSubmit.semester"
        />

        <app-input
            id="attendance"
            label="Attendance"
            v-model="gradeToSubmit.attendancePercentageUsed"
            placeholder="Please add attendance"
        />

        <app-select
            id="grade"
            :options="grades"
            label="Grade"
            v-model="gradeToSubmit.grade"
        />

        <div class="col-12 text-center mt-3">
          <button class="btn btn-primary" type="submit">
            <i class="bi bi-save"></i> Submit Grade
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="card shadow-sm border-0 mt-4  d-flex justify-content-center">
    <div class="card-header bg-light text-dark d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="bi bi-people"></i> Students with Grades in Subject:
        <router-link :to="{name:'subject-details',params:{id: route.query.subjectId}}">{{
            subject?.name
          }}
        </router-link>
      </h5>
    </div>

    <div class="card-body">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Student</th>
          <th>Grade</th>
          <th>Semester</th>
          <th>Teacher</th>
          <th>Attendance %</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="grade in studentsWithGrades" :key="grade.id">
          <td>{{ grade.id }}</td>
          <td>
            <router-link :to="{name:'student-details', params:{id:grade.studentId}}">
              {{ grade.studentName }}
            </router-link>
          </td>

          <td>{{ gradeToNumber[grade.grade] }}</td>
          <td>{{ grade.semester }}</td>
          <td>
            <router-link :to="{name:'teacher-details',params:{id:grade.teacherId}}">
              {{ grade.teacher }}
            </router-link>
          </td>
          <td>{{ grade.attendancePercentageUsed }}</td>
          <td>
            <button
                class="btn btn-sm btn-warning d-flex align-items-center"
                v-if="authStore.loggedInUser?.role === ROLES.TEACHER && grade.teacherId === authStore.loggedInUser?.id"

                @click="openEditModal(grade)">
              <i class="bi bi-pencil-fill me-1"></i>
            </button>
            <button
                @click="removeGrade(grade)"
                v-if="authStore.loggedInUser?.role === ROLES.TEACHER && grade.teacherId === authStore.loggedInUser?.id"
                class="btn btn-sm btn-danger d-flex align-items-center"
            >
              <i class="bi bi-trash"></i>
            </button>

          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showEditModal" class="modal-backdrop d-flex justify-content-center align-items-center">
    <div class="modal-content p-4 bg-white shadow rounded" style="min-width: 400px;">
      <h5 class="mb-3">Edit Grade: #{{ gradeToUpdate.gradeId }}</h5>

      <form @submit.prevent="updateGrade" class="row g-3">
        <app-select
            id="grade"
            :options="grades"
            label="Grade"
            v-model="gradeToUpdate.grade"
            placeholder="Choose grade..."
        />

        <app-input
            id="attendancePercentageUsed"
            label="Attendance %"
            v-model.number="gradeToUpdate.attendancePercentageUsed"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="Enter attendance"
        />


        <app-select
            id="semester"
            :options="semesterOptions"
            label="Semester"
            v-model="gradeToUpdate.semester"
            placeholder="Choose semester..."
        />

        <div class="col-12 text-end mt-3">
          <button type="button" class="btn btn-secondary me-2" @click="showEditModal=false">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  </div>


</template>
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
