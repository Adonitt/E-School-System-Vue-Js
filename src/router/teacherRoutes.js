import TeacherListingView from "@/views/teacher/TeacherListingView.vue";
import CreateTeacherView from "@/views/teacher/CreateTeacherView.vue";
import UpdateTeacherView from "@/views/teacher/UpdateTeacherView.vue";
import TeacherDetailsView from "@/views/teacher/TeacherDetailsView.vue";
import {ROLES} from "@/composables/useAdministration.js";

export default [
    {
        path: '/teachers',
        name: 'teachers',
        component: TeacherListingView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/teachers/details/:id',
        name: 'teacher-details',
        component: TeacherDetailsView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/teachers/create',
        name: 'create-teacher',
        component: CreateTeacherView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]
        }
    },
    {
        path: '/teachers/modify/:id',
        name: 'edit-teacher',
        component: UpdateTeacherView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]
        }
    }
]