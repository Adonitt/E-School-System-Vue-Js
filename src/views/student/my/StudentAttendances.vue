<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import AttendanceService from "@/services/attendanceService.js";
import SubjectService from "@/services/subjectService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {useAppToast} from "@/composables/useAppToast.js";
import StudentService from "@/services/studentService.js";
import {useAuthStore} from "@/stores/authStore.js";
import {ROLES} from "@/composables/useAdministration.js";

const route = useRoute();
const studentId = +route.params.id;
const attendances = ref([]);
const filterDate = ref("");
const search = ref("");
const student = ref(null);

const editingAttendance = ref(null);
const showEditModal = ref(false);

const {showError, showSuccess} = useAppToast();

const loadAttendances = async () => {
  try {
    const data = await AttendanceService.getAllAttendances();
    const studentAttendances = data.filter(a => a.studentId === parseInt(studentId));

    attendances.value = await Promise.all(
        studentAttendances.map(async (a) => {
          const subject = await SubjectService.getSubjectById(a.subjectId);
          return {
            ...a,
            subjectName: subject.name
          }
        })
    );

    attendances.value.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    showError(err.response?.data?.message || "Failed to load attendances.");
  }
};

const filteredAttendances = computed(() => {
  return attendances.value.filter(a => {
    const matchesSearch = a.subjectName.toLowerCase().includes(search.value.toLowerCase());
    const matchesDate = filterDate.value ? a.date === filterDate.value : true;
    return matchesSearch && matchesDate;
  });
});

const openEditModal = (att) => {
  editingAttendance.value = {...att};
  showEditModal.value = true;
};

const updateAttendance = async () => {
  try {
    await AttendanceService.updateAttendance(editingAttendance.value.id, {
      present: editingAttendance.value.present,
      notes: editingAttendance.value.notes
    });
    showSuccess(`Attendance updated successfully!`);
    showEditModal.value = false;
    await loadAttendances();
  } catch (err) {
    showError(err.response?.data?.message || "Failed to update attendance.");
  }
};

const loadStudent = async () => {
  try {
    student.value = await StudentService.getStudentById(studentId);
  } catch (err) {
    console.error("Failed to load student", err);
  }
};

onMounted(async () => {
  await loadAttendances()
  await loadStudent()
});
const authStore = useAuthStore()
const breadcrumbs = [
  {label: "Dashboard", to: {name: "home"}},
  {label: "Student Attendances"}
];
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="card mt-4 shadow-sm">
    <div class="card-header d-flex flex-wrap gap-2 align-items-center">
      <span v-if="student">{{ student.name + ' ' + student.surname }}'s Attendances</span>
      <span v-else>Loading...</span>
      <input type="text" v-model="search" placeholder="Filter by subject..." class="form-control form-control-sm"/>
      <input type="date" v-model="filterDate" class="form-control form-control-sm"/>
    </div>

    <div class="card-body p-0">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
        <tr>
          <th>#</th>
          <th>Subject</th>
          <th>Date</th>
          <th>Present</th>
          <th>Notes</th>
          <th
              v-if="authStore.loggedInUser?.role === ROLES.ADMIN"
          >Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="filteredAttendances.length === 0">
          <td colspan="6" class="text-center py-3 text-muted">No attendance found.</td>
        </tr>
        <tr v-for="(att, index) in filteredAttendances" :key="att.id">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link :to="{name:'subject-details',params:{id:att.subjectId}}">{{ att.subjectName }}

            </router-link>
          </td>
          <td>{{ att.date }}</td>
          <td>
              <span :class="att.present ? 'badge bg-success' : 'badge bg-danger'">
                {{ att.present ? 'Present' : 'Absent' }}
              </span>
          </td>
          <td>{{ att.notes }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="openEditModal(att)"
                    v-if="authStore.loggedInUser?.role === ROLES.ADMIN"
            >
              <i class="bi bi-pencil"></i> Edit
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Attendance</h5>
          <button type="button" class="btn-close" @click="showEditModal=false"></button>
        </div>
        <div class="modal-body">
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" v-model="editingAttendance.present" id="editPresent">
            <label class="form-check-label" for="editPresent">Present</label>
          </div>
          <div class="mb-3">
            <label for="editNotes" class="form-label">Notes</label>
            <textarea class="form-control" id="editNotes" rows="3" v-model="editingAttendance.notes"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showEditModal=false">Cancel</button>
          <button class="btn btn-primary" @click="updateAttendance">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showEditModal" class="modal-backdrop fade show"></div>
</template>

<style scoped>
.card {
  border-radius: 0.75rem;
}

.card-header {
  font-weight: 600;
  font-size: 1.1rem;
}

.modal-backdrop {
  z-index: 1040;
}

.modal {
  z-index: 1050;
}
</style>
