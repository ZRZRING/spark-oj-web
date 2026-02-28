import {defineStore} from "pinia";
import service from "@/utils/service.ts";
import type {pageInfoReq, pageInfoRes, response} from "@/stores/type.ts";

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

export const useSubmissionStore = defineStore("submission", () => {
    const getSubmissions = async (req: getSubmissionsReq) => {
        const res = await service.get<getSubmissionsReq, getSubmissionsRes>("/judges", {params: req});
        return res.data!;
    };

    return {getSubmissions}
});
