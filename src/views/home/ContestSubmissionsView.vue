<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    type contestDetail,
    type contestSubmission,
    getContestSubmissions
} from '@/api/contest.ts'
import { Notify } from '@/utils/notify.ts'

const props = defineProps<{ contest?: contestDetail | null }>()

const route = useRoute()
const router = useRouter()
const contestId = computed(() => String(route.params.contestId ?? ''))

const submissions = ref<contestSubmission[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const size = ref(50)

const getResultType = (result: string): '' | 'success' | 'danger' | 'warning' | 'info' => {
    if (result === 'Accepted') return 'success'
    if (result === 'Wrong Answer') return 'danger'
    if (result === 'Time Limit Exceeded') return 'warning'
    if (result === 'Memory Limit Exceeded') return 'warning'
    if (result === 'Runtime Error') return 'danger'
    if (result === 'Compilation Error') return 'info'
    return ''
}

const loadSubmissions = async () => {
    if (!contestId.value) return

    loading.value = true
    try {
        const data = await getContestSubmissions({
            contestId: contestId.value,
            page: page.value,
            size: size.value,
        })
        submissions.value = data.submissions ?? []
        total.value = data.total ?? 0
    } catch {
        Notify.error('获取提交列表失败')
    } finally {
        loading.value = false
    }
}

watch(contestId, () => {
    page.value = 1
    loadSubmissions()
}, { immediate: true })

const handleSizeChange = (newSize: number) => {
    size.value = newSize
    page.value = 1
    loadSubmissions()
}

const handleCurrentChange = (newPage: number) => {
    page.value = newPage
    loadSubmissions()
}

const goToSubmission = (submissionId: string) => {
    router.push(`/submission/${submissionId}`)
}
</script>

<template>
    <el-card shadow="never" v-loading="loading">
        <el-table :data="submissions" stripe>
            <el-table-column prop="submissionId" label="提交ID" width="120">
                <template #default="{ row }">
                    <el-link type="primary" @click="goToSubmission(row.submissionId)">
                        {{ row.submissionId }}
                    </el-link>
                </template>
            </el-table-column>

            <el-table-column prop="pid" label="题目ID" width="100">
                <template #default="{ row }">
                    <el-link type="primary" @click="router.push(`/problem/${row.pid}?contestId=${contestId}`)">
                        {{ row.pid }}
                    </el-link>
                </template>
            </el-table-column>

            <el-table-column prop="username" label="用户" width="140" />

            <el-table-column prop="result" label="结果" min-width="160">
                <template #default="{ row }">
                    <el-tag :type="getResultType(row.result)" effect="light">
                        {{ row.result }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="language" label="语言" width="100" />

            <el-table-column prop="timeCost" label="耗时" width="100">
                <template #default="{ row }">
                    {{ row.timeCost }} ms
                </template>
            </el-table-column>

            <el-table-column prop="memoryCost" label="内存" width="100">
                <template #default="{ row }">
                    {{ row.memoryCost }} MB
                </template>
            </el-table-column>

            <el-table-column prop="createTime" label="提交时间" width="180" />
        </el-table>
    </el-card>

    <el-pagination v-model:current-page="page" v-model:page-size="size" :page-sizes="[20, 50, 100, 200]" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" background
        layout="total, sizes, prev, pager, next, jumper" style="margin-top: 16px; justify-content: flex-end" />
</template>
