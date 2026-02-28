<script setup lang="ts">
import CardItem from '@/components/CardItem.vue'
</script>

<template>
    <CardItem class="announcement-card">
        <template #title>
            <span>公告</span>
        </template>
        <template #extra>
            <el-link>更多</el-link>
        </template>
        <template #content>
            <div class="announcement-list">
                <el-row>
                    <span>公告标题</span>
                </el-row>
                <el-row>
                    <span>发稿人</span>
                </el-row>
            </div>
            <div class="announcement-list">
                <el-row>
                    <span>公告标题</span>
                </el-row>
                <el-row>
                    <span>发稿人</span>
                </el-row>
            </div>

            <div class="announcement-list">
                <el-row>
                    <span>公告标题</span>
                </el-row>
                <el-row>
                    <span>发稿人</span>
                </el-row>
            </div>

            <div class="announcement-list">
                <el-row>
                    <span>公告标题</span>
                </el-row>
                <el-row>
                    <span>发稿人</span>
                </el-row>
            </div>
        </template>
    </CardItem>
</template>

<style scoped>
.announcement-card {
    margin: 20px auto;
    max-width: 1100px;
}

.announcement-list {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 10px;
}
</style>
