import service from "@/utils/service.ts";
import type {submissionsRes} from "./submission_type.ts"
import type {pageInfoReq} from "./type";

export const getJudgeSet = async (data: pageInfoReq) => {
    const res = await service.get<pageInfoReq, submissionsRes>("/judges", {params: data});
    if (res.code != 0 || res.data == null) {
        return Promise.reject(new Error(res.message));
    }
    return res.data;
}
