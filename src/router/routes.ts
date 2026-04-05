import type { RouteRecordRaw } from "vue-router";

export const constantRoute: RouteRecordRaw[] = [
    {
        path: "/",
        name: "root",
        redirect: "/home",
        component: () => import("@/views/Home.vue"),
        children: [
            {
                path: "home",
                name: "home",
                component: () => import("@/views/home/HomeView.vue"),
            },
            {
                path: "submissions",
                name: "submissions",
                component: () => import("@/views/home/SubmissionPageView.vue"),
            },
            {
                path: "submission/:submissionId",
                name: "submission",
                component: () => import("@/views/home/SubmissionView.vue"),
            },
            {
                path: "problems",
                name: "problems",
                component: () => import("@/views/home/ProblemPageView.vue"),
            },
            {
                path: "problem/:problemId",
                name: "problem",
                component: () => import("@/views/home/ProblemView.vue"),
            },
            {
                path: "contests",
                name: "contests",
                component: () => import("@/views/home/ContestPageView.vue"),
            },
            {
                path: "contest/:contestId",
                name: "contestDetail",
                component: () => import("@/views/home/ContestView.vue"),
                redirect: (to) => `/contest/${to.params.contestId as string}/problems`,
                children: [
                    {
                        path: "problems",
                        name: "contestProblems",
                        component: () => import("@/views/home/ContestProblemsView.vue"),
                    },
                    {
                        path: "submissions",
                        name: "contestSubmissions",
                        component: () => import("@/views/home/ContestSubmissionsView.vue"),
                    },
                    {
                        path: "ranking",
                        name: "contestRanking",
                        component: () => import("@/views/home/ContestRankingView.vue"),
                    },
                ],
            },
            {
                path: "login",
                name: "login",
                component: () => import("@/views/home/LoginView.vue"),
            },
            {
                path: "register",
                name: "register",
                component: () => import("@/views/home/RegisterView.vue"),
            },
        ],
    },
    {
        path: "/admin",
        name: "admin",
        meta: { requiresAdmin: true },
        redirect: "/admin/problems",
        component: () => import("@/views/Admin.vue"),
        children: [
            {
                path: "problems",
                name: "adminProblems",
                component: () => import("@/views/admin/ProblemListView.vue"),
            },
            {
                path: "problem/create",
                name: "adminCreateProblem",
                component: () => import("@/views/admin/CreateProblemView.vue"),
            },
            {
                path: "problem/:problemId/edit",
                name: "adminEditProblem",
                component: () => import("@/views/admin/CreateProblemView.vue"),
            },
        ],
    },
    {
        path: "/404",
        name: "404",
        component: () => import("@/views/404.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "any",
        redirect: "/404",
    },
];
