import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {jwtDecode} from "jwt-decode";
import client from "@/helpers/client.js";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token"))
    const user = computed(() => token.value ? jwtDecode(token.value) : null)

    const login = async (userData) => {
        try {
            const response = await client.post('/auth/login', userData)

            if (response.data && response.data.token) {
                token.value = response.data.token;
                localStorage.setItem("token", token.value)
            } else {
                console.log("Login response did not contain token:", response)
                throw new Error("Login response did not contain token")
            }
        } catch (err) {
            console.log(err)
            throw err;
        }
    }

    const logout = () => {
        token.value = null;
        localStorage.removeItem("token")
    }

    const isLoggedIn = computed(() => {
        return token.value !== null;
    })

    const loggedInUser = computed(() => {
        return token.value ? jwtDecode(token.value) : null;
    })

    return {login, loggedInUser, isLoggedIn, logout, token}

})

