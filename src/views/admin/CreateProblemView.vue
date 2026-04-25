<script setup lang="ts">
import CodeEditor from '@/components/CodeEditor.vue'
import { getProblemDetail, createProblem, updateProblem } from '@/api/problem'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { JUDGE_TYPE_OPTIONS } from "@/utils/enum.ts";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const problem = ref({
    problemId: '',
    title: '',
    timeLimit: 1000,
    memoryLimit: 1024,
    rating: 800,
    judgeType: '',
    content: '',
})

const loading = ref(false)
const initLoading = ref(false)

const isEditMode = computed(() => !!route.params.problemId)

const pageTitle = computed(() => isEditMode.value ? '编辑题目' : '新建题目')
const submitButtonText = computed(() => isEditMode.value ? '保存' : '提交')

const loadProblemDetail = async () => {
    if (!isEditMode.value) return
    const problemId = route.params.problemId as string
    initLoading.value = true
    try {
        const data = await getProblemDetail({ problemId })
        problem.value = {
            problemId: data.problemId,
            title: data.title,
            timeLimit: data.timeLimit,
            memoryLimit: data.memoryLimit,
            rating: data.rating,
            judgeType: data.judgeType,
            content: data.content,
        }
    } catch (error: any) {
        ElMessage.error(error.message || '加载题目详情失败')
        router.push('/admin/problems')
    } finally {
        initLoading.value = false
    }
}

const handleSubmit = async () => {
    if (!problem.value.title) {
        ElMessage.warning('请输入题目名称')
        return
    }
    if (!problem.value.timeLimit || isNaN(Number(problem.value.timeLimit))) {
        ElMessage.warning('请输入有效的时间限制')
        return
    }
    if (!problem.value.memoryLimit || isNaN(Number(problem.value.memoryLimit))) {
        ElMessage.warning('请输入有效的内存限制')
        return
    }

    loading.value = true
    try {
        if (isEditMode.value) {
            await updateProblem({
                problemId: problem.value.problemId,
                title: problem.value.title,
                judgeType: problem.value.judgeType,
                timeLimit: Number(problem.value.timeLimit),
                memoryLimit: Number(problem.value.memoryLimit),
                rating: Number(problem.value.rating),
                content: problem.value.content,
            })
            ElMessage.success('题目更新成功')
        } else {
            await createProblem({
                title: problem.value.title,
                judgeType: problem.value.judgeType,
                timeLimit: Number(problem.value.timeLimit),
                memoryLimit: Number(problem.value.memoryLimit),
                rating: Number(problem.value.rating),
                createBy: userStore.username || '',
                content: problem.value.content,
            })
            ElMessage.success('题目创建成功')
        }
        router.push('/admin/problems')
    } catch (error: any) {
        ElMessage.error(error.message || (isEditMode.value ? '更新失败' : '创建失败'))
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadProblemDetail()
})
</script>

<template>
    <el-card class="problem-editor-card" v-loading="initLoading">
        <template #header>
            <div class="card-header">
                <span class="title">{{ pageTitle }}</span>
                <el-button type="primary" @click="handleSubmit" :loading="loading">{{ submitButtonText }}</el-button>
            </div>
        </template>
        <el-form label-position="top">
            <el-row :gutter="16">
                <el-col :xs="24" :sm="8" :md="8">
                    <el-form-item label="题目名称" prop="title">
                        <el-input v-model="problem.title" autocomplete="off" placeholder="请输入题目名称" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="4" :md="4">
                    <el-form-item label="评测类型" prop="judgeType">
                        <el-select v-model="problem.judgeType" placeholder="请选择评测类型">
                            <el-option v-for="option in JUDGE_TYPE_OPTIONS" :key="option.value"
                                :label="option.label" :value="option.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="4" :md="4">
                    <el-form-item label="难度" prop="rating">
                        <el-input-number v-model="problem.rating" :min="800" :max="3500" :step="100" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="4" :md="4">
                    <el-form-item label="时间限制" prop="timeLimit">
                        <el-input v-model="problem.timeLimit" autocomplete="off" placeholder="1000">
                            <template #append>ms</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="4" :md="4">
                    <el-form-item label="内存限制" prop="memoryLimit">
                        <el-input v-model="problem.memoryLimit" autocomplete="off" placeholder="1024">
                            <template #append>MB</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="题面 (Markdown)" prop="content">
                        <CodeEditor
                            v-model="problem.content"
                            language="markdown"
                            :height="420"
                            placeholder="请输入题目内容，支持 Markdown 格式"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>

<style scoped>
.problem-editor-card {
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
</style>
