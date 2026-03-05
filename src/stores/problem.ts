import { defineStore } from "pinia";
import service from "@/utils/service.ts";
import type { pageInfoReq, pageInfoRes, response } from "@/stores/type.ts";

export interface problem {
    pid: string;
    title: string;
    judgeType: number;
    rating: number;
}

export interface problemDetail extends problem {
    timeLimit: number;
    memoryLimit: number;
    createBy: string;
    content: string;
}

export interface getProblemsReq extends pageInfoReq {
}

export interface getProblemsData extends pageInfoRes {
    problems: problem[];
}

export interface getProblemsRes extends response<getProblemsData> {
}

export interface getProblemDetailReq {
    pid: string;
}

export interface getProblemDetailData extends problemDetail {
}

export interface getProblemDetailRes extends response<getProblemDetailData> {
}

export interface createProblemReq extends Omit<problemDetail, "pid"> {
}

export interface createProblemData {
}

export interface createProblemRes extends response<createProblemData> {
}

export interface updateProblemReq extends Omit<problemDetail, "createBy"> {
}

export interface updateProblemData {
}

export interface updateProblemRes extends response<updateProblemData> {
}

export const useProblemStore = defineStore("problem", () => {
    const getProblems = async (req: getProblemsReq): Promise<getProblemsData> => {
        const res = await service.get<getProblemsReq, getProblemsRes>("/problems", { params: req });
        return res.data!;
    }

    const getProblemDetail = async (req: getProblemDetailReq): Promise<getProblemDetailData> => {
        const res = await service.get<getProblemDetailReq, getProblemDetailRes>(`/problem/${req.pid}`);
        return res.data!;
    }

    const createProblem = async (req: createProblemReq): Promise<createProblemData> => {
        const res = await service.post<createProblemReq, createProblemRes>("/problem", req);
        return res.data!;
    }

    const updateProblem = async (req: updateProblemReq): Promise<updateProblemData> => {
        const res = await service.put<updateProblemReq, updateProblemRes>(`/problem/${req.pid}`, req);
        return res.data!;
    }

    return { getProblems, getProblemDetail, createProblem, updateProblem }
})
