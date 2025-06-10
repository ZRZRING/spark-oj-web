import type { response } from ".";

export interface userProfile {
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
  data: null | userProfile;
}
