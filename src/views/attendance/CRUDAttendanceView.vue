<script setup>
import BreadCrumb from "@/components/shared/BreadCrumb.vue";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import SubjectService from "@/services/subjectService.js";
import AttendanceService from "@/services/attendanceService.js";
import AppInput from "@/components/app/AppInput.vue";
import AppSelect from "@/components/app/AppSelect.vue";
import {useAppToast} from "@/composables/useAppToast.js";

const breadcrumbs = [
  {label: 'Dashboard', to: {name: 'home'}},
  {label: 'Attendance List', to: {name: 'attendance'}},
  {label: 'Add Attendance for Student'}
];

const subject = ref(null);
const studentOptions = ref([]);
const selectedStudent = ref(null);
const present = ref(false);
const attendanceDate = ref("");
const notes = ref("");
const attendances = ref([]);
const filterDate = ref("");

const editingAttendance = ref(null);
const showEditModal = ref(false);

const route = useRoute();
const subjectId = route.query.subjectId;

const {showError, showSuccess, showDialog} = useAppToast();

const loadSubject = async (id) => {
  try {
    subject.value = await SubjectService.getSubjectById(id);
    studentOptions.value = subject.value.studentNames.map((name, index) => ({
      label: name,
      value: subject.value.students[index]
    }));

    await loadAttendances();
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to load subject');
  }
};

const loadAttendances = async () => {
  try {
    const all = await AttendanceService.attendanceBySubjectId(subjectId);
    attendances.value = all.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to load attendances');
  }
};

const submitAttendance = async () => {
  if (!selectedStudent.value || !attendanceDate.value) {
    showError("Please select a student or a date.");
    return;
  }

  try {
    await AttendanceService.addAttendance({
      studentId: selectedStudent.value,
      subjectId: subject.value.id,
      present: present.value,
      date: attendanceDate.value,
      notes: notes.value
    });

    const student = studentOptions.value.find(s => s.value === selectedStudent.value)?.label;
    showSuccess(`Attendance for student: ${student} on ${subject.value.name} for date ${attendanceDate.value} added successfully!`);

    await loadAttendances();

    selectedStudent.value = null;
    present.value = false;
    notes.value = "";
    attendanceDate.value = "";
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to add attendance');
  }
};

const filteredAttendances = computed(() => {
  if (!filterDate.value) return attendances.value;
  return attendances.value.filter(a => a.date === filterDate.value);
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

    const student = studentOptions.value.find(s => s.value === editingAttendance.value.studentId)?.label;
    const date = editingAttendance.value.date;

    showSuccess(`Attendance for student: ${student} on ${subject.value.name} for date ${date} updated successfully!`);
    await loadAttendances();
    showEditModal.value = false;
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to update attendance');
  }
};

const removeAttendance = async (id) => {
  const att = attendances.value.find(a => a.id === id);
  if (!att) return;

  const result = showDialog(`Are you sure you want to delete attendance for ${studentOptions.value.find(s => s.value === att.studentId)?.label} on ${att.date}?`)
  if ((await result).isConfirmed) {
    try {
      await AttendanceService.deleteAttendance(id);

      const student = studentOptions.value.find(s => s.value === att.studentId)?.label;
      const date = att.date;

      showSuccess(`Attendance for student: ${student} on ${subject.value.name} for date ${date} removed successfully!`);
      await loadAttendances();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete attendance");
    }
  }
};


onMounted(async () => {
  await loadSubject(subjectId);
});

</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="container mt-4">

    <div class="card shadow-sm border-0 mb-4 justify-content-between">
      <div class="card-header bg-light text-dark text-center">
        <h5 class="mb-0"><i class="bi bi-journal-plus"></i> Add Attendance on <b> {{ subject?.name }}</b></h5>
      </div>

      <form @submit.prevent="submitAttendance" class="card-body">
        <div class="row g-3">

          <AppInput id="subjectId" label="Subject ID" :value="subject?.id" disabled/>
          <AppInput id="subjectName" label="Subject Name" :value="subject?.name" disabled/>

          <AppSelect
              id="students"
              label="Select Student"
              v-model="selectedStudent"
              :options="studentOptions"
              placeholder="Choose a student..."
          />

          <div class="col-md-9">
            <label for="attendanceDate" class="form-label">Date</label>
            <input type="date" id="attendanceDate" class="form-control" v-model="attendanceDate"/>
          </div>

          <div class="col-md-3 d-flex align-items-center">
            <div class="form-check mt-3">
              <input type="checkbox" class="form-check-input" id="presentCheck" v-model="present"/>
              <label class="form-check-label" for="presentCheck">Present</label>
            </div>
          </div>

          <div class="col-12">
            <label for="notes" class="form-label">Notes</label>
            <textarea id="notes" class="form-control" v-model="notes" placeholder="Add Notes (Optional)" rows="3"/>
          </div>

          <div class="col-12 text-end mt-3">
            <button class="btn btn-primary" type="submit">
              <i class="bi bi-save"></i> Submit Attendance
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-light text-dark d-flex justify-content-between align-items-center">
        <h5 class="mb-0"><i class="bi bi-people"></i> Students with Attendance in Subject: <b>{{ subject?.name }}</b>
        </h5>
        <div>
          <input type="date" class="form-control" v-model="filterDate" placeholder="Filter by date"/>
        </div>
      </div>

      <div class="card-body p-4">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>Student</th>
            <th>Date</th>
            <th>Present</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="att in filteredAttendances" :key="att.id">
            <td>{{ studentOptions.find(s => s.value === att.studentId)?.label }}</td>
            <td>{{ att.date }}</td>
            <td>
  <span :class="att.present ? 'bg-success badge fw-bold' : 'bg-danger badge fw-bold'">
    {{ att.present ? 'Yes' : 'No' }}
  </span>
            </td>
            <td>{{ att.notes }}</td>
            <td class="d-flex gap-2">
              <button
                  class="btn btn-sm btn-warning d-flex align-items-center"
                  @click="openEditModal(att)">
                <i class="bi bi-pencil-fill me-1"></i>
              </button>

              <button
                  @click="removeAttendance(att.id)"
                  class="btn btn-sm btn-danger d-flex align-items-center"
              >
                <i class="bi bi-trash"></i>
              </button>


            </td>

          </tr>
          <tr v-if="filteredAttendances.length === 0">
            <td colspan="5" class="text-center">No attendance found for selected date.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-content p-4 bg-white shadow rounded">
        <h5 class="mb-3">Edit Attendance</h5>

        <div class="mb-3">
          <label>Present</label>
          <input type="checkbox" class="m-3" v-model="editingAttendance.present"/>
        </div>

        <div class="mb-3">
          <label>Notes</label>
          <textarea v-model="editingAttendance.notes" placeholder="Please write notes here ( Optional )" rows="3"
                    class="form-control"/>
        </div>

        <div class="text-end">
          <button class="btn btn-secondary me-2" @click="showEditModal=false">Cancel</button>
          <button class="btn btn-primary" @click="updateAttendance">Save</button>
        </div>
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

.btn {
  padding: 0.6rem 1.4rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.container {
  max-width: 800px;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.modal-content {
  width: 400px;
}
</style>
