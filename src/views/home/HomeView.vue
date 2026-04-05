<script setup lang="ts">
import { Bell, Calendar, User, ArrowRight } from '@element-plus/icons-vue'
</script>

<template>
    <div class="home-container">
        <el-card class="announcement-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <div class="header-left">
                        <el-icon class="header-icon"><Bell /></el-icon>
                        <span class="title">公告</span>
                    </div>
                    <el-link type="primary" :underline="false">
                        查看全部
                        <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                    </el-link>
                </div>
            </template>

            <div class="announcement-item">
                <div class="announcement-header">
                    <el-tag type="danger" effect="dark" size="small">重要</el-tag>
                    <h3 class="announcement-title">欢迎来到 SparkOJ 在线评测系统</h3>
                </div>
                <div class="announcement-meta">
                    <span class="meta-item">
                        <el-icon><User /></el-icon>
                        管理员
                    </span>
                    <span class="meta-item">
                        <el-icon><Calendar /></el-icon>
                        2026-03-25
                    </span>
                </div>
                <div class="announcement-body">
                    <p>SparkOJ 是一个现代化的在线评测系统，致力于为编程爱好者提供一个优质的算法学习与竞赛平台。</p>
                    <p>本系统支持 <el-tag size="small" type="success">ACM</el-tag> 和 <el-tag size="small" type="warning">OI</el-tag> 两种评测模式，提供丰富的题库资源、实时评测反馈以及详细的提交记录查询功能。用户可以参与在线比赛、查看排行榜、与其他选手切磋交流，在实战中不断提升编程能力。</p>
                    <p>我们将持续优化系统性能，定期更新题库内容，为用户带来更好的使用体验。欢迎各位同学注册使用，开启你的算法之旅！</p>
                </div>
            </div>

            <el-divider />

            <div class="announcement-item">
                <div class="announcement-header">
                    <el-tag type="success" effect="dark" size="small">上线</el-tag>
                    <h3 class="announcement-title">系统上线公告</h3>
                </div>
                <div class="announcement-meta">
                    <span class="meta-item">
                        <el-icon><User /></el-icon>
                        管理员
                    </span>
                    <span class="meta-item">
                        <el-icon><Calendar /></el-icon>
                        2026-03-20
                    </span>
                </div>
                <div class="announcement-body">
                    <p>SparkOJ <el-tag size="small" type="primary">v0.1.0</el-tag> 正式上线！欢迎大家体验使用，如有问题请联系管理员反馈。</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.home-container {
    padding: 20px;
    max-width: 1100px;
    margin: 0 auto;
}

.announcement-card {
    border-radius: 12px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    font-size: 20px;
    color: var(--el-color-primary);
}

.title {
    font-size: 20px;
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.announcement-item {
    padding: 16px 0;
}

.announcement-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
}

.announcement-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0;
    transition: color 0.2s;
}

.announcement-title:hover {
    color: var(--el-color-primary);
    cursor: pointer;
}

.announcement-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
}

.meta-item .el-icon {
    font-size: 14px;
}

.announcement-body {
    font-size: 14px;
    line-height: 1.8;
    color: var(--el-text-color-regular);
    background: var(--el-fill-color-lighter);
    padding: 16px;
    border-radius: 8px;
    border-left: 3px solid var(--el-color-primary);
}

.announcement-body p {
    margin: 0 0 12px 0;
}

.announcement-body p:last-child {
    margin-bottom: 0;
}
</style>
