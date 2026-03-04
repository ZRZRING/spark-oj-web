import {defineStore} from "pinia";
import service from "@/utils/service.ts";
import type {pageInfoReq, pageInfoRes, response} from "@/stores/type.ts";

export interface problem {
    pid: string;
    title: string;
    judgeType: number;
    rating: number;
}

export interface getProblemsReq extends pageInfoReq {
}

export interface getProblemsData extends pageInfoRes {
    problems: problem[];
}

export interface getProblemsRes extends response<getProblemsData> {
}

export interface problemDetail {
    pid: string;
    title: string;
    judgeType: string;
    timeLimit: number;
    memoryLimit: number;
    rating: string;
    createBy: string;
    content: string;
}

export interface getProblemDetailReq {
    pid: string;
}

export interface getProblemDetailData extends problemDetail {
}

export interface getProblemDetailRes extends response<getProblemDetailData> {
}

export const useProblemStore = defineStore("problem", () => {
    const getProblems = async (req: getProblemsReq): Promise<getProblemsData> => {
        const res = await service.get<getProblemsReq, getProblemsRes>("/problems", {params: req});
        return res.data!;
    }

    const getProblemDetail = async (req: getProblemDetailReq): Promise<getProblemDetailData> => {
        const res = await service.get<getProblemDetailReq, getProblemDetailRes>(`/problem/${req.pid}`);
        return res.data!;
    }

    return {getProblems, getProblemDetail}
})
