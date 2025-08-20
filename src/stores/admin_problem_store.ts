import request from "@/utils/request";
import type { adminProblemSetRes } from "./admin_problem_type";
import type { pageInfo } from "./page_type";

export const getAdminProblemSet = async (data: pageInfo) => {
  const res = await request.get<pageInfo, adminProblemSetRes>("/problems", {params: data});
  if (res.code != 0 || res.data == null) {
    return Promise.reject(new Error(res.message));
  }
  return res.data;
}