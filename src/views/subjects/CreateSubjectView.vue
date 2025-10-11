<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {onMounted, ref} from "vue";
import TeacherService from "@/services/teacherService.js";
import {useLoading} from "@/composables/useLoading.js";
import {useRouter} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";
import SubjectService from "@/services/subjectService.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Subjects', to: {name: 'subjects'}},
  {label: 'Create Subject'},
]

const subject = ref({
  name: '',
  description: '',
  teachers: [],
  credits: 0,
  totalHours: 0,
  semester: [],
  classNumber: []
})

const teacherOptions = ref([])
const classNumberOptions = ref([])

const loadAllClassNumbers = async () => {
  const classNumbers = await SubjectService.getAllClassNumbers()
  classNumberOptions.value = classNumbers.map(c => ({
    label: c,
    value: c
  }))
}


const semesterOptions = [
  {label: ' Semester 1', value: 'SEMESTER_1'},
  {label: ' Semester 2', value: 'SEMESTER_2'},
  {label: ' Semester 3', value: 'SEMESTER_3'},
  {label: ' Semester 4', value: 'SEMESTER_4'},
  {label: ' Semester 5', value: 'SEMESTER_5'},
  {label: ' Semester 6', value: 'SEMESTER_6'}
]

const loadAllTeachers = async () => {
  const teachers = await TeacherService.getAllTeachers()
  teacherOptions.value = teachers.map(t => ({
    label: t.name + " " + t.surname,
    value: t.id
  }))
}

const {withLoading} = useLoading()
const router = useRouter()
const {showSuccess, showError} = useAppToast()

const onHandleSubmit = async () => {
  await withLoading(async () => {
    try {
      await SubjectService.createSubject(subject.value)
      await router.push({name: 'subjects'})
      showSuccess('Subject created successfully!')
    } catch (err) {
      showError(err.response?.data?.message || 'An error has occurred!')
    }
  })
}
onMounted(async () => {
  await loadAllTeachers()
  await loadAllClassNumbers()
})

</script>
<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="container mt-4">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light text-dark">
        <h5 class="mb-0">
          <i class="bi bi-journal-plus"></i> Create New Subject
        </h5>
      </div>

      <div class="card-body p-4">
        <form @submit.prevent="onHandleSubmit">
          <div class="row g-3">

            <div class="col-md-6">
              <label for="name" class="form-label">Subject Name</label>
              <input type="text" id="name" v-model="subject.name" class="form-control" required/>
            </div>

            <div class="col-md-6">
              <label for="credits" class="form-label">Credits</label>
              <input type="number" id="credits" v-model="subject.credits" class="form-control" required/>
            </div>

            <div class="col-12">
              <label for="description" class="form-label">Description</label>
              <textarea id="description" v-model="subject.description" class="form-control" rows="3"
                        required></textarea>
            </div>
            <hr>

            <div class="col-12">
              <label class="form-label">Teachers</label>
              <div class="d-flex flex-wrap gap-3">
                <div v-for="t in teacherOptions" :key="t.value" class="form-check">
                  <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'teacher-' + t.value"
                      :value="t.value"
                      v-model="subject.teachers"
                  >
                  <label class="form-check-label" :for="'teacher-' + t.value">
                    {{ t.label }}
                  </label>
                </div>
              </div>
            </div>
            <hr>

            <div class="col-md-6">
              <label for="totalHours" class="form-label">Total Hours</label>
              <input type="number" id="totalHours" v-model="subject.totalHours" class="form-control" required/>
            </div>
            <hr>

            <div class="col-12">
              <label class="form-label">Class Number</label>
              <div class="d-flex flex-wrap gap-3">
                <div v-for="c in classNumberOptions" :key="c.value" class="form-check">
                  <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'classNr-' + c.value"
                      :value="c.value"
                      v-model="subject.classNumber"
                  >
                  <label class="form-check-label" :for="'classNr-' + c.value">
                    {{ c.label }}
                  </label>
                </div>
              </div>
            </div>
            <hr>


            <div class="col-12">
              <label class="form-label">Semester</label>
              <div class="d-flex flex-wrap gap-3">
                <div v-for="s in semesterOptions" :key="s.value" class="form-check">
                  <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'semester-' + s.value"
                      :value="s.value"
                      v-model="subject.semester"
                  >
                  <label class="form-check-label" :for="'semester-' + s.value">
                    {{ s.label }}
                  </label>
                </div>
              </div>
            </div>
            <hr>


            <div class="col-12 text-end mt-3">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save"></i> Save Subject
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
}

.card-header {
  font-weight: 600;
  font-size: 1.1rem;
}

.form-label {
  font-weight: 500;
}

.form-check {
  min-width: 150px;
}

.btn {
  padding: 0.6rem 1.4rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.container {
  max-width: 900px;
}
</style>
