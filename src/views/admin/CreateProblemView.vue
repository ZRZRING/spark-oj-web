<script setup lang="ts">
import CardItem from '@/components/CardItem.vue'
import MonacoEditorPanel from '@/components/MonacoEditorPanel.vue'
import { useProblemStore } from '@/stores/problem'
import { JUDGE_TYPE_OPTIONS } from '@/utils/enum'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const problemStore = useProblemStore()
const userStore = useUserStore()

const problem = ref({
    pid: '',
    title: '',
    timeLimit: 1000,
    memoryLimit: 1024,
    rating: 800,
    judgeType: 1,
    content: '',
})

const loading = ref(false)
const initLoading = ref(false)

const isEditMode = computed(() => !!route.params.pid)

const pageTitle = computed(() => isEditMode.value ? '编辑题目' : '新建题目')
const submitButtonText = computed(() => isEditMode.value ? '保存' : '提交')

const loadProblemDetail = async () => {
    if (!isEditMode.value) return
    const pid = route.params.pid as string
    initLoading.value = true
    try {
        const data = await problemStore.getProblemDetail({ pid })
        problem.value = {
            pid: data.pid,
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
            await problemStore.updateProblem({
                pid: problem.value.pid,
                title: problem.value.title,
                judgeType: problem.value.judgeType,
                timeLimit: Number(problem.value.timeLimit),
                memoryLimit: Number(problem.value.memoryLimit),
                rating: Number(problem.value.rating),
                content: problem.value.content,
            })
            ElMessage.success('题目更新成功')
        } else {
            await problemStore.createProblem({
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
    <CardItem v-loading="initLoading">
        <template #title>
            <span>{{ pageTitle }}</span>
        </template>
        <template #extra>
            <el-button type="primary" @click="handleSubmit" :loading="loading">{{ submitButtonText }}</el-button>
        </template>
        <template #content>
            <el-form label-position="top">
                <el-row :gutter="16">
                    <el-col :xs="24" :sm="12" :md="12">
                        <el-form-item label="题目名称" prop="title">
                            <el-row :gutter="12" style="width: 100%;">
                                <el-col>
                                    <el-input v-model="problem.title" autocomplete="off" placeholder="请输入题目名称" />
                                </el-col>
                            </el-row>
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
                        <el-form-item label="题面" prop="content">
                            <MonacoEditorPanel v-model="problem.content" language="markdown" :height="420" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </CardItem>
</template>
