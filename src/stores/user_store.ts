import request from "@/utils/request";
import { defineStore } from "pinia";
import { ref } from "vue";
import * as T from "./user_type";

export const useUserStore = defineStore("user", () => {
  let token = ref(localStorage.getItem("token"));

  const userLogout = () => {
    localStorage.removeItem("token");
    token.value = null;
  };

  const userLogin = async (req: T.loginReq) => {
    const res = await request.post<T.loginReq, T.loginRes>(
      "/login",
      req
    );
    if (res.code != 0 || res.data === null) {
      return Promise.reject(new Error(res.message));
    }
    token.value = res.data.token;
    localStorage.setItem("token", token.value);
  };

  const userRegister = async (req: T.registerReq) => {
    const res = await request.post<T.registerReq, T.registerRes>(
      "/register",
      req
    );
    if (res.code != 0) {
      return Promise.reject(new Error(res.message));
    }
  };

  const userProfile = async (username: string): Promise<T.profile> => {
    const res = await request.get<T.profileReq, T.profileRes>(
      `/profile/${username}`
    );
    if (res.code != 0 || res.data == null) {
      return Promise.reject(new Error(res.message));
    }
    return res.data;
  };

  return { token, userLogin, userLogout, userRegister, userProfile };
});
