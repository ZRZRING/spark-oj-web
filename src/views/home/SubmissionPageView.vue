<script setup lang="ts">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { usePagedList } from '@/composables/usePagedList';
import {
    type getSubmissionsData,
    type getSubmissionsReq,
    type submission,
    getSubmissions
} from "@/api/submission.ts";
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const {
    request: req,
    items: submissions,
    total,
    loading,
    handleSizeChange,
    handleCurrentChange,
} = usePagedList<getSubmissionsReq, getSubmissionsData, submission>({
    initialRequest: { page: 1, size: 50 },
    fetcher: (request) => getSubmissions(request),
    selectItems: (data) => data.submissions,
    selectTotal: (data) => data.total,
})

const keyword = ref('')
const resultFilter = ref<string>('all')

const resultOptions = computed(() => {
    const results = Array.from(new Set(submissions.value.map((item) => item.result)))
    return results.map((result) => ({
        label: result,
        value: result,
    }))
})

const filteredSubmissions = computed(() => {
    const keywordText = keyword.value.trim().toLowerCase()

    return submissions.value.filter((item) => {
        const hitKeyword = !keywordText
            || item.username.toLowerCase().includes(keywordText)
            || item.problemId.toLowerCase().includes(keywordText)
            || item.submissionId.toLowerCase().includes(keywordText)

        const hitResult = resultFilter.value === 'all'
            || item.result === resultFilter.value

        return hitKeyword && hitResult
    })
})

const handleReset = (): void => {
    keyword.value = ''
    resultFilter.value = 'all'
}

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
    <el-card v-loading="loading" shadow="never" style="margin: 20px">
        <el-row justify="space-between" align="middle" :gutter="12" style="margin-bottom: 16px;">
            <el-col :xs="24" :sm="8">
                <el-text tag="b" size="large">Submission List</el-text>
            </el-col>
            <el-col :xs="24" :sm="16">
                <el-space wrap alignment="center" style="width: 100%; justify-content: flex-end;">
                    <el-select v-model="resultFilter" placeholder="Result" style="width: 160px;">
                        <el-option label="Result" value="all" />
                        <el-option v-for="item in resultOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-input v-model="keyword" placeholder="Search" clearable style="width: 240px;">
                        <template #suffix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                    <el-button type="primary" plain @click="handleReset">
                        <el-icon>
                            <RefreshRight />
                        </el-icon>
                        Reset
                    </el-button>
                </el-space>
            </el-col>
        </el-row>

        <el-table :data="filteredSubmissions" style="width: 100%">
            <el-table-column prop="createTime" label="Submit Time" min-width="140">
                <template #default="{ row }">
                    {{ row.createTime }}
                </template>
            </el-table-column>
            <el-table-column prop="submissionId" label="SID" min-width="100">
                <template #default="{ row }">
                    <el-link type="primary" @click="router.push(`/submission/${row.submissionId}`)">{{ row.submissionId }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="problemId" label="PID" min-width="90">
                <template #default="{ row }">
                    <el-link type="primary" @click="router.push(`/problem/${row.problemId}`)">{{ row.problemId }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="result" label="Result" min-width="160">
                <template #default="{ row }">
                    <el-tag :type="getResultType(row.result)" size="small" effect="plain" style="cursor: pointer;"
                        @click="router.push(`/submission/${row.submissionId}`)">
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
        <el-pagination v-model:current-page="req.page" v-model:page-size="req.size" :page-sizes="[20, 50, 100, 200]"
            :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" background
            layout="total, sizes, prev, pager, next, jumper" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
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
