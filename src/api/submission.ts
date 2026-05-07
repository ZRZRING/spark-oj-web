import service from "@/utils/service.ts";
import type { pageInfoReq, pageInfoRes, response } from "@/api/type.ts";

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

export interface submissionDetail extends submission {
    code: string;
}

// 获取提交列表
export interface getSubmissionsReq extends pageInfoReq {}
export interface getSubmissionsRes extends response<getSubmissionsData> {}
export interface getSubmissionsData extends pageInfoRes {
    submissions: submission[];
}
export const getSubmissions = async (req: getSubmissionsReq): Promise<getSubmissionsData> => {
    const res = await service.get<getSubmissionsReq, getSubmissionsRes>("/submissions", { params: req });
    return res.data!;
};

// 获取提交详情
export interface getSubmissionReq {}
export interface getSubmissionRes extends response<getSubmissionData> {}
export interface getSubmissionData extends submissionDetail {}
export const getSubmission = async (submissionId: string): Promise<getSubmissionData> => {
    const res = await service.get<getSubmissionReq, getSubmissionRes>(`/submission/${submissionId}`);
    return res.data!;
};
