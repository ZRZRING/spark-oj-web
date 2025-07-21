import request from "@/utils/request";
import type { contestSetRes } from "./types/contest"
import type { pageInfo } from "./types/page";

export const getContestSet = async (data: pageInfo) => {
  const res = await request.get<pageInfo, contestSetRes>("/contests", {params: data});
  if (res.code != 0 || res.data == null) {
    return Promise.reject(new Error(res.message));
  }
  return res.data;
}