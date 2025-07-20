import type { response } from ".";

export interface problemSetReq {
  pid: string;
  type: string;
}

export interface problemSetRes extends response {
  data: null | {
    total: number;
    problems: problemSetReq[];
  };
}
