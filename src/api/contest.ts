import service from "@/utils/service.ts";
import type { pageInfoReq, pageInfoRes, response } from "@/api/type.ts";

export interface contest {
    contestId: string;
    title: string;
    practice: boolean;
    startTime: string;
    endTime: string;
    createBy: string;
    visibility: string;
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
    submitCount: number;
    acceptCount: number;
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

export interface rankingItem {
    username: string;
    score: number;
    penalty: number;
    problems: problemStatsItem[];
}

export interface problemStatsItem {
    status: string;
    rejectCount: number;
    finishTime: number;
}

// 获取比赛列表
export interface getContestsReq extends pageInfoReq {}
export interface getContestsRes extends response<getContestsData> {}
export interface getContestsData extends pageInfoRes {
    contests: contest[];
}
export const getContests = async (req: getContestsReq): Promise<getContestsData> => {
    const res = await service.get<getContestsReq, getContestsRes>("/contests", { params: req });
    return res.data!;
};

// 获取比赛详情
export interface getContestDetailReq {}
export interface getContestDetailRes extends response<getContestDetailData> {}
export interface getContestDetailData extends contestDetail {}
export const getContestDetail = async (contestId: string): Promise<getContestDetailData> => {
    const res = await service.get<getContestDetailReq, getContestDetailRes>(`/contest/${contestId}`);
    return res.data!;
};

// 获取比赛题目列表
export interface getContestProblemsReq {}
export interface getContestProblemsRes extends response<getContestProblemsData> {}
export interface getContestProblemsData extends pageInfoRes {
    problems: contestProblem[];
}
export const getContestProblems = async (contestId: string): Promise<getContestProblemsData> => {
    const res = await service.get<getContestProblemsReq, getContestProblemsRes>(`/contest/${contestId}/problems`);
    return res.data!;
};

// 获取比赛提交记录
export interface getContestSubmissionsReq extends pageInfoReq {}
export interface getContestSubmissionsRes extends response<getContestSubmissionsData> {}
export interface getContestSubmissionsData extends pageInfoRes {
    submissions: contestSubmission[];
}
export const getContestSubmissions = async (contestId: string, req: getContestSubmissionsReq): Promise<getContestSubmissionsData> => {
    const res = await service.get<getContestSubmissionsReq, getContestSubmissionsRes>(`/contest/${contestId}/submissions`, { params: req });
    return res.data!;
};

// 获取比赛题目详情
export interface getContestProblemInfoReq {}
export interface getContestProblemInfoRes extends response<getContestProblemInfoData> {}
export interface getContestProblemInfoData extends contestProblemDetail {}
export const getContestProblemInfo = async (contestId: string, problemId: string): Promise<getContestProblemInfoData> => {
    const res = await service.get<getContestProblemInfoReq, getContestProblemInfoRes>(`/contest/${contestId}/problem/${problemId}`);
    return res.data!;
};

// 获取比赛排名
export interface getContestRankingReq {}
export interface getContestRankingRes extends response<getContestRankingData> {}
export interface getContestRankingData {
    ranking: rankingItem[];
}
export const getContestRanking = async (contestId: string): Promise<getContestRankingData> => {
    const res = await service.get<getContestRankingReq, getContestRankingRes>(`/contest/${contestId}/ranking`);
    return res.data!;
};

// 创建比赛
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
export interface createContestRes extends response<void> {}
export const createContest = async (req: createContestReq): Promise<void> => {
    await service.post<createContestReq, createContestRes>("/contest", req);
};

// 更新比赛
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
export interface updateContestRes extends response<void> {}
export const updateContest = async (contestId: string, req: updateContestReq): Promise<void> => {
    await service.put<updateContestReq, updateContestRes>(`/contest/${contestId}`, req);
};
