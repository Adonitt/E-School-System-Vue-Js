import AdminListingView from "@/views/admin/AdminListingView.vue";

export default [
    {
        path: '/admins',
        name: 'admins',
        component: AdminListingView,
        meta: {
            requireAuth: true
        }
    }
]