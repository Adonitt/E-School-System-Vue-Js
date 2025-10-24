<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useAppToast} from "@/composables/useAppToast.js";
import {useLoading} from "@/composables/useLoading.js";
import GradesService from "@/services/gradesService.js";
import SubjectService from "@/services/subjectService.js";
import StudentService from "@/services/studentService.js";
import AppSelect from "@/components/app/AppSelect.vue";
import AppInput from "@/components/app/AppInput.vue";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";

const route = useRoute();
const studentId = +route.params.id;
const grades = ref([]);
const search = ref("");
const student = ref(null);
const semesterOptions = ref([]);

const breadcrumbs = [
  {label: "Dashboard", to: {name: "home"}},
  {label: "Student Grades"},
];

const {showError, showSuccess} = useAppToast();
const {withLoading} = useLoading();


const gradeOptions = [
  {value: "FIVE", label: "5"},
  {value: "SIX", label: "6"},
  {value: "SEVEN", label: "7"},
  {value: "EIGHT", label: "8"},
  {value: "NINE", label: "9"},
  {value: "TEN", label: "10"},
];

const loadGrades = async () => {
  await withLoading(async () => {
    try {
      const data = await GradesService.getAllGrades();
      const studentGrades = data.filter((g) => g.studentId === studentId);

      grades.value = await Promise.all(
          studentGrades.map(async (g) => {
            const subject = await SubjectService.getSubjectById(g.subjectId);
            return {
              ...g,
              subjectName: subject.name,
              subjectTeacherIds: subject?.teacherIds
            };
          })
      );

      grades.value.sort((a, b) => new Date(b.dateGiven) - new Date(a.dateGiven));
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load grades.");
      console.error(err);
    }
  });
};
const getSemesterOptionsForSubject = async (subjectId) => {
  try {
    const subject = await SubjectService.getSubjectById(subjectId)
    return subject.semester.map(s => ({value: s, label: s}))
  } catch (err) {
    showError(err.response?.data?.message || "Failed to load semesters.")
    console.error(err)
    return []
  }
}

const loadStudent = async () => {
  try {
    student.value = await StudentService.getStudentById(studentId);
  } catch (err) {
    showError(err.response?.data?.message || "Failed to load student.");
    console.error(err);
  }
};

const filteredGrades = computed(() => {
  return grades.value.filter((g) =>
      g.subjectName.toLowerCase().includes(search.value.toLowerCase())
  );
});

const editingGrade = ref(null);
const showEditModal = ref(false);

const openEditModal = async (grade) => {
  editingGrade.value = {
    ...grade,
    studentName: grade.studentName
  };

  semesterOptions.value = await getSemesterOptionsForSubject(grade.subjectId);

  showEditModal.value = true;
};

const gradeToUpdate = reactive({
  gradeId: 0,
  grade: null,
  attendancePercentageUsed: 0.0,
  semester: null
});
const updateGrade = async () => {
  await withLoading(async () => {
    try {
      const dto = {
        grade: editingGrade.value.grade,
        attendancePercentageUsed: editingGrade.value.attendancePercentageUsed,
        semester: editingGrade.value.semester
      };

      await GradesService.modifyGrade(editingGrade.value.id, dto);

      showSuccess(`Grade for student ${editingGrade.value.studentName} updated successfully.`)

      await loadGrades();
      showEditModal.value = false;
    } catch (err) {
      showError(err.response?.data?.message || 'An unexpected error occurred.');
      console.error(err);
    }
  });
};

const authStore = useAuthStore();

onMounted(async () => {
  await loadGrades();
  await loadStudent();
});
</script>
<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="card mt-4 shadow-sm">
    <div class="card-header d-flex flex-wrap gap-2 align-items-center">
      <span v-if="student">{{ student.name + ' ' + student.surname }}'s Grades</span>
      <span v-else>Loading...</span>
      <input
          type="text"
          v-model="search"
          placeholder="Filter by subject..."
          class="form-control form-control-sm flex-grow-1"
      />
    </div>

    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0 align-middle">
          <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Subject</th>
            <th>Grade</th>
            <th>Semester</th>
            <th>Date</th>
            <th v-if="authStore.loggedInUser?.role === ROLES.TEACHER "
            >Action
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="filteredGrades.length === 0">
            <td colspan="6" class="text-center py-3 text-muted">No grades found.</td>
          </tr>
          <tr v-for="(g, index) in filteredGrades" :key="g.id">
            <td>{{ g.id }}</td>
            <td>
              <router-link :to="{ name: 'subject-details', params: { id: g.subjectId } }">
                {{ g.subjectName }}
              </router-link>
            </td>
            <td><span class="badge bg-primary">{{ g.grade }}</span></td>
            <td>{{ g.semester }}</td>
            <td>{{ g.dateGiven }}</td>
            <td>
              <button
                  class="btn btn-sm btn-warning d-flex align-items-center"
                  v-if="authStore.loggedInUser?.role === ROLES.TEACHER && g.subjectTeacherIds?.includes(authStore.loggedInUser?.id)"
                  @click="openEditModal(g)"
              >
                <i class="bi bi-pencil-fill me-1"></i>Edit
              </button>

            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showEditModal" class="modal-backdrop">
    <div class="modal-content p-4 shadow">
      <h5 class="mb-3">Edit Grade: #{{ editingGrade?.id }}</h5>
      <form @submit.prevent="updateGrade" class="row g-3">
        <app-select
            id="grade"
            :options="gradeOptions"
            label="Grade"
            v-model="editingGrade.grade"
            placeholder="Choose grade..."
        />
        <app-input
            id="attendancePercentageUsed"
            label="Attendance %"
            v-model.number="editingGrade.attendancePercentageUsed"
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
            v-model="editingGrade.semester"
            placeholder="Choose semester..."
        />
        <div class="col-12 text-end mt-3">
          <button type="button" class="btn btn-secondary me-2" @click="showEditModal = false">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
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
  gap: 0.5rem;
}

.table-responsive {
  overflow-x: auto;
}

/* Modal responsive */
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

/* Mobile tweaks */
@media (max-width: 576px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .modal-content {
    width: 90%;
  }
}
</style>

