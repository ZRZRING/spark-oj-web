import request from "@/utils/request";
import type { problemSetRes } from "./problem_type";
import type { pageInfo } from "./type";

export const getProblemSet = async (data: pageInfo) => {
  const res = await request.get<pageInfo, problemSetRes>("/problems", {params: data});
  if (res.code != 0 || res.data == null) {
    return Promise.reject(new Error(res.message));
  }
  return res.data;
}