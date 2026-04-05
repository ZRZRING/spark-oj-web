<script setup lang="ts">
defineProps<{
    problemId: string
    title: string
    timeLimit: number
    memoryLimit: number
    rating: number
    judgeType: string
    loading?: boolean
}>()
</script>

<template>
    <el-card v-loading="loading" class="problem-info-card">
        <div class="problem-info-content">
            <el-text tag="b" size="large" class="problem-title">
                #{{ problemId }}. {{ title || '加载中...' }}
            </el-text>
            <div class="info-right">
                <div class="info-block">
                    <el-text class="info-label">时间限制</el-text>
                    <el-text class="info-value">{{ timeLimit ?? '-' }} ms</el-text>
                </div>
                <el-divider direction="vertical" />
                <div class="info-block">
                    <el-text class="info-label">内存限制</el-text>
                    <el-text class="info-value">{{ memoryLimit ?? '-' }} MB</el-text>
                </div>
                <el-divider direction="vertical" />
                <div class="info-block">
                    <el-text class="info-label">难度</el-text>
                    <el-text class="info-value">{{ rating ?? '-' }}</el-text>
                </div>
                <el-divider direction="vertical" />
                <div class="info-block">
                    <el-text class="info-label">题目类型</el-text>
                    <el-text class="info-value">{{ judgeType ?? '-' }}</el-text>
                </div>
            </div>
        </div>
    </el-card>
</template>

<style scoped>
.problem-info-card {
    border: none;
}

.problem-info-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
}

.problem-title {
    color: #303133;
    flex-shrink: 0;
}

.info-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.info-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    font-size: 12px;
    color: #909399;
}

.info-value {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
}

.el-divider--vertical {
    height: 32px;
    margin: 0;
}
</style>
