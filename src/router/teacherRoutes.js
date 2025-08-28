import TeacherListingView from "@/views/teacher/TeacherListingView.vue";

export default [
    {
        path: '/teachers',
        name: 'teachers',
        component: TeacherListingView,
        meta: {
            requireAuth: true
        }
    }
]