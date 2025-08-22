import service from "@/utils/service.ts";
import {defineStore} from "pinia";
import type {getProblemsData, getProblemsReq, getProblemsRes} from "./problem_type";

export const useProblemStore = defineStore("problem", () => {
    const getProblems = async (req: getProblemsReq): Promise<getProblemsData> => {
        const res = await service.get<getProblemsReq, getProblemsRes>("/problems", {params: req});
        return res.data!;
    }

    return {getProblems}
})

