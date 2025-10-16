import CrudAttendanceView from "@/views/attendance/CRUDAttendanceView.vue";
import AttendanceListingView from "@/views/attendance/AttendanceListingView.vue";
import StudentAttendances from "@/views/student/my/StudentAttendances.vue";

export default [
    {
        path: '/attendance',
        name: 'attendance',
        component: AttendanceListingView,
        meta: {
            requireAuth: true
        }
    }
    ,
    {
        path: '/add-attendance',
        name: 'add-attendance',
        component: CrudAttendanceView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/student/:id/attendance',
        name: 'student-attendances',
        component: StudentAttendances,
        meta: {
            requireAuth: true
        }
    }
]