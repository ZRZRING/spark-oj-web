import type {response} from "./type"

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
    user_role: userRole;
}

export interface getAdminProtectedRes extends response<getAdminProtectedData> {
}
