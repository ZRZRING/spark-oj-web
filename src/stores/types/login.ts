import type { response } from ".";

export interface loginReq {
  username: string;
  password: string;
}

export interface loginRes extends response {
  data: null | { token: string };
}
