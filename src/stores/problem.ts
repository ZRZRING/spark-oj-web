import {defineStore} from "pinia";
import service from "@/utils/service.ts";
import type {pageInfoReq, pageInfoRes, response} from "@/stores/type.ts";

export interface problem {
    pid: string;
    title: string;
}

export interface getProblemsReq extends pageInfoReq {
}

export interface getProblemsData extends pageInfoRes {
    problems: problem[];
}

export interface getProblemsRes extends response<getProblemsData> {
}

export interface problemDetailReq {
    pid: string;
    title: string;
    timeLimit: number;
    memoryLimit: number;
    total: number;
    accepted: number;
    difficulty: string;
    uploader: string;
    text: string;
    type: string;
    tag: string[];
}

export const useProblemStore = defineStore("problem", () => {
    const getProblems = async (req: getProblemsReq): Promise<getProblemsData> => {
        const res = await service.get<getProblemsReq, getProblemsRes>("/problems", {params: req});
        return res.data!;
    }

    return {getProblems}
})
