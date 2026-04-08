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

    // 全局同步用户信息（刷新页面后重新拉取状态）
    if (userStore.isLoggedIn && userStore.adminRole === null) {
        try {
            await userStore.checkAdminAccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '';
            if (errorMessage.includes('401') || errorMessage.includes('403')) {
                userStore.logout();
                if (to.path !== '/login') {
                    ElNotification({type: 'error', message: '认证已失效，请重新登录'});
                    return '/login';
                }
            }
        }
    }

    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

    if (!requiresAdmin) {
        return true;
    }

    if (!userStore.isLoggedIn) {
        ElNotification({type: 'error', message: TEXT.needLogin});
        return '/login';
    }

    // 这里已经全局获取过状态了，如果 isAdmin 为 false 则拦截
    if (!userStore.isAdmin) {
        ElNotification({type: 'error', message: '无后台访问权限'});
        return '/home';
    }
    
    return true;
});

export default router;
