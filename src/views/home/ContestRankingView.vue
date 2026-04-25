<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type contestDetail, type rankingItem, getContestRanking, getContestProblems } from '@/api/contest.ts'
import { Notify } from '@/utils/notify.ts'
import { getRankingStatusStyle, RankingProblemStatus } from '@/utils/enum.ts'

const props = defineProps<{ contest?: contestDetail | null }>()

const route = useRoute()
const contestId = computed(() => String(route.params.contestId ?? ''))
const loading = ref(false)
const ranking = ref<rankingItem[]>([])
const problemCount = ref(0)

// 生成题目标签 (A, B, C, ...)
const getProblemLabel = (index: number): string => {
    return String.fromCharCode(65 + index) // 65 = 'A'
}

// 格式化题目完成时间 (分钟 -> hh:mm)
const formatFinishTime = (time: number): string => {
    if (time > 24 * 60) return '>24h'
    const hours = Math.floor(time / 60)
    const minutes = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// 获取题目状态显示文本
const getStatusText = (status: string, rejectCount: number): string => {
    if (status === RankingProblemStatus.Accepted) {
        return rejectCount > 0 ? `+${rejectCount}` : '+'
    } else if (status === RankingProblemStatus.Reject && rejectCount > 0) {
        return `-${rejectCount}`
    }
    return ''
}

// 获取排名的样式
const getRankingStyle = (index: number) => {
    return {
        fontWeight: index < 3 ? 'bold' : 'normal',
        color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'inherit'
    }
}

// 获取题目单元格的样式
const getProblemCellStyle = (status: string) => {
    const style = getRankingStatusStyle(status)
    return {
        backgroundColor: style.bg,
        color: style.color
    }
}

// 加载排行榜数据
const loadRanking = async (contestId: string) => {
    if (!contestId) return
    loading.value = true
    try {
        const [problemsData, rankingData] = await Promise.all([
            getContestProblems(contestId),
            getContestRanking(contestId)
        ])
        problemCount.value = problemsData.problems?.length ?? 0
        ranking.value = rankingData
    } catch {
        Notify.error('获取排行榜失败')
    } finally {
        loading.value = false
    }
}

watch(contestId, (contestId) => loadRanking(contestId), { immediate: true })
</script>

<template>
    <el-card shadow="never" v-loading="loading">
        <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; font-weight: bold;">排行榜</span>
                <el-button type="primary" size="small" @click="loadRanking(contestId)">
                    刷新
                </el-button>
            </div>
        </template>

        <el-table :data="ranking" stripe v-if="ranking.length > 0">
            <el-table-column label="排名" width="80" align="center">
                <template #default="{ $index }">
                    <span :style="getRankingStyle($index)">
                        {{ $index + 1 }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="username" label="用户名" min-width="120" />

            <el-table-column prop="score" label="分数" width="80" align="center">
                <template #default="{ row }">
                    <span style="font-weight: bold; color: #52c41a;">{{ row.score }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="penalty" label="罚时" width="80" align="center">
                <template #default="{ row }">
                    {{ row.penalty }}
                </template>
            </el-table-column>

            <el-table-column
                v-for="i in problemCount"
                :key="i"
                :label="getProblemLabel(i - 1)"
                width="70"
                align="center"
            >
                <template #default="{ row }">
                    <div
                        v-if="row.problems && row.problems[i - 1]"
                        class="status-cell"
                        :style="getProblemCellStyle(row.problems[i - 1].status)"
                    >
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2;">
                            <span>{{ getStatusText(row.problems[i - 1].status, row.problems[i - 1].rejectCount) }}</span>
                            <span v-if="row.problems[i - 1].status === RankingProblemStatus.Accepted" style="font-size: 10px; font-weight: normal; opacity: 0.9;">
                                {{ formatFinishTime(row.problems[i - 1].finishTime) }}
                            </span>
                        </div>
                    </div>
                    <div v-else class="status-cell" style="background-color: #f0f0f0; color: #999;">
                        -
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-empty v-else description="暂无排行榜数据" />
    </el-card>
</template>

<style scoped>
.status-cell {
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin: 0 auto;
}
</style>
