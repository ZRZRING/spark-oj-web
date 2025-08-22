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
