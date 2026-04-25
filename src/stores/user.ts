import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { loginApi, checkAdminAccessApi, type userRole, type loginReq } from "@/api/user.ts";

export type { userRole } from "@/api/user.ts";

export const useUserStore = defineStore("user", () => {
    const token = ref(localStorage.getItem("token"));
    const username = ref(localStorage.getItem("username"));
    const adminRole = ref<userRole | null>(null);
    const isLoggedIn = computed(() => !!token.value);
    const isAdmin = computed(() => adminRole.value === 'admin');

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        token.value = null;
        username.value = null;
        adminRole.value = null;
    };

    const login = async (req: loginReq) => {
        const data = await loginApi(req);
        token.value = data.token;
        localStorage.setItem("token", data.token);
        adminRole.value = null;
        username.value = req.username;
        localStorage.setItem("username", req.username);
    };

    const checkAdminAccess = async (): Promise<boolean> => {
        if (!token.value) {
            adminRole.value = null;
            return false;
        }
        const data = await checkAdminAccessApi();
        adminRole.value = data.userRole;
        username.value = data.username;
        localStorage.setItem("username", data.username);
        return data.userRole === 'admin';
    };

    return { token, username, adminRole, isLoggedIn, isAdmin, login, logout, checkAdminAccess };
});
