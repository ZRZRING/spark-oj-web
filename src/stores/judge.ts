import request from "@/utils/request";
import type { judgeSetRes } from "./types/judge"
import type { pageInfo } from "./types/page";

export const getJudgeSet = async (data: pageInfo) => {
  const res = await request.get<pageInfo, judgeSetRes>("/judges", {params: data});
  if (res.code != 0 || res.data == null) {
    return Promise.reject(new Error(res.message));
  }
  return res.data;
}