import { defineStore } from "pinia";
import service from "@/utils/service.ts";
import type { pageInfoReq, pageInfoRes, response } from "@/stores/type.ts";

export interface submission {
    submissionId: string;
    problemId: string;
    contestId: string;
    username: string;
    result: string;
    language: string;
    memoryCost: number;
    timeCost: number;
    createTime: number;
}

export interface getSubmissionsReq extends pageInfoReq {}

export interface getSubmissionsData extends pageInfoRes {
    submissions: submission[];
}

export interface getSubmissionsRes extends response<getSubmissionsData> {}

export interface submissionDetail extends submission {
    code: string;
}

export interface getSubmissionRes extends response<submissionDetail> {}

export const useSubmissionStore = defineStore("submission", () => {
    const getSubmissions = async (req: getSubmissionsReq) => {
        const res = await service.get<getSubmissionsReq, getSubmissionsRes>("/submissions", { params: req });
        return res.data!;
    };

    const getSubmission = async (submissionId: string) => {
        const res = await service.get<null, getSubmissionRes>(`/submission/${submissionId}`);
        return res.data!;
    };

    return { getSubmissions, getSubmission };
});
