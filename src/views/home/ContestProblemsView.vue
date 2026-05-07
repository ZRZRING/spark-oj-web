<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type getContestDetailData, type contestProblem, getContestProblems } from '@/api/contest.ts'
import { Notify } from '@/utils/notify.ts'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

const props = defineProps<{ contest: getContestDetailData | null }>()

const route = useRoute()
const router = useRouter()

const contestId = computed(() => String(route.params.contestId ?? ''))
const problems = ref<contestProblem[]>([])
const loading = ref(false)

const problemLabel = (index: number): string => {
    return `${index + 1}`
}

const loadProblems = async (contestId: string) => {
    if (!contestId) return
    loading.value = true
    try {
        const data = await getContestProblems(contestId)
        problems.value = data.problems ?? []
    } catch {
        Notify.error('获取比赛题目列表失败')
    } finally {
        loading.value = false
    }
}

watch(contestId, (contestId) => loadProblems(contestId), { immediate: true })
</script>

<template>
    <el-card shadow="never" v-loading="loading">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2>{{ props.contest?.title ?? '加载中...' }}</h2>
        </div>

        <div v-if="props.contest?.description" style="margin-bottom: 20px; padding: 0 16px;">
            <MarkdownRenderer :content="props.contest.description" />
        </div>

        <el-table :data="problems" stripe>
            <el-table-column label="#" width="80">
                <template #default="{ $index }">
                    {{ problemLabel($index) }}
                </template>
            </el-table-column>

            <el-table-column prop="title" label="题目" min-width="280">
                <template #default="{ row }">
                    <el-link type="primary" @click="router.push(`/problem/${row.problemId}?contestId=${contestId}`)">{{ row.title
                        }}</el-link>
                </template>
            </el-table-column>

            <el-table-column label="类型" width="120">
                <template #default="{ row }">
                    {{ row.judgeType }}
                </template>
            </el-table-column>

            <el-table-column label="正确/提交次数" width="140">
                <template #default="{ row }">
                    {{ row.acceptCount }}/{{ row.submitCount }}
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
