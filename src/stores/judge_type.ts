import type { response } from "./type";

export interface judgeSetReq {
  cid: string;
  title: string;
  startTime: string;
  endTime: string;
  rules: string;
}

export interface judgeSetRes extends response {

  data: null | {
    total: number;
    judges: judgeSetReq[];
  };
}
