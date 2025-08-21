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

export interface profileReq {
    username: string;
}

export interface profileData extends profile {
}

export interface profileRes extends response<profileData> {
}
