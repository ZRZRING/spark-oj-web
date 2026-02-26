import service from "@/utils/service.ts";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {
    loginData,
    loginReq,
    loginRes,
    getProfileReq,
    getProfileRes,
    registerReq,
    registerRes,
    getProfileData,
    getAdminProtectedReq,
    getAdminProtectedRes,
    userRole
} from "@/stores/user_type.ts";

export const useUserStore = defineStore("user", () => {
    const token = ref(localStorage.getItem("token"));
    const adminRole = ref<userRole | null>(null);
    const isLoggedIn = computed(() => !!token.value);
    const isAdmin = computed(() => adminRole.value === 'admin');

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        token.value = null;
        adminRole.value = null;
    };

    const login = async (req: loginReq): Promise<loginData> => {
        const res = await service.post<loginReq, loginRes>("/login", req);
        token.value = res.data.token;
        localStorage.setItem("token", res.data.token);
        adminRole.value = null;
        localStorage.setItem("username", req.username);
        return res.data;
    };

    const checkAdminAccess = async (): Promise<boolean> => {
        if (!token.value) {
            adminRole.value = null;
            return false;
        }
        const res = await service.get<getAdminProtectedReq, getAdminProtectedRes>("/admin/protected");
        adminRole.value = res.data.user_role;
        localStorage.setItem("username", res.data.username);
        return res.data.user_role === 'admin';
    };

    const register = async (req: registerReq) => {
        const res = await service.post<registerReq, registerRes>("/register", req);
        return res.data!;
    };

    const getProfile = async (username: string): Promise<getProfileData> => {
        const res = await service.get<getProfileReq, getProfileRes>(`/profile/${username}`);
        return res.data!;
    };

    return {isLoggedIn, isAdmin, login, logout, register, getProfile, checkAdminAccess};
});
