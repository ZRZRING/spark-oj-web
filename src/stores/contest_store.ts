import service from "@/utils/service.ts";
import type {contestsReq, contestsRes, contestsResData} from "./contest_type"
import {defineStore} from "pinia";

export const useContestStore = defineStore("contest", () => {
    const getContests = async (req: contestsReq): Promise<contestsResData> => {
        const res = await service.get<contestsReq, contestsRes>("/contests", {params: req});
        return res.data!;
    }

    return {getContests};
});
