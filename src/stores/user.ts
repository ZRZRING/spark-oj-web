import {defineStore} from "pinia";
import {computed, ref} from "vue";
import service from "@/utils/service.ts";
import type {response} from "@/stores/type.ts";

export interface profile {
    nickname: string;
    email: string;
    avatar: string;
    sex: string;
    school: string;
    department: string;
    major: string;
    description: string;
}

export interface loginReq {
    username: string;
    password: string;
}

export interface loginData {
    token: string;
}

export interface loginRes extends response<loginData> {
}

export interface registerReq {
    username: string;
    password: string;
    rePassword: string;
}

export interface registerRes extends response {
}

export interface getProfileReq {
    username: string;
}

export interface getProfileData extends profile {
}

export interface getProfileRes extends response<getProfileData> {
}

export type userRole = 'admin' | 'user';

export interface getAdminProtectedReq {
}

export interface getAdminProtectedData {
    username: string;
    userRole: userRole;
}

export interface getAdminProtectedRes extends response<getAdminProtectedData> {
}

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

    const login = async (req: loginReq): Promise<loginData> => {
        const res = await service.post<loginReq, loginRes>("/login", req);
        token.value = res.data.token;
        localStorage.setItem("token", res.data.token);
        adminRole.value = null;
        username.value = req.username;
        localStorage.setItem("username", req.username);
        return res.data;
    };

    const checkAdminAccess = async (): Promise<boolean> => {
        if (!token.value) {
            adminRole.value = null;
            return false;
        }
        const res = await service.get<getAdminProtectedReq, getAdminProtectedRes>("/admin/protected");
        adminRole.value = res.data.userRole;
        username.value = res.data.username;
        localStorage.setItem("username", res.data.username);
        return res.data.userRole === 'admin';
    };

    const register = async (req: registerReq) => {
        const res = await service.post<registerReq, registerRes>("/register", req);
        return res.data!;
    };

    const getProfile = async (username: string): Promise<getProfileData> => {
        const res = await service.get<getProfileReq, getProfileRes>(`/profile/${username}`);
        return res.data!;
    };

    return {token, username, adminRole, isLoggedIn, isAdmin, login, logout, register, getProfile, checkAdminAccess};
});
