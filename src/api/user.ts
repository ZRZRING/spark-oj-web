import service from "@/utils/service.ts";
import type { response, pageInfoReq, pageInfoRes } from "@/api/type.ts";

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

export interface loginRes extends response<loginData> {}

export interface registerReq {
    username: string;
    password: string;
    rePassword: string;
}

export interface registerRes extends response {}

export interface getProfileReq {
    username: string;
}

export interface getProfileData extends profile {}

export interface getProfileRes extends response<getProfileData> {}

export type userRole = 'admin' | 'user';

export interface getAdminProtectedReq {}

export interface getAdminProtectedData {
    username: string;
    userRole: userRole;
}

export interface getAdminProtectedRes extends response<getAdminProtectedData> {}

export interface userItem {
    username: string;
    userRole: string;
    createTime: string;
    rating: string;
}

export interface getUsersReq extends pageInfoReq {
    keyword?: string;
}

export interface getUsersData extends pageInfoRes {
    users: userItem[];
}

export interface getUsersRes extends response<getUsersData> {}

export interface updateRoleReq {
    username: string;
    role: string;
}

export interface updateRoleRes extends response {}

export const loginApi = async (req: loginReq): Promise<loginData> => {
    const res = await service.post<loginReq, loginRes>("/login", req);
    return res.data!;
};

export const checkAdminAccessApi = async (): Promise<getAdminProtectedData> => {
    const res = await service.get<getAdminProtectedReq, getAdminProtectedRes>("/admin/protected");
    return res.data!;
};

export const register = async (req: registerReq) => {
    const res = await service.post<registerReq, registerRes>("/register", req);
    return res.data!;
};

export const getProfile = async (username: string): Promise<getProfileData> => {
    const res = await service.get<getProfileReq, getProfileRes>(`/profile/${username}`);
    return res.data!;
};

export const getUsers = async (req: getUsersReq): Promise<getUsersData> => {
    const res = await service.get<getUsersReq, getUsersRes>("/users", { params: req });
    return res.data!;
};

export const updateRole = async (req: updateRoleReq) => {
    const res = await service.put<updateRoleReq, updateRoleRes>("/users/role", req);
    return res.data!;
};
