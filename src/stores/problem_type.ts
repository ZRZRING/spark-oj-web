import type {pageInfoReq, pageInfoRes, response} from "./type";

export interface problem {
    pid: string;
    title: string;
}

export interface getProblemsReq extends pageInfoReq {
}

export interface getProblemsData extends pageInfoRes {
    problems: problem[];
}

export interface getProblemsRes extends response<getProblemsData> {
}

export interface problemDetailReq {
    pid: string;
    title: string;
    timeLimit: number;
    memoryLimit: number;
    total: number;
    accepted: number;
    difficulty: string;
    uploader: string;
    text: string;
    type: string;
    tag: string[];
}
