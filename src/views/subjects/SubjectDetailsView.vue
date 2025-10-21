<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useLoading} from "@/composables/useLoading.js";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import subjectService from "@/services/subjectService.js";
import SubjectService from "@/services/subjectService.js";
import {useAppToast} from "@/composables/useAppToast.js";
import router from "@/router/index.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Subject List', to: {name: 'subjects'}},
  {label: 'Subject Details'}
];

const {withLoading} = useLoading();
const route = useRoute();
const subjectId = +route.params.id;

const subject = ref(null);

const loadSubject = async (id) => {
  await withLoading(async () => {
    subject.value = await subjectService.getSubjectById(id);
  });
};


const {showError, showSuccess, showDialog} = useAppToast()
const onDeleteSubject = async (id) => {

  const result = await showDialog('Are you sure you want to delete this subject?')

  if (result.isConfirmed) {
    try {
      await withLoading(async () => {
        const res = await SubjectService.deleteSubject(id);
        showSuccess("Subject with id: " + id + " deleted successfully.")
        await router.push({name: 'subjects'})
      })
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.')
    }
  }
}


onMounted(async () => {
  await loadSubject(subjectId);
  console.log(subject.value.students)
});
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="container mt-4">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-light text-dark d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="bi bi-journal-bookmark"></i> Subject Details
        </h5>
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-light text-dark">ID: {{ subject?.id }}</span>

          <router-link :to="{name:'edit-subject', params:{id:subject?.id}}" class="btn btn-sm btn-primary">
            <i class="bi bi-pencil"></i> Modify
          </router-link>

          <button @click="onDeleteSubject" class="btn btn-sm btn-danger">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>


      <div class="card-body p-4">
        <div class="mb-4 text-center">
          <h4 class="fw-bold text-primary">{{ subject?.name }}</h4>
          <p class="text-muted mb-0">{{ subject?.description || 'No description available.' }}</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <div class="info-box">
              <strong><i class="bi bi-person-lines-fill"></i> Teachers:</strong>
              <ul class="list-unstyled mt-2">
                <li v-for="(t,index) in subject?.teacherNames" :key="t" class="badge bg-secondary me-2">
                  <router-link :to="{ name: 'teacher-details', params: { id: subject.teacherIds[index] } }">
                    <span class="text-light"> {{ t }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-box">
              <strong><i class="bi bi-123"></i> Class Numbers:</strong>
              <div class="mt-2">
                <span v-for="n in subject?.classNumber" :key="n" class="badge bg-info text-dark me-1">
                  {{ n }}
                </span>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-box">
              <strong><i class="bi bi-hourglass-split"></i> Total Hours:</strong>
              <div class="mt-2">{{ subject?.totalHours }}</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-box">
              <strong><i class="bi bi-award"></i> Credits:</strong>
              <div class="mt-2">{{ subject?.credits }}</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-box">
              <strong><i class="bi bi-calendar3"></i> Semesters:</strong>
              <div class="mt-2">
                <span v-for="s in subject?.semester" :key="s" class="badge bg-success me-1">
                  {{ s.replaceAll('_', ' ') }}
                </span>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="info-box">
              <strong><i class="bi bi-people-fill"></i> Students:</strong>
              <div class="mt-2 d-flex flex-wrap gap-2">
      <span v-if="subject?.students?.length"
            v-for="(student, index) in subject.studentNames"
            :key="subject.students[index]">
        <router-link
            :to="{ name:'student-details', params: { id: subject.students[index] } }"
            class="btn btn-sm btn-outline-primary student-badge">
          {{ student }}
        </router-link>
      </span>
                <span v-else class="text-muted">No students enrolled</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="card-footer d-flex justify-content-between align-items-center bg-light">
        <router-link :to="{name:'subjects'}" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Back to List
        </router-link>

        <router-link
            :to="{ name: 'add-attendance', query: { subjectId: subject?.id } }"
            class="btn btn-primary"
        >
          <i class="bi bi-clipboard-plus"></i> Add Attendance
        </router-link>

        <router-link :to="{name:'add-grade', query: {subjectId: subject?.id}}"
                     class="btn btn-primary"
        >Add Grades
        </router-link>
      </div>

    </div>
  </div>
</template>

<style scoped>
.info-box {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  height: 100%;
}

.badge {
  font-size: 0.85rem;
}

<
style scoped >
.info-box {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  height: 100%;
}

.student-badge {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.student-badge:hover {
  background-color: #0d6efd;
  color: white;
  text-decoration: none;
}

@media (max-width: 576px) {
  .student-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
