<script lang="ts">
export interface submissionItem {
    submissionId: string
    problemId: string
    username: string
    result: string
    language: string
    timeCost: number | string
    memoryCost: number | string
    createTime: number | string
}
</script>

<script setup lang="ts">
defineProps<{
    submissions: submissionItem[]
    loading?: boolean
}>()

const emit = defineEmits<{
    'click-submission': [submissionId: string]
    'click-problem': [problemId: string]
}>()

const getResultType = (result: string): '' | 'success' | 'danger' | 'warning' | 'info' => {
    if (result === 'Waiting') return 'info'
    if (result === 'Running') return ''
    if (result === 'Accepted') return 'success'
    if (result === 'Wrong Answer') return 'danger'
    if (result === 'Time Limit Exceeded') return 'warning'
    if (result === 'Memory Limit Exceeded') return 'warning'
    if (result === 'Runtime Error') return 'danger'
    if (result === 'Compile Error') return 'info'
    return ''
}
</script>

<template>
    <el-table :data="submissions" v-loading="loading" style="width: 100%">
        <el-table-column prop="createTime" label="Submit Time" min-width="140">
            <template #default="{ row }">
                {{ row.createTime }}
            </template>
        </el-table-column>
        <el-table-column prop="submissionId" label="SID" min-width="100">
            <template #default="{ row }">
                <el-link type="primary" @click="emit('click-submission', row.submissionId)">
                    {{ row.submissionId }}
                </el-link>
            </template>
        </el-table-column>
        <el-table-column prop="problemId" label="PID" min-width="90">
            <template #default="{ row }">
                <el-link type="primary" @click="emit('click-problem', row.problemId)">
                    {{ row.problemId }}
                </el-link>
            </template>
        </el-table-column>
        <el-table-column prop="result" label="Result" min-width="160">
            <template #default="{ row }">
                <el-tag :type="getResultType(row.result)" size="small" effect="plain" style="cursor: pointer;"
                    @click="emit('click-submission', row.submissionId)">
                    {{ row.result }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="timeCost" label="Time" min-width="90">
            <template #default="{ row }">
                <span class="metric-value">{{ row.timeCost }}</span>
                <span class="metric-unit">ms</span>
            </template>
        </el-table-column>
        <el-table-column prop="memoryCost" label="Memory" min-width="100">
            <template #default="{ row }">
                <span class="metric-value">{{ row.memoryCost }}</span>
                <span class="metric-unit">MB</span>
            </template>
        </el-table-column>
        <el-table-column prop="language" label="Language" min-width="100" />
        <el-table-column prop="username" label="Username" min-width="140" />
    </el-table>
</template>

<style scoped>
.metric-value {
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.metric-unit {
    color: var(--el-text-color-secondary);
    font-size: 12px;
}
</style>
