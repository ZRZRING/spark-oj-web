import type { response } from "./type"

export interface loginReq {
  username: string;
  password: string;
}

export interface loginRes extends response {
  data: null | { token: string };
}

export interface registerReq {
  username: string;
  password: string;
  repassword: string;
}

export interface registerRes extends response {}

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

export interface profileReq {
  username: string;
}

export interface profileRes extends response {
  data: null | profile;
}
