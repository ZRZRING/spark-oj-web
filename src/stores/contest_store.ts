import request from "@/utils/request";
import type { contestSetRes } from "./contest_type"
import type { pageInfo } from "./type";

export const getContestSet = async (req: pageInfo) => {
  const res = await request.get<pageInfo, contestSetRes>("/contests", {params: req});
  if (res.code != 0 || res.data == null) {
    return Promise.reject(new Error(res.message));
  }
  return res.data;
}