import GradeListingView from "@/views/grades/GradeListingView.vue";
import CRUDGradeView from "@/views/grades/CRUDGradeView.vue";

export default [
    {
        path: '/grades',
        name: 'grades',
        component: GradeListingView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/grades/add',
        name: 'add-grade',
        component: CRUDGradeView,
        meta: {
            requireAuth: true
        }
    }
]