<script setup lang="ts">
import ProblemInfoCard from '@/components/ProblemInfoCard.vue'
import ProblemContentCard from '@/components/ProblemContentCard.vue'
import CodeSubmitCard from '@/components/CodeSubmitCard.vue'
import ContestInfoCard from '@/components/ContestInfoCard.vue'
import {ElMessage} from 'element-plus'
import {computed, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {type problemDetail, useProblemStore} from '@/stores/problem.ts'
import {type contestDetail, type contestProblemDetail, useContestStore} from '@/stores/contest.ts'
import {useCoreStore} from '@/stores/core.ts'
import {useUserStore} from '@/stores/user.ts'

const route = useRoute()
const router = useRouter()
const problemStore = useProblemStore()
const contestStore = useContestStore()
const coreStore = useCoreStore()
const userStore = useUserStore()

const problemId = computed(() => String(route.params.problemId ?? '1000'))
// 支持路由参数 contestId（嵌套路由）和 query 参数 contestId（从比赛跳转）
const contestId = computed(() => {
    const routeCid = route.params.contestId
    const queryCid = route.query.contestId
    return String(routeCid ?? queryCid ?? '')
})
const isInContest = computed(() => !!contestId.value)

const problemInfo = ref<problemDetail | null>(null)
const contestInfo = ref<contestDetail | null>(null)
const contestProblemInfo = ref<contestProblemDetail | null>(null)

const loading = ref(false)
const submitLoading = ref(false)
const codeSubmitCardRef = ref<InstanceType<typeof CodeSubmitCard> | null>(null)

// 当前显示的模式：'content' 或 'submit'
const displayMode = ref<'content' | 'submit'>('content')

// 当前显示的题目信息
const currentProblem = computed(() => {
    if (isInContest.value && contestProblemInfo.value) {
        return {
            problemId: contestProblemInfo.value.problemId,
            title: contestProblemInfo.value.title,
            timeLimit: contestProblemInfo.value.timeLimit,
            memoryLimit: contestProblemInfo.value.memoryLimit,
            rating: contestProblemInfo.value.rating,
            judgeType: contestProblemInfo.value.judgeType,
            content: contestProblemInfo.value.content,
        }
    }
    if (problemInfo.value) {
        return {
            problemId: problemInfo.value.problemId,
            title: problemInfo.value.title,
            timeLimit: problemInfo.value.timeLimit,
            memoryLimit: problemInfo.value.memoryLimit,
            rating: problemInfo.value.rating,
            judgeType: problemInfo.value.judgeType,
            content: problemInfo.value.content,
        }
    }
    return null
})

const loadProblem = async () => {
    loading.value = true
    try {
        if (contestId.value) {
            // 比赛模式：并行加载比赛信息和比赛题目
            const [contest, problem] = await Promise.all([
                contestStore.getContestDetail(contestId.value),
                contestStore.getContestProblemInfo(contestId.value, problemId.value),
            ])
            contestInfo.value = contest
            contestProblemInfo.value = problem
        } else {
            // 普通模式
            const detail = await problemStore.getProblemDetail({problemId: problemId.value})
            problemInfo.value = {
                ...detail,
                problemId: problemId.value,
            }
        }
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '题目加载失败')
    } finally {
        loading.value = false
    }
}

watch([problemId, contestId], () => loadProblem(), {immediate: true})

const handleSubmit = async (code: string, language: string) => {
    if (!code) {
        ElMessage.error('请输入代码')
        return
    }

    if (!userStore.isLoggedIn) {
        ElMessage.error('请先登录')
        return
    }

    submitLoading.value = true
    try {
        const result = await coreStore.submitCode({
            code,
            username: userStore.username!,
            problemId: problemId.value,
            language,
            ...(isInContest.value && {contestId: contestId.value}),
        })
        ElMessage.success('提交成功，正在评测...')
        codeSubmitCardRef.value?.clearCode()
        router.push(`/submission/${result.submissionId}`)
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '提交失败')
    } finally {
        submitLoading.value = false
    }
}

const switchToSubmitMode = () => {
    displayMode.value = 'submit'
}

const switchToContentMode = () => {
    displayMode.value = 'content'
}
</script>

<template>
    <el-container v-loading="loading" class="problem-container">
        <el-main :class="{'is-contest': isInContest}">
            <el-space direction="vertical" :size="16" fill style="width: 100%;">
                <ProblemInfoCard
                    :problemId="currentProblem?.problemId ?? problemId"
                    :title="currentProblem?.title ?? ''"
                    :time-limit="currentProblem?.timeLimit ?? 0"
                    :memory-limit="currentProblem?.memoryLimit ?? 0"
                    :rating="currentProblem?.rating ?? 0"
                    :judge-type="currentProblem?.judgeType ?? ''"
                />
                <el-card v-if="displayMode === 'content'">
                    <template #header>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <el-text tag="b" size="large">题目描述</el-text>
                            <el-button type="primary" @click="switchToSubmitMode">
                                提交代码
                            </el-button>
                        </div>
                    </template>
                    <ProblemContentCard :content="currentProblem?.content ?? ''"/>
                </el-card>
                <el-card v-if="displayMode === 'submit'">
                    <template #header>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <el-text tag="b" size="large">提交代码</el-text>
                            <el-button @click="switchToContentMode">
                                返回题面
                            </el-button>
                        </div>
                    </template>
                    <CodeSubmitCard
                        ref="codeSubmitCardRef"
                        :loading="submitLoading"
                        @submit="handleSubmit"
                    />
                </el-card>
            </el-space>
        </el-main>
        <el-aside width="320px" v-if="isInContest">
            <ContestInfoCard :contest="contestInfo" :loading="loading"/>
        </el-aside>
    </el-container>
</template>

<style scoped>
.problem-container {
    max-width: 1600px;
    margin: 0 auto;
}

.el-main.is-contest {
    padding: 16px;
}

.el-aside {
    padding: 16px 0 16px 0;
}
</style>
