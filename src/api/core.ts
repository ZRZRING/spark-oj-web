import service from "@/utils/service.ts";
import type { response } from "@/api/type.ts";

// 提交代码
export interface submitCodeReq {
    code: string;
    username: string;
    problemId: string;
    language: string;
    contestId?: string;
}
export interface submitCodeRes extends response<submitCodeData> {}
export interface submitCodeData {
    submissionId: string;
    result: string;
}
export const submitCode = async (req: submitCodeReq): Promise<submitCodeData> => {
    const res = await service.post<submitCodeReq, submitCodeRes>("/judge", req);
    return res.data!;
};
