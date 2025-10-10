import AuthView from "@/views/auth/AuthView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import {createRouter, createWebHistory} from "vue-router";
import TheContainer from "@/components/ui/TheContainer.vue";
import {useAuthStore} from "@/stores/authStore.js";
import adminRoutes from "@/router/adminRoutes.js";
import MyProfileView from "@/views/profile/MyProfileView.vue";
import teacherService from "@/services/teacherService.js";
import teacherRoutes from "@/router/teacherRoutes.js";
import studentRoutes from "@/router/studentRoutes.js";
import ChangePasswordView from "@/views/profile/ChangePasswordView.vue";

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
        path: '/auth/register',
        name: 'register',
        component: RegisterView,
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
    ...studentRoutes
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
