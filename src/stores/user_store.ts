import service from "@/utils/service.ts";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import type {
    loginData,
    loginReq,
    loginRes,
    profileReq,
    profileRes,
    registerReq,
    registerRes
} from "@/stores/user_type.ts";

export const useUserStore = defineStore("user", () => {
    const token = ref(localStorage.getItem("token"));

    const isLoggedIn = computed(() => !!token.value);

    const logout = () => {
        localStorage.removeItem("token");
        token.value = null;
    };

    const login = async (req: loginReq): Promise<loginData> => {
        const res = await service.post<loginReq, loginRes>("/login", req);
        localStorage.setItem("token", res.data!.token);
        token.value = res.data!.token;
        return res.data!;
    };

    const register = async (req: registerReq) => {
        const res = await service.post<registerReq, registerRes>("/register", req);
        return res.data!;
    };

    const getProfile = async (username: string) => {
        const res = await service.get<profileReq, profileRes>(`/profile/${username}`);
        return res.data!;
    };

    return {login, logout, isLoggedIn, register, getProfile};
});
