import { defineStore } from "pinia";
import service from "@/utils/service.ts";
import type { pageInfoReq, pageInfoRes, response } from "@/stores/type.ts";

export interface contest {
    contestId: string;
    title: string;
    practice: boolean;
    startTime: string;
    endTime: string;
}

export interface contestDetail {
    contestId: string;
    title: string;
    problems: number[];
    description: string;
    startTime: number;
    endTime: number;
    lockTime: number;
    createBy: string;
}

export interface contestProblem {
    problemId: string;
    title: string;
    judgeType: string;
    timeLimit: number;
    memoryLimit: number;
}

export interface contestProblemDetail {
    problemId: string;
    title: string;
    judgeType: string;
    timeLimit: number;
    memoryLimit: number;
    rating: number;
    content: string;
    contestId: string;
    contestTitle: string;
}

export interface contestSubmission {
    submissionId: string;
    problemId: string;
    contestId: string;
    username: string;
    result: string;
    language: string;
    memoryCost: string;
    timeCost: string;
    createTime: string;
}

export interface getContestSubmissionsReq extends pageInfoReq {
    contestId: string;
}

export interface getContestsReq extends pageInfoReq {}

export interface getContestsData extends pageInfoRes {
    contests: contest[];
}

export interface getContestsRes extends response<getContestsData> {}

export interface getContestDetailRes extends response<contestDetail> {}

export interface getContestProblemsData extends pageInfoRes {
    problems: contestProblem[];
}

export interface getContestProblemsRes extends response<getContestProblemsData> {}

export interface getContestSubmissionsData extends pageInfoRes {
    submissions: contestSubmission[];
}

export interface getContestSubmissionsRes extends response<getContestSubmissionsData> {}

export interface getContestProblemInfoRes extends response<contestProblemDetail> {}

// 排行榜相关类型
export interface problemStatsItem {
    status: string;
    rejectCount: number;
    finishTime: number;
}

export interface rankingItem {
    username: string;
    score: number;
    penalty: number;
    problems: problemStatsItem[];
}

export interface getContestRankingRes extends response<{ ranking: rankingItem[] }> {}

export interface createContestReq {
    title: string;
    password?: string;
    problems?: number[];
    description?: string;
    practice?: boolean;
    startTime?: string;
    endTime?: string;
    createBy: string;
    lockTime?: string;
}

export interface updateContestReq {
    title: string;
    password?: string;
    problems?: number[];
    description?: string;
    timeRequired?: boolean;
    startTime?: string;
    endTime?: string;
    createBy: string;
    lockTime?: string;
}

export const useContestStore = defineStore("contest", () => {
    const getContests = async (req: getContestsReq): Promise<getContestsData> => {
        const res = await service.get<getContestsReq, getContestsRes>("/contests", { params: req });
        return res.data!;
    };

    const getContestDetail = async (contestId: string): Promise<contestDetail> => {
        const res = await service.get<void, getContestDetailRes>(`/contest/${contestId}`);
        return res.data!;
    };

    const getContestProblems = async (contestId: string): Promise<getContestProblemsData> => {
        const res = await service.get<void, getContestProblemsRes>(`/contest/${contestId}/problems`);
        return res.data!;
    };

    const getContestSubmissions = async (req: getContestSubmissionsReq): Promise<getContestSubmissionsData> => {
        const { contestId, ...params } = req;
        const res = await service.get<getContestSubmissionsReq, getContestSubmissionsRes>(
            `/contest/${contestId}/submissions`,
            { params },
        );
        return res.data!;
    };

    const getContestProblemInfo = async (contestId: string, problemId: string): Promise<contestProblemDetail> => {
        const res = await service.get<void, getContestProblemInfoRes>(`/contest/${contestId}/problem/${problemId}`);
        return res.data!;
    };

    const getContestRanking = async (contestId: string): Promise<rankingItem[]> => {
        const res = await service.get<void, getContestRankingRes>(`/contest/${contestId}/ranking`);
        return res.data?.ranking ?? [];
    };

    const createContest = async (req: createContestReq): Promise<void> => {
        await service.post<createContestReq, response<void>>("/contest", req);
    };

    const updateContest = async (contestId: string, req: updateContestReq): Promise<void> => {
        await service.put<updateContestReq, response<void>>(`/contest/${contestId}`, req);
    };

    return {
        getContests,
        getContestDetail,
        getContestProblems,
        getContestSubmissions,
        getContestProblemInfo,
        getContestRanking,
        createContest,
        updateContest,
    };
});
