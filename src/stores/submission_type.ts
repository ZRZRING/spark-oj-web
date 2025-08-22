import type {pageInfoReq, pageInfoRes, response} from "./type";

export interface submission {
    sid: string;
    title: string;
}

export interface getSubmissionsReq extends pageInfoReq {
}

export interface getSubmissionsData extends pageInfoRes {
    submissions: submission[];
}

export interface getSubmissionsRes extends response<getSubmissionsData> {
}
