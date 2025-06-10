
import request from "@/utils/request";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { loginReq, loginRes } from "./types/login";
import type { registerReq, registerRes } from "./types/register";
import type { profileReq, profileRes, userProfile } from "./types/profile";

export const useUserStore = defineStore("user", () => {
  let token = ref(localStorage.getItem("token"));

  const userLogout = () => {
    localStorage.removeItem('token');
    token.value = null;
  };

  const userLogin = async (data: loginReq) => {
    const res = await request.post<loginReq, loginRes>("/login", data);
    if (res.code != 0 || res.data === null) {
      return Promise.reject(new Error(res.message));
    }
    token.value = res.data.token;
    localStorage.setItem("token", token.value);
  };

  const userRegister = async (data: registerReq) => {
    const res = await request.post<registerReq, registerRes>("/register", data);
    if (res.code != 0) {
      return Promise.reject(new Error(res.message));
    }
  };

  const userProfile = async (data: profileReq): Promise<userProfile> => {
    const res = await request.get<any, profileRes>(`/profile/${data.username}`);
    if (res.code != 0 || res.data == null) {
      return Promise.reject(new Error(res.message));
    }
    return res.data;
  };

  return { token, userLogin, userLogout, userRegister, userProfile };
});
