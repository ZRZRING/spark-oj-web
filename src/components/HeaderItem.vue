<script setup lang="ts">

import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElNotification } from 'element-plus';
import { SwitchButton, ArrowDown } from '@element-plus/icons-vue'
import { TEXT } from "@/config/zh-cn.ts";
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore();

const activeName = computed(() => {
    if (route.path === '/' || route.path === '/home') {
        return 'home'
    }
    if (route.path.startsWith('/submissions')) {
        return 'submissions'
    }
    if (route.path.startsWith('/problems') || route.path.startsWith('/problem/')) {
        return 'problems'
    }
    if (route.path.startsWith('/contests')) {
        return 'contests'
    }
    return '';
})

const router = useRouter();

const route = useRoute();

const refreshAdminAccess = async () => {
    if (!userStore.isLoggedIn) {
        return;
    }
    try {
        await userStore.checkAdminAccess();
    } catch {
    }
};

watch(
    () => userStore.isLoggedIn,
    (isLoggedIn) => {
        if (isLoggedIn) {
            refreshAdminAccess();
        }
    },
    { immediate: true }
);

const handleLogin = () => {
    if (userStore.isLoggedIn) {
        router.push('/');
    } else {
        router.push('/login');
    }
};

const handleRegister = () => {
    if (userStore.isLoggedIn) {
        router.push('/');
    } else {
        router.push('/register');
    }
};

const handleLogout = () => {
    if (userStore.isLoggedIn) {
        userStore.logout();
        router.push('/');
    } else {
        ElNotification({ type: 'error', message: TEXT.needLogin });
    }
};

const handleSelect = (key: string) => {
    router.push(`/${key}`);
    (document.activeElement as HTMLElement)?.blur();
}

const onCommand = async (command: string) => {
    if (!userStore.isLoggedIn) {
        ElNotification({ type: 'error', message: TEXT.needLogin });
        return;
    }
    if (command === 'logout') {
        await ElMessageBox.confirm('确认退出系统吗？', '温馨提示', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })
        handleLogout();
        return;
    }
    if (command === 'profile') {
        const username = userStore.username;
        if (!username) {
            ElNotification({ type: 'error', message: '未找到当前用户名，请重新登录' });
            return;
        }
        await router.push(`/profile/${username}`)
        return;
    }
    if (command === 'admin') {
        const allowAdmin = await userStore.checkAdminAccess();
        if (!allowAdmin) {
            ElNotification({ type: 'error', message: '无后台访问权限' });
            return;
        }
        await router.push('/admin/problems')
    }
}

</script>

<template>
    <div class="header">
        <el-menu mode="horizontal" class="nav-menu" :default-active="activeName" @select="handleSelect">
            <div class="logo">
                <img src="/spoj.ico" alt="logo" width="32px" height="32px" />
            </div>
            <div class="title">
                <span>程序设计评测平台</span>
            </div>
            <el-menu-item index="home">主页</el-menu-item>
            <el-menu-item index="submissions">提交</el-menu-item>
            <el-menu-item index="problems">题目</el-menu-item>
            <el-menu-item index="contests">比赛</el-menu-item>
        </el-menu>
        <div class="actions">
            <el-dropdown v-if="userStore.isLoggedIn" placement="bottom-end" trigger="click" @command="onCommand">
                <span class="el-dropdown-link">
                    个人中心
                    <el-icon class="el-icon--right">
                        <ArrowDown />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                        <el-dropdown-item v-if="userStore.isAdmin" command="admin">后台管理</el-dropdown-item>
                        <el-dropdown-item divided command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <template v-else>
                <el-button round @click="handleLogin">登录</el-button>
                <el-button round @click="handleRegister">注册</el-button>
            </template>
        </div>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);
    padding-right: 20px;
}

.logo,
.title {
    display: flex;
    align-items: center;
    padding: 0 15px;
}

.nav-menu {
    flex-grow: 1;
    border-bottom: none;
}

.actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-round);
    padding: 8px 14px;
    transition: all .2s ease;
}

.el-dropdown-link:hover {
    color: var(--el-color-primary-dark-2);
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
}
</style>
