import service from "@/utils/service.ts";
import {defineStore} from "pinia";
import type {getContestsReq, getContestsRes, getContestsData} from "./contest_type"

export const useContestStore = defineStore("contest", () => {
    const getContests = async (req: getContestsReq): Promise<getContestsData> => {
        const res = await service.get<getContestsReq, getContestsRes>("/contests", {params: req});
        return res.data!;
    }

    return {getContests};
});
