import AuthView from "@/views/auth/AuthView.vue";
import {createRouter, createWebHistory} from "vue-router";
import TheContainer from "@/components/ui/TheContainer.vue";
import {useAuthStore} from "@/stores/authStore.js";
import adminRoutes from "@/router/adminRoutes.js";
import MyProfileView from "@/views/profile/MyProfileView.vue";
import teacherRoutes from "@/router/teacherRoutes.js";
import studentRoutes from "@/router/studentRoutes.js";
import ChangePasswordView from "@/views/auth/ChangePasswordView.vue";
import subjectRoutes from "@/router/subjectRoutes.js";
import attendanceService from "@/services/attendanceService.js";
import attendanceRoutes from "@/router/attendanceRoutes.js";

const routes = [
    {
        path: "/auth/login",
        name: 'login',
        component: AuthView,
        meta: {
            requireAuth: false
        }
    },
    {
        path: '/',
        name: 'home',
        component: TheContainer,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/my-profile',
        name: 'my-profile',
        component: MyProfileView,
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/change-password',
        name: 'change-password',
        component: ChangePasswordView,
        meta: {
            requireAuth: true
        }
    },
    ...adminRoutes,
    ...teacherRoutes,
    ...studentRoutes,
    ...subjectRoutes,
    ...attendanceRoutes
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});


router.beforeEach(async (to, from) => {
    const authStore = useAuthStore()

    const publicPages = ['login', 'register', 'forgot-password'];
    if (to.meta.requireAuth && !authStore.isLoggedIn) {
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        }
    } else if (publicPages.includes(to.name) && authStore.isLoggedIn) {
        return {
            name: 'home'
        }
    }
    return true;

})

export default router;
