import type {pageInfoReq, pageInfoRes, response} from "./type";

export interface problem {
    pid: string;
    title: string;
    text: string;
    timeLimit: number;
    memoryLimit: number;
    type: string;
    total: number;
    accepted: number;
    difficulty: string;
    createBy: string;
}

export interface problemAdmin extends problem {
    created_at: string;
}

export interface problemsReq extends pageInfoReq {
}

export interface problemsData extends pageInfoRes {
    problems: problem[];
}

export interface problemsRes extends response<problemsData> {
}

export interface problemsAdminReq extends pageInfoReq {
}

export interface problemsAdminData extends pageInfoRes {
    problemsAdmin: problemAdmin[];
}

export interface problemsAdminRes extends response<problemsAdminData> {
}
