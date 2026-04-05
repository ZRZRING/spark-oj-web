<script setup lang="ts">
import FooterItem from '@/components/FooterItem.vue'
import { User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElNotification } from 'element-plus';
import { TEXT } from '@/config/zh-cn.ts'
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore();
const router = useRouter();
const onCommand = async (toPath: string | number | object) => {

    if (!userStore.isLoggedIn) {
        ElNotification({
            type: 'error',
            message: TEXT.needLogin,
        });
        return;
    }

    const command = String(toPath);

    if (toPath === 'logout') {
        await ElMessageBox.confirm('确认退出系统吗？', '温馨提示', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
        })
        userStore.logout();
        await router.push('/login');
    } else if (command === 'profile') {
        const username = userStore.username;
        if (!username) {
            ElNotification({ type: 'error', message: '未找到当前用户名，请重新登录' });
            return;
        }
        await router.push(`/profile/${username}`);
    } else if (command === 'submission') {
        await router.push('/submissions');
    } else if (command === 'home') {
        await router.push('/home');
    } else if (command === 'password' || command === 'signup') {
        ElNotification({ type: 'warning', message: '该功能暂未开放' });
    } else {
        await router.push(`/${command}`)
    }
}
</script>

<template>
    <el-container class="layout-container">
        <el-aside width="200px">
            <div class="el-aside_logo">
            </div>
            <el-menu active-text-color="#CCFF66" background-color="#646464" :default-active="$route.path"
                text-color="#fff" router>
                <!-- 题目管理 -->
                <el-sub-menu index="/admin/problem">
                    <template #title>
                        <el-icon>
                            <User />
                        </el-icon>
                        <span class="menu-item">题目管理</span>
                    </template>
                    <el-menu-item index="/admin/problems">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span class="menu-item">题库</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/problem/create">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span class="menu-item">新建题目</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
                <div class="home-title">
                    <h1>程序设计评测平台后台</h1>
                </div>
                <el-dropdown placement="bottom-end" @command="onCommand">
                    <span class="el-dropdown_box">
                        <h3>admin</h3>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                            <el-dropdown-item command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item command="submission">个人提交</el-dropdown-item>
                            <el-dropdown-item command="signup">我的竞赛</el-dropdown-item>
                            <el-dropdown-item command="home">返回前台</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer>
                <FooterItem />
            </el-footer>
        </el-container>
    </el-container>
</template>

<style scoped>
.layout-container {
    height: 100vh;
}

.el-aside {
    background-color: #646464;
}

.el-aside_logo {
    height: 120px;
    background: url('@/assets/ldu_logo.jpg') no-repeat center center/ 80px 80px
}

.el-menu {
    border-right: none;
}

.menu-item {
    font-size: 17px;
}

.el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.home-title {
    font-size: 20px;
    font-weight: bold;
}

.el-dropdown_box {
    display: flex;
    align-items: center;
}

.el-icon {
    color: #999;
    margin-left: 10px;
}

el-dropdown_box:active,
el-dropdown_box:focus {
    outline: none !important;
}

.el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
}
</style>
