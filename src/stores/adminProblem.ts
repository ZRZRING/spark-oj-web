import request from "@/utils/request";
import type { adminProblemSetRes } from "./types/adminProblem";
import type { pageInfo } from "./types/page";

export const getAdminProblemSet = async (data: pageInfo) => {
  const res = await request.get<pageInfo, adminProblemSetRes>("/problems", {params: data});
  if (res.code != 0 || res.data == null) {
    return Promise.reject(new Error(res.message));
  }
  return res.data;
}