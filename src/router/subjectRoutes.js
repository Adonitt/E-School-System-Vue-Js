import SubjectListingView from "@/views/subjects/SubjectListingView.vue";
import CreateSubjectView from "@/views/subjects/CreateSubjectView.vue";
import UpdateStudentView from "@/views/student/UpdateStudentView.vue";
import SubjectDetailsView from "@/views/subjects/SubjectDetailsView.vue";
import UpdateSubjectView from "@/views/subjects/UpdateSubjectView.vue";
import {ROLES} from "@/composables/useAdministration.js";

export default [
    {
        path: '/subjects',
        name: 'subjects',
        component: SubjectListingView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/subjects/create',
        name: 'create-subject',
        component: CreateSubjectView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]
        }
    },
    {
        path: '/subjects/modify/:id',
        name: 'edit-subject',
        component: UpdateSubjectView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]
        }
    },
    {
        path: '/subjects/details/:id',
        name: 'subject-details',
        component: SubjectDetailsView,
        meta: {
            requireAuth: true
        }
    }
]