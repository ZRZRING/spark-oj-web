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

export type userRole = 'root' | 'admin' | 'user' | 'locked';

export interface userItem {
    username: string;
    userRole: string;
    createTime: string;
    rating: string;
}

// 登录
export interface loginReq {
    username: string;
    password: string;
}
export interface loginRes extends response<loginData> {}
export interface loginData {
    token: string;
}
export const loginApi = async (req: loginReq): Promise<loginData> => {
    const res = await service.post<loginReq, loginRes>("/login", req);
    return res.data!;
};

// 注册
export interface registerReq {
    username: string;
    password: string;
    rePassword: string;
}
export interface registerRes extends response<void> {}
export interface registerData {}
export const register = async (req: registerReq): Promise<void> => {
    await service.post<registerReq, registerRes>("/register", req);
};

// 获取用户资料
export interface getProfileReq {}
export interface getProfileRes extends response<getProfileData> {}
export interface getProfileData extends profile {}
export const getProfile = async (username: string): Promise<getProfileData> => {
    const res = await service.get<getProfileReq, getProfileRes>(`/profile/${username}`);
    return res.data!;
};

// 检查管理员权限
export interface getAdminProtectedReq {}
export interface getAdminProtectedRes extends response<getAdminProtectedData> {}
export interface getAdminProtectedData {
    username: string;
    userRole: userRole;
}
export const checkAdminAccessApi = async (): Promise<getAdminProtectedData> => {
    const res = await service.get<getAdminProtectedReq, getAdminProtectedRes>("/admin/protected");
    return res.data!;
};

// 获取用户列表
export interface getUsersReq extends pageInfoReq {
    keyword?: string;
}
export interface getUsersRes extends response<getUsersData> {}
export interface getUsersData extends pageInfoRes {
    users: userItem[];
}
export const getUsers = async (req: getUsersReq): Promise<getUsersData> => {
    const res = await service.get<getUsersReq, getUsersRes>("/users", { params: req });
    return res.data!;
};

// 更新用户角色
export interface updateRoleReq {
    username: string;
    role: string;
}
export interface updateRoleRes extends response<void> {}
export interface updateRoleData {}
export const updateRole = async (req: updateRoleReq): Promise<void> => {
    await service.put<updateRoleReq, updateRoleRes>("/users/role", req);
};
