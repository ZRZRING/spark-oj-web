import type { response } from ".";

export interface adminProblemSetReq {
    pid: string;
    title: string;
    text: string;
    timeLimit: number;
    memoryLimit: number;
    type: string;
    total: number;
    accepted: number;
    difficulty: string;
    uploader: string;
    tag: string[];
    created_at: string;
}

export interface adminProblemSetRes extends response {
    data: null | {
        total: number;
        problems: adminProblemSetReq[];
    };
}