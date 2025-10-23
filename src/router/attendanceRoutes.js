import CrudAttendanceView from "@/views/attendance/CRUDAttendanceView.vue";
import AttendanceListingView from "@/views/attendance/AttendanceListingView.vue";
import StudentAttendances from "@/views/student/my/StudentAttendances.vue";
import {ROLES} from "@/composables/useAdministration.js";

export default [
    {
        path: '/attendance',
        name: 'attendance',
        component: AttendanceListingView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN, ROLES.TEACHER]
        }
    }
    ,
    {
        path: '/add-attendance',
        name: 'add-attendance',
        component: CrudAttendanceView,
        meta: {
            requireAuth: true,
            meta: [ROLES.ADMIN]
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