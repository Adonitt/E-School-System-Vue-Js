import {useAuthStore} from "@/stores/authStore.js";
import {computed} from "vue";

export const ROLES = {
    ADMIN: 'ADMINISTRATOR',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT'
}


export const useAdministration = () => {
    const authStore = useAuthStore()
    const isAdmin = computed(() => authStore.isLoggedIn?.role === ROLES.ADMIN)
    return {isAdmin}
}