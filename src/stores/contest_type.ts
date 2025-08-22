import type {pageInfoReq, pageInfoRes, response} from "@/stores/type.ts";

export interface contest {
    cid: string;
    title: string;
    startTime: string;
    endTime: string;
    rules: string;
}

export interface getContestsReq extends pageInfoReq {
}

export interface getContestsData extends pageInfoRes {
    contests: contest[];
}

export interface getContestsRes extends response<getContestsData> {
}
