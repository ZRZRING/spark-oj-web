<script setup lang="ts">
import CodeEditor from '@/components/CodeEditor.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { getContestDetail, getContestProblems, createContest, updateContest } from '@/api/contest'
import { getProblems } from '@/api/problem'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { problem } from '@/api/problem'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const contestData = ref({
    contestId: '',
    title: '',
    practice: false,
    startTime: '',
    endTime: '',
    lockTime: '',
    description: '',
    problems: [] as string[],
    password: ''
})

const loading = ref(false)
const initLoading = ref(false)

const isEditMode = computed(() => !!route.params.contestId)
const pageTitle = computed(() => isEditMode.value ? '编辑比赛' : '新建比赛')
const submitButtonText = computed(() => isEditMode.value ? '保存' : '提交')

// Problem selection
const searchProblemKeyword = ref('')
const problemList = ref<problem[]>([])
const searchProblemLoading = ref(false)

const searchProblems = async (query: string) => {
    loading.value = true
    try {
        const res = await getProblems({ page: 1, size: 50 })
        const keyword = query.trim().toLowerCase()
        if (keyword) {
            problemList.value = res.problems.filter(p => 
                p.problemId.toLowerCase().includes(keyword) || 
                p.title.toLowerCase().includes(keyword)
            )
        } else {
            problemList.value = res.problems
        }
    } catch (e) {
        ElMessage.error('获取题目失败')
    } finally {
        loading.value = false
    }
}

const loadContestDetail = async () => {
    if (!isEditMode.value) return
    const contestId = route.params.contestId as string
    initLoading.value = true
    try {
        const data = await getContestDetail(contestId)
        const problemsData = await getContestProblems(contestId)
        contestData.value = {
            contestId: data.contestId,
            title: data.title,
            practice: false,
            startTime: data.startTime ? new Date(data.startTime).toISOString() : '',
            endTime: data.endTime ? new Date(data.endTime).toISOString() : '',
            lockTime: data.lockTime ? new Date(data.lockTime).toISOString() : '',
            description: data.description,
            problems: problemsData.problems ? problemsData.problems.map(p => String(p.problemId)) : [],
            password: ''
        }
        
        // preload current selected problems
        if (contestData.value.problems.length > 0) {
            await searchProblems('')
        }
    } catch (error: any) {
        ElMessage.error(error.message || '加载比赛详情失败')
        router.push('/admin/contests')
    } finally {
        initLoading.value = false
    }
}

const handleSubmit = async () => {
    if (!contestData.value.title) {
        ElMessage.warning('请输入比赛标题')
        return
    }
    if (!contestData.value.startTime || !contestData.value.endTime) {
        ElMessage.warning('请选择比赛的起止时间')
        return
    }

    loading.value = true
    try {
        const reqData = {
            title: contestData.value.title,
            password: contestData.value.password,
            problems: contestData.value.problems.map(Number).filter(n => !isNaN(n)),
            description: contestData.value.description,
            startTime: contestData.value.startTime,
            endTime: contestData.value.endTime,
            lockTime: contestData.value.lockTime || undefined,
            createBy: userStore.username || 'admin',
        }

        if (isEditMode.value) {
            await updateContest(contestData.value.contestId, {
                ...reqData,
                timeRequired: !contestData.value.practice, // based on API design UpdateReq -> timeRequired
            })
            ElMessage.success('比赛更新成功')
        } else {
            await createContest({
                ...reqData,
                practice: contestData.value.practice, // based on API design CreateReq -> practice
            })
            ElMessage.success('比赛创建成功')
        }
        router.push('/admin/contests')
    } catch (error: any) {
        ElMessage.error(error.message || (isEditMode.value ? '更新失败' : '创建失败'))
    } finally {
        loading.value = false
    }
}

const resetForm = () => {
    contestData.value = {
        contestId: '',
        title: '',
        practice: false,
        startTime: '',
        endTime: '',
        lockTime: '',
        description: '',
        problems: [] as string[],
        password: ''
    }
}

watch(
    () => route.params.contestId,
    () => {
        resetForm()
        searchProblems('')
        loadContestDetail()
    },
    { immediate: true }
)
</script>

<template>
    <el-card class="contest-editor-card" v-loading="initLoading">
        <template #header>
            <div class="card-header">
                <span class="title">{{ pageTitle }}</span>
                <el-button type="primary" @click="handleSubmit" :loading="loading">{{ submitButtonText }}</el-button>
            </div>
        </template>
        <el-form label-position="top">
            <el-row :gutter="16">
                <el-col :xs="24" :sm="12" :md="12">
                    <el-form-item label="比赛标题" prop="title">
                        <el-input v-model="contestData.title" autocomplete="off" placeholder="请输入比赛标题" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="6" :md="6">
                    <el-form-item label="比赛密码 (选填)" prop="password">
                        <el-input v-model="contestData.password" autocomplete="off" placeholder="留空代表公开" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="6" :md="6">
                    <el-form-item label="类型" prop="practice">
                        <el-switch v-model="contestData.practice" active-text="训练模式 (不限时)" inactive-text="正式比赛" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8">
                    <el-form-item label="开始时间" prop="startTime">
                        <el-date-picker
                            v-model="contestData.startTime"
                            type="datetime"
                            placeholder="选择开始时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DDTHH:mm:ssZ"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8">
                    <el-form-item label="结束时间" prop="endTime">
                        <el-date-picker
                            v-model="contestData.endTime"
                            type="datetime"
                            placeholder="选择结束时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DDTHH:mm:ssZ"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8">
                    <el-form-item label="封榜时间 (选填)" prop="lockTime">
                        <el-date-picker
                            v-model="contestData.lockTime"
                            type="datetime"
                            placeholder="选择封榜时间"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DDTHH:mm:ssZ"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="选择题目" prop="problems">
                        <el-select
                            v-model="contestData.problems"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="搜索并选择题目 (支持题号或标题)"
                            :remote-method="searchProblems"
                            :loading="searchProblemLoading"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="item in problemList"
                                :key="item.problemId"
                                :label="`[${item.problemId}] ${item.title}`"
                                :value="item.problemId"
                            >
                                <span style="float: left">{{ `[${item.problemId}] ${item.title}` }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.judgeType }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="比赛说明 (Markdown)" prop="description">
                        <div class="description-editor">
                            <CodeEditor
                                v-model="contestData.description"
                                language="markdown"
                                :height="300"
                                placeholder="支持 Markdown 和 LaTeX 格式"
                            />
                            <div class="preview-panel">
                                <div class="preview-header">预览</div>
                                <div class="preview-body">
                                    <MarkdownRenderer v-if="contestData.description" :content="contestData.description" />
                                    <span v-else class="preview-placeholder">在左侧输入内容后可在此预览</span>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>

<style scoped>
.contest-editor-card {
    margin: 20px auto;
    max-width: 1100px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 22px;
}

.title {
    font-weight: 600;
}

.description-editor {
    display: flex;
    gap: 16px;
    width: 100%;
}

.description-editor > :first-child {
    flex: 1;
    min-width: 0;
}

.preview-panel {
    flex: 1;
    min-width: 0;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.preview-header {
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    background: var(--el-fill-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
}

.preview-body {
    flex: 1;
    padding: 12px 16px;
    overflow-y: auto;
    max-height: 300px;
}

.preview-placeholder {
    color: var(--el-text-color-placeholder);
    font-size: 14px;
}
</style>
