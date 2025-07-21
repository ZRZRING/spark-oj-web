import type { response } from ".";

export interface problemSetReq {
  pid: string;
  type: string;
}

export interface problemDetailReq {
  pid: string;
  title: string;
  text: string;
  timeLimit: number;
  memoryLimit: number;
  type: string;
  total: number;
  accepted: number;
  difficulty: string;
  uploader: string;
  tag: string[];
}

export interface problemSetRes extends response {
  data: null | {
    total: number;
    problems: problemSetReq[];
  };
}
