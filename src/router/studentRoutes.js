import StudentListingView from "@/views/student/StudentListingView.vue";
import CreateStudentView from "@/views/student/CreateStudentView.vue";
import UpdateStudentView from "@/views/student/UpdateStudentView.vue";
import StudentDetailsView from "@/views/student/StudentDetailsView.vue";

export default [
    {
        path: "/students",
        name: "students",
        component: StudentListingView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/students/create',
        name: 'create-student',
        component: CreateStudentView,
        meta: {
            requireAuth: true
        }
    }, {
        path: '/students/modify/:id',
        name: 'edit-student',
        component: UpdateStudentView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/students/details/:id',
        name: 'student-details',
        component: StudentDetailsView,
        meta: {
            requireAuth: true
        }
    }
]