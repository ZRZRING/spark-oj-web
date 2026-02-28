<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
</script>

<template>
    <el-aside width="200px" class="admin-aside">
        <div class="admin-aside-logo"></div>
        <el-menu :default-active="$route.path" router>
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
</template>

<style scoped>
.admin-aside {
    background-color: var(--el-menu-bg-color);
}

.admin-aside-logo {
    height: 120px;
    background: url('@/assets/ldu_logo.jpg') no-repeat center center/80px 80px;
}

.el-menu {
    border-right: none;
    --el-menu-bg-color: var(--el-color-info-dark-2);
    --el-menu-text-color: var(--el-color-white);
    --el-menu-hover-bg-color: var(--el-color-info);
    --el-menu-active-color: var(--el-color-primary-light-5);
}

.menu-item {
    font-size: 17px;
}
</style>
