import { defineStore } from "pinia";
import service from "@/utils/service.ts";
import type { response } from "@/stores/type.ts";

export interface submitCodeReq {
    code: string;
    username: string;
    problemId: string;
    language: string;
    contestId?: string;
}

export interface submitCodeData {
    submissionId: string;
    result: string;
}

export interface submitCodeRes extends response<submitCodeData> {}

export const useCoreStore = defineStore("core", () => {
    const submitCode = async (req: submitCodeReq): Promise<submitCodeData> => {
        const res = await service.post<submitCodeReq, submitCodeRes>("/judge", req);
        return res.data!;
    };

    return { submitCode };
});
