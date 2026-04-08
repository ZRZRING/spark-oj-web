<script setup lang="ts">
import {
    DataAnalysis,
    Document,
    Files,
    List,
    Menu,
    Notebook,
    Setting,
    Trophy,
    UserFilled,
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
    <el-aside width="220px" class="admin-sidebar">
        <div class="sidebar-brand">
            <el-icon><Menu /></el-icon>
            <span>后台管理</span>
        </div>

        <el-menu
            :default-active="route.path"
            router
            unique-opened
            class="sidebar-menu"
            :collapse-transition="false"
            background-color="transparent"
            text-color="#c8d4e8"
            active-text-color="#ffffff"
        >
            <el-menu-item index="/admin/overview" disabled>
                <el-icon><DataAnalysis /></el-icon>
                <span>概览</span>
            </el-menu-item>

            <el-sub-menu index="/admin/problem">
                <template #title>
                    <el-icon><Files /></el-icon>
                    <span>题目管理</span>
                </template>
                <el-menu-item index="/admin/problems">
                    <template #title>
                        <el-icon><List /></el-icon>
                        <span>题库</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/admin/problem/create">
                    <el-icon><Notebook /></el-icon>
                    <span>新建题目</span>
                </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/admin/contest">
                <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>比赛管理</span>
                </template>
                <el-menu-item index="/admin/contests">
                    <template #title>
                        <el-icon><List /></el-icon>
                        <span>比赛列表</span>
                    </template>
                </el-menu-item>
                <el-menu-item index="/admin/contest/create">
                    <el-icon><Notebook /></el-icon>
                    <span>新建比赛</span>
                </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/admin/submissions" disabled>
                <el-icon><Trophy /></el-icon>
                <span>提交记录</span>
            </el-menu-item>

            <el-menu-item index="/admin/users">
                <el-icon><UserFilled /></el-icon>
                <span>账号管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/settings" disabled>
                <el-icon><Setting /></el-icon>
                <span>系统设置</span>
            </el-menu-item>
        </el-menu>

        <div class="sidebar-footer">程序设计评测平台</div>
    </el-aside>
</template>

<style scoped>
.admin-sidebar {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #072448;
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    padding: 0 16px;
    color: #ffffff;
    font-weight: 700;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-menu {
    flex: 1;
    border-right: none;
}

.sidebar-footer {
    padding: 16px;
    color: #a7b9d6;
    font-size: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
