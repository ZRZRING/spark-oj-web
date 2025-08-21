import type {pageInfoReq, pageInfoRes, response} from "./type";

export interface submission {
    cid: string;
    title: string;
    startTime: string;
    endTime: string;
    rules: string;
}

export interface submissionsReq extends pageInfoReq {
}

export interface submissionsData extends pageInfoRes {
    submissions: submission[];
}

export interface submissionsRes extends response<submissionsData> {
}
