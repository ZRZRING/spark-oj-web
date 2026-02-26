export const constantRoute = [
    {
        path: '/',
        name: 'root',
        redirect: '/home',
        component: () => import("@/views/Home.vue"),
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/home/HomeView.vue'),
            },
            {
                path: 'submissions',
                name: 'submissions',
                component: () => import('@/views/home/SubmissionsView.vue'),
            },
            {
                path: 'problems',
                name: 'problems',
                component: () => import('@/views/home/ProblemsView.vue'),
            },
            {
                path: 'problem/:pid',
                name: 'problem',
                component: () => import('@/views/home/ProblemView.vue'),
            },
            {
                path: 'contests',
                name: 'contests',
                component: () => import('@/views/home/ContestsView.vue'),
            },
            {
                path: 'contest/:cid',
                name: 'contestDetail',
                component: () => import('@/views/home/ContestView.vue'),
            },
            {
                path: 'profile/:username',
                name: 'profile',
                component: () => import('@/views/home/ProfileView.vue'),
            },
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/home/LoginView.vue'),
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('@/views/home/RegisterView.vue'),
            },
        ],
    },
    {
        path: '/admin',
        name: 'admin',
        meta: {requiresAdmin: true},
        redirect: '/admin/problems',
        component: () => import('@/views/Admin.vue'),
        children: [
            {
                path: 'problems',
                name: 'adminProblems',
                component: () => import('@/views/admin/ProblemsView.vue'),
            },
            {
                path: 'problem/create',
                name: 'adminCreateProblem',
                component: () => import('@/views/admin/CreateProblemView.vue'),
            },
            // {
            //     path: 'tags',
            //     name: 'tags',
            //     component: () => import('@/views/admin/TagsView.vue'),
            // },
        ],
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'any',
        redirect: '/404',
    }
];
