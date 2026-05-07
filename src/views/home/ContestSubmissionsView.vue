<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    type getContestDetailData,
    type contestSubmission,
    getContestSubmissions
} from '@/api/contest.ts'
import SubmissionTable from '@/components/SubmissionTable.vue'
import { Notify } from '@/utils/notify.ts'

const props = defineProps<{ contest?: getContestDetailData | null }>()

const route = useRoute()
const router = useRouter()
const contestId = computed(() => String(route.params.contestId ?? ''))

const submissions = ref<contestSubmission[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const size = ref(50)

const loadSubmissions = async () => {
    if (!contestId.value) return

    loading.value = true
    try {
        const data = await getContestSubmissions(contestId.value, {
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

const goToProblem = (problemId: string) => {
    router.push(`/problem/${problemId}?contestId=${contestId.value}`)
}
</script>

<template>
    <el-card shadow="never">
        <SubmissionTable
            :submissions="submissions"
            :loading="loading"
            @click-submission="goToSubmission"
            @click-problem="goToProblem"
        />
    </el-card>

    <el-pagination v-model:current-page="page" v-model:page-size="size" :page-sizes="[20, 50, 100, 200]" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" background
        layout="total, sizes, prev, pager, next, jumper" style="margin-top: 16px; justify-content: flex-end" />
</template>
