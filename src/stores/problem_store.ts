import service from "@/utils/service.ts";
import type {problemsData, problemsReq, problemsRes} from "./problem_type";
import {defineStore} from "pinia";

export const useProblemStore = defineStore("problem", () => {
    const getProblems = async (req: problemsReq): Promise<problemsData> => {
        const res = await service.get<problemsReq, problemsRes>("/problems", {params: req});
        return res.data!;
    }

    const getProblemsAdmin = async (req: problemsReq) => {
        const res = await service.get<problemsReq, problemsRes>("/problems", {params: req});
        return res.data!;
    }

    return {getProblems, getProblemsAdmin}
})

