import AdminListingView from "@/views/admin/AdminListingView.vue";
import AdminEditingView from "@/views/admin/AdminEditingView.vue";
import AdminDetailsView from "@/views/admin/AdminDetailsView.vue";

export default [
    {
        path: '/admins',
        name: 'admins',
        component: AdminListingView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admins/modify/:id',
        name: 'edit-admin',
        component: AdminEditingView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/admins/details/:id',
        name: 'admin-details',
        component: AdminDetailsView,
        meta: {
            requireAuth: true
        }
    }
]