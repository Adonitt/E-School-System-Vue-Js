import AdminListingView from "@/views/admin/AdminListingView.vue";
import AdminEditingView from "@/views/admin/AdminEditingView.vue";
import AdminDetailsView from "@/views/admin/AdminDetailsView.vue";
import AdminCreateView from "@/views/admin/AdminCreateView.vue";
import {ROLES} from "@/composables/useAdministration.js";

export default [
    {
        path: '/admins',
        name: 'admins',
        component: AdminListingView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN, ROLES.TEACHER],

        }
    },
    {
        path: '/admins/modify/:id',
        name: 'edit-admin',
        component: AdminEditingView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]

        }
    },
    {
        path: '/admins/details/:id',
        name: 'admin-details',
        component: AdminDetailsView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN, ROLES.TEACHER],
        }
    },
    {
        path: '/admins/create',
        name: 'create-admin',
        component: AdminCreateView,
        meta: {
            requireAuth: true,
            roles: [ROLES.ADMIN]
        }
    }
]