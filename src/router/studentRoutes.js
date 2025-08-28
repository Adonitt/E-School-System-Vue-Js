import StudentListingView from "@/views/student/StudentListingView.vue";

export default [
    {
        path: "/students",
        name: "students",
        component: StudentListingView,
        meta: {
            requireAuth: true
        }

    }
]