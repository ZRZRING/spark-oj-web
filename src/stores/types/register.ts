import type { response } from ".";

export interface registerReq {
  username: string;
  password: string;
  repassword: string;
}

export interface registerRes extends response {
  data: null;
}