<script setup>
import {computed, onMounted, ref} from "vue";
import {useLoading} from "@/composables/useLoading.js";
import {useAppToast} from "@/composables/useAppToast.js";
import AttendanceService from "@/services/attendanceService.js";
import StudentService from "@/services/studentService.js";
import SubjectService from "@/services/subjectService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";

const attendances = ref([]);
const search = ref("");
const filterDate = ref(""); // ✅ shtimi për filter date
const {withLoading} = useLoading();
const {showError, showSuccess, showDialog} = useAppToast();

const breadcrumbs = [
  {label: "Dashboard", to: {name: "home"}},
  {label: "Attendance List"},
];

const loadAllAttendances = async () => {
  await withLoading(async () => {
    try {
      const data = await AttendanceService.getAllAttendances();
      attendances.value = await Promise.all(
          data.map(async (a) => {
            const student = await StudentService.getStudentById(a.studentId);
            const subject = await SubjectService.getSubjectById(a.subjectId);
            return {
              ...a,
              studentName: student.name + " " + student.surname,
              subjectName: subject.name,
            };
          })
      );
    } catch (err) {
      showError(err.response?.data?.message || "An unexpected error occurred.");
    }
  });
};

// ✅ computed property për search + date filter
const filteredAttendances = computed(() => {
  return attendances.value.filter((a) => {
    const matchesSearch =
        a.studentName.toLowerCase().includes(search.value.toLowerCase()) ||
        a.subjectName.toLowerCase().includes(search.value.toLowerCase());

    const matchesDate = filterDate.value
        ? a.date === filterDate.value
        : true;

    return matchesSearch && matchesDate;
  });
});


onMounted(loadAllAttendances);
</script>

<template>
  <bread-crumb :items="breadcrumbs"/>

  <div class="card shadow-sm mt-4">
    <div class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
      <h5 class="mb-0">Attendance List</h5>

      <div class="d-flex gap-2 flex-wrap">
        <input
            v-model="search"
            type="text"
            placeholder="Search by student or subject..."
            class="form-control form-control-sm"
        />
        <!-- ✅ filter per date -->
        <input
            v-model="filterDate"
            type="date"
            class="form-control form-control-sm"
        />
      </div>
    </div>

    <div class="card-body p-0">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
        <tr>
          <th scope="col" style="width: 5%">#</th>
          <th scope="col" style="width: 25%">Student</th>
          <th scope="col" style="width: 25%">Subject</th>
          <th scope="col" style="width: 15%">Present</th>
          <th scope="col" style="width: 15%">Date</th>
          <th scope="col" style="width: 15%">Notes</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="filteredAttendances.length === 0">
          <td colspan="7" class="text-center py-3 text-muted">
            No attendance records found.
          </td>
        </tr>

        <tr v-for="(item, index) in filteredAttendances" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link
                :to="{ name: 'student-details', params: { id: item.studentId } }"
                class="text-decoration-none fw-semibold"
            >
              {{ item.studentName }}
            </router-link>
          </td>

          <td>
            <router-link
                :to="{ name: 'subject-details', params: { id: item.subjectId } }"
                class="text-decoration-none fw-semibold"
            >
              {{ item.subjectName }}
            </router-link>
          </td>

          <td>
              <span
                  class="badge px-3 py-2"
                  :class="item.present ? 'bg-success' : 'bg-danger'"
              >
                {{ item.present ? 'Present' : 'Absent' }}
              </span>
          </td>

          <td>{{ item.date }}</td>
          <td>{{ item.notes }}</td>


        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
