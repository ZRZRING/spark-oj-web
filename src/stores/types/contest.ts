import type { response } from ".";

export interface contestSetReq {
  cid: string;
  title: string;
  startTime: string;
  endTime: string;
  rules: string;
}

export interface contestSetRes extends response {
  data: null | {
    total: number;
    contests: contestSetReq[];
  };
}
