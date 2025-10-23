import GradeListingView from "@/views/grades/GradeListingView.vue";
import CRUDGradeView from "@/views/grades/CRUDGradeView.vue";
import StudentGradesView from "@/views/student/my/StudentGradesView.vue";
import {ROLES} from "@/composables/useAdministration.js";

export default [
    {
        path: '/grades',
        name: 'grades',
        component: GradeListingView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN, ROLES.TEACHER]
        }
    },
    {
        path: '/grades/add',
        name: 'add-grade',
        component: CRUDGradeView,
        meta: {
            requireAuth: true,
            meta: [ROLES.TEACHER]
        }
    },
    {
        path: '/students/:id/grades',
        name: 'student-grades',
        component: StudentGradesView,
        meta: {
            requireAuth: true
        }
    }
]