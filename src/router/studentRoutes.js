import StudentListingView from "@/views/student/StudentListingView.vue";
import CreateStudentView from "@/views/student/CreateStudentView.vue";
import UpdateStudentView from "@/views/student/UpdateStudentView.vue";
import StudentDetailsView from "@/views/student/StudentDetailsView.vue";
import StudentSubjectsView from "@/views/student/my/StudentSubjectsView.vue";
import StudentsByClassNumberView from "@/views/student/my/StudentsByClassNumberView.vue";
import {ROLES} from "@/composables/useAdministration.js";

export default [
    {
        path: "/students",
        name: "students",
        component: StudentListingView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/students/create',
        name: 'create-student',
        component: CreateStudentView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]
        }
    }, {
        path: '/students/modify/:id',
        name: 'edit-student',
        component: UpdateStudentView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]

        }
    },
    {
        path: '/students/details/:id',
        name: 'student-details',
        component: StudentDetailsView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN, ROLES.TEACHER]
        }
    }, {
        path: '/students/details/:id/my-subjects',
        name: 'student-subjects',
        component: StudentSubjectsView,
        meta: {
            requireAuth: true,

        }
    },
    {
        path: '/students-by-class-number/:classNumber',
        name: 'students-by-class-number',
        component: StudentsByClassNumberView,
        meta: {
            requireAuth: true,

        }
    }
]