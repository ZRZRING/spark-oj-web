export interface authRequest {
  token: string;
}

export interface response<T = any> {
  code: number;
  message: string;
  data: T | null;
}

export interface pageInfo {
  page: number;
  size: number;
}