export const constantRoute = [
  {
    path: '/',
    name: 'root',
    redirect: '/home',
  },
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
    path: '/contest',
    name: 'contest',
    component: () => import('@/views/ContestView.vue'),
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