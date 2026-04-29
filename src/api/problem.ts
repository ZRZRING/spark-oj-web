import service from "@/utils/service.ts";
import type { pageInfoReq, pageInfoRes, response } from "@/api/type.ts";

export interface problem {
    problemId: string;
    title: string;
    judgeType: string;
    rating: number;
    acceptCount: number;
    submitCount: number;
    createBy: string;
    createTime: string;
}

export interface problemDetail extends problem {
    timeLimit: number;
    memoryLimit: number;
    createBy: string;
    content: string;
}

export interface getProblemsReq extends pageInfoReq {}

export interface getProblemsData extends pageInfoRes {
    problems: problem[];
}

export interface getProblemsRes extends response<getProblemsData> {}

export interface getProblemDetailReq {
    problemId: string;
}

export interface getProblemDetailData extends problemDetail {}

export interface getProblemDetailRes extends response<getProblemDetailData> {}

export interface createProblemReq extends Omit<problemDetail, "problemId" | "createTime" | "acceptCount" | "submitCount"> {}

export interface createProblemData {}

export interface createProblemRes extends response<createProblemData> {}

export interface updateProblemReq extends Omit<problemDetail, "createBy" | "createTime" | "acceptCount" | "submitCount"> {}

export interface updateProblemData {}

export interface updateProblemRes extends response<updateProblemData> {}

export const getProblems = async (req: getProblemsReq): Promise<getProblemsData> => {
    const res = await service.get<getProblemsReq, getProblemsRes>("/problems", { params: req });
    return res.data!;
};

export const getProblemDetail = async (req: getProblemDetailReq): Promise<getProblemDetailData> => {
    const res = await service.get<getProblemDetailReq, getProblemDetailRes>(`/problem/${req.problemId}`);
    return res.data!;
};

export const createProblem = async (req: createProblemReq): Promise<createProblemData> => {
    const res = await service.post<createProblemReq, createProblemRes>("/problem", req);
    return res.data!;
};

export const updateProblem = async (req: updateProblemReq): Promise<updateProblemData> => {
    const res = await service.put<updateProblemReq, updateProblemRes>(`/problem/${req.problemId}`, req);
    return res.data!;
};

export const uploadTestcases = async (problemId: string, files: File[]) => {
    const formData = new FormData()
    files.forEach(file => formData.append('testcases', file))
    formData.append('problemId', problemId)
    const res = await service.post<null, response<{ path: string }>>("/upload/testcases", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data!
};

export interface testcaseItem {
    name: string;
    inputSize: number;
    outputSize: number;
}

export const getTestcases = async (problemId: string): Promise<testcaseItem[]> => {
    const res = await service.get<null, response<{ testcases: testcaseItem[] }>>(`/testcases/${problemId}`);
    return res.data?.testcases ?? [];
};

export const deleteTestcase = async (problemId: string, name: string): Promise<void> => {
    await service.delete<null, response<void>>(`/testcases/${problemId}/${name}`);
};
