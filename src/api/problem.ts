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

export interface problemDetail {
    problemId: string;
    title: string;
    judgeType: string;
    rating: number;
    timeLimit: number;
    memoryLimit: number;
    createBy: string;
    content: string;
}

export interface testcaseItem {
    name: string;
    inputSize: number;
    outputSize: number;
}

// 获取题目列表
export interface getProblemsReq extends pageInfoReq {}
export interface getProblemsRes extends response<getProblemsData> {}
export interface getProblemsData extends pageInfoRes {
    problems: problem[];
}
export const getProblems = async (req: getProblemsReq): Promise<getProblemsData> => {
    const res = await service.get<getProblemsReq, getProblemsRes>("/problems", { params: req });
    return res.data!;
};

// 获取题目详情
export interface getProblemDetailReq {
    problemId: string;
}
export interface getProblemDetailRes extends response<getProblemDetailData> {}
export interface getProblemDetailData extends problemDetail {}
export const getProblemDetail = async (req: getProblemDetailReq): Promise<getProblemDetailData> => {
    const res = await service.get<getProblemDetailReq, getProblemDetailRes>(`/problem/${req.problemId}`);
    return res.data!;
};

// 创建题目
export interface createProblemReq extends Omit<problemDetail, "problemId"> {}
export interface createProblemRes extends response<void> {}
export const createProblem = async (req: createProblemReq): Promise<void> => {
    await service.post<createProblemReq, createProblemRes>("/problem", req);
};

// 更新题目
export interface updateProblemReq extends Omit<problemDetail, "createBy"> {}
export interface updateProblemRes extends response<void> {}
export const updateProblem = async (req: updateProblemReq): Promise<void> => {
    await service.put<updateProblemReq, updateProblemRes>(`/problem/${req.problemId}`, req);
};

// 上传测试用例
export interface uploadTestcasesReq {}
export interface uploadTestcasesRes extends response<uploadTestcasesData> {}
export interface uploadTestcasesData {
    path: string;
}
export const uploadTestcases = async (problemId: string, files: File[]): Promise<uploadTestcasesData> => {
    const formData = new FormData()
    files.forEach(file => formData.append('testcases', file))
    formData.append('problemId', problemId)
    const res = await service.post<uploadTestcasesReq, uploadTestcasesRes>("/upload/testcases", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data!;
};

// 获取测试用例列表
export interface getTestcasesReq {}
export interface getTestcasesRes extends response<getTestcasesData> {}
export interface getTestcasesData {
    testcases: testcaseItem[];
}
export const getTestcases = async (problemId: string): Promise<getTestcasesData> => {
    const res = await service.get<getTestcasesReq, getTestcasesRes>(`/testcases/${problemId}`);
    return res.data!;
};

// 删除测试用例
export interface deleteTestcaseReq {}
export interface deleteTestcaseRes extends response<void> {}
export const deleteTestcase = async (problemId: string, name: string): Promise<void> => {
    await service.delete<deleteTestcaseReq, deleteTestcaseRes>(`/testcases/${problemId}/${name}`);
};
