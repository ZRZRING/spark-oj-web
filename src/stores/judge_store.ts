import request from "@/utils/request";
import type { judgeSetRes } from "./judge_type"
import type { pageInfo } from "./type";

export const getJudgeSet = async (data: pageInfo) => {
  const res = await request.get<pageInfo, judgeSetRes>("/judges", {params: data});
  if (res.code != 0 || res.data == null) {
    return Promise.reject(new Error(res.message));
  }
  return res.data;
}