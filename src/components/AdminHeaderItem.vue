<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessageBox, ElNotification } from 'element-plus'
import { TEXT } from '@/config/zh-cn.ts'
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore()
const router = useRouter()

const onCommand = async (toPath: string | number | object) => {
    if (!userStore.isLoggedIn) {
        ElNotification({
            type: 'error',
            message: TEXT.needLogin,
        })
        return
    }

    const command = String(toPath)

    if (command === 'logout') {
        await ElMessageBox.confirm('确认退出系统吗？', '温馨提示', {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消',
        })
        userStore.logout()
        await router.push('/login')
        return
    }

    if (command === 'profile') {
        const username = userStore.username
        if (!username) {
            ElNotification({ type: 'error', message: '未找到当前用户名，请重新登录' })
            return
        }
        await router.push(`/profile/${username}`)
        return
    }

    if (command === 'submission') {
        await router.push('/submissions')
        return
    }

    if (command === 'home') {
        await router.push('/home')
        return
    }

    if (command === 'password' || command === 'signup') {
        ElNotification({ type: 'warning', message: '该功能暂未开放' })
        return
    }

    await router.push(`/${command}`)
}
</script>

<template>
    <el-header class="admin-header">
        <div class="home-title">
            <h1>程序设计评测平台后台</h1>
        </div>
        <el-dropdown placement="bottom-end" @command="onCommand">
            <span class="el-dropdown-box">
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
</template>

<style scoped>
.admin-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.home-title {
    font-size: 20px;
    font-weight: bold;
}

.el-dropdown-box {
    display: flex;
    align-items: center;
}
</style>
