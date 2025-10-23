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
import attendanceRoutes from "@/router/attendanceRoutes.js";
import gradeRoutes from "@/router/gradeRoutes.js";
import {useAppToast} from "@/composables/useAppToast.js";
import NotFoundPageView from "@/views/NotFoundPageView.vue";
import {ROLES} from "@/composables/useAdministration.js";

const routes = [
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFoundPageView
    }
    ,
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
    ...attendanceRoutes,
    ...gradeRoutes
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();
    const user = authStore.loggedInUser;

    const studentRestrictedRoutes = [
        'student-subjects',
        'student-grades',
        'student-attendances'
    ];

    if (user?.role === ROLES.STUDENT && to.params?.id && studentRestrictedRoutes.includes(to.name)) {
        const ownId = String(user.id);
        const requestedId = String(to.params.id);

        if (requestedId !== ownId) {
            useAppToast().showError("You can only access your own data!");
            return {
                name: to.name,
                params: {...to.params, id: ownId},
                replace: true
            };
        }
    }

    if (to.meta.roles && to.meta.roles.length > 0 && user) {
        const isAllowed = to.meta.roles.includes(user.role);
        if (!isAllowed) {
            useAppToast().showError('Access Denied: You do not have the required role for this page.');
            return {name: 'home'};
        }
    }

    const publicPages = ['login', 'register', 'forgot-password'];
    if (to.meta.requireAuth && !user) {
        return {name: 'login', query: {redirect: to.fullPath}};
    } else if (publicPages.includes(to.name) && user) {
        return {name: 'home'};
    }

    return true;
});


export default router;
