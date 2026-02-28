import {defineStore} from "pinia";
import service from "@/utils/service.ts";
import type {pageInfoReq, pageInfoRes, response} from "@/stores/type.ts";

export interface contest {
    cid: string;
    title: string;
    practice: boolean;
    startTime: string;
    endTime: string;
}

export interface getContestsReq extends pageInfoReq {
}

export interface getContestsData extends pageInfoRes {
    contests: contest[];
}

export interface getContestsRes extends response<getContestsData> {
}

export const useContestStore = defineStore("contest", () => {
    const getContests = async (req: getContestsReq): Promise<getContestsData> => {
        const res = await service.get<getContestsReq, getContestsRes>("/contests", {params: req});
        return res.data!;
    }

    return {getContests};
});
