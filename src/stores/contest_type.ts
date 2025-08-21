import type {pageInfoReq, pageInfoRes, response} from "@/stores/type.ts";

export interface contest {
    cid: string;
    title: string;
    startTime: string;
    endTime: string;
    rules: string;
}

export interface contestsReq extends pageInfoReq {
}

export interface contestsResData extends pageInfoRes {
    contests: contest[];
}

export interface contestsRes extends response<contestsResData> {
}
