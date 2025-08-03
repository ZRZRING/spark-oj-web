import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

export const constantRoute = [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: '/judge',
        name: 'judge',
        component: () => import('@/views/JudgeView.vue'),
      },
      {
        path: '/problemset',
        name: 'problemset',
        component: () => import('@/views/ProblemsetView.vue'),
      },
      {
        path: '/problem/:pid',
        name: 'problem',
        component: () => import('@/views/ProblemDetail.vue'),
      },
      {
        path: '/contest',
        name: 'contest',
        component: () => import('@/views/ContestView.vue'),
      },
      {
        path: '/contest/:cid',
        name: 'contestDetail',
        component: () => import('@/views/ContestDetail.vue'),
      },
      {
        path: '/profile',
        name: 'profile',
        redirect: '/',
        children: [
          {
            path: ':username',
            component: () => import('@/views/ProfileView.vue'),
          },
        ],
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/RegisterView.vue'),
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/problemset',
    component: () => import('@/views/admin/AdminHomeView.vue'),
    children: [
      {
        path: '/admin/problemset',
        name: 'Problemset',
        component: () => import('@/views/admin/AdminProblemset.vue'),
      },
      {
        path: '/admin/problem/create',
        name: 'CreateProblem',
        component: () => import('@/views/admin/AdminCreateProblem.vue'),
      },
      {
        path: '/admin/tag/list',
        name: 'TagList',
        component: () => import('@/views/admin/AdminTagSet.vue'),
      },
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