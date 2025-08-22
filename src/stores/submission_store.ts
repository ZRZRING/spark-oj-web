import service from "@/utils/service.ts";
import {defineStore} from "pinia";
import type {getSubmissionsReq, getSubmissionsRes} from "@/stores/submission_type.ts";

export const useSubmissionStore = defineStore("submission", () => {
    const getSubmissions = async (req: getSubmissionsReq) => {
        const res = await service.get<getSubmissionsReq, getSubmissionsRes>("/judges", {params: req});
        return res.data!;
    };

    return {getSubmissions}
});

