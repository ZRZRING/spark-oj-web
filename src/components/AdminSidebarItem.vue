<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
</script>

<template>
    <el-aside width="200px" class="admin-aside">
        <div class="admin-aside-logo"></div>
        <el-menu active-text-color="#CCFF66" background-color="#646464" :default-active="$route.path" text-color="#fff"
            router>
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
    background-color: #646464;
}

.admin-aside-logo {
    height: 120px;
    background: url('@/assets/ldu_logo.jpg') no-repeat center center/80px 80px;
}

.el-menu {
    border-right: none;
}

.menu-item {
    font-size: 17px;
}
</style>
