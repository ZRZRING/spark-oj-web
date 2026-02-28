import {createRouter, createWebHistory} from 'vue-router';
import {constantRoute} from './routes';
import {ElNotification} from 'element-plus';
import {TEXT} from '@/config/zh-cn';
import {useUserStore} from "@/stores/user.ts";

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoute,
    scrollBehavior() {
        return {
            left: 0,
            top: 0,
        };
    },
});

router.beforeEach(async (to) => {
    const userStore = useUserStore();

    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

    if (!requiresAdmin) {
        return true;
    }

    if (!userStore.isLoggedIn) {
        ElNotification({type: 'error', message: TEXT.needLogin});
        return '/login';
    }

    try {
        const allowAdmin = await userStore.checkAdminAccess();
        if (!allowAdmin) {
            ElNotification({type: 'error', message: '无后台访问权限'});
            return '/home';
        }
        return true;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '权限校验失败，请稍后重试';
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
            userStore.logout();
            ElNotification({type: 'error', message: '登录已失效，请重新登录'});
            return '/login';
        }
        ElNotification({type: 'error', message: '权限校验失败，请稍后重试'});
        return '/home';
    }
});

export default router;
