<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {type submissionDetail, useSubmissionStore} from '@/stores/submission.ts'
import HighlightCode from '@/components/HighlightCode.vue'

const route = useRoute()
const submissionStore = useSubmissionStore()

const loading = ref(true)
const submission = ref<submissionDetail | null>(null)

const submissionId = route.params.submissionId as string

const getResultType = (result: string): '' | 'success' | 'danger' | 'warning' | 'info' => {
    if (result === 'Accepted') return 'success'
    if (result === 'Wrong Answer') return 'danger'
    if (result === 'Time Limit Exceeded') return 'warning'
    if (result === 'Memory Limit Exceeded') return 'warning'
    if (result === 'Runtime Error') return 'danger'
    if (result === 'Compilation Error') return 'info'
    return ''
}

const alertType = computed(() => {
    if (!submission.value) return 'info'
    const map: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
        success: 'success',
        danger: 'error',
        warning: 'warning',
        info: 'info',
    }
    return map[getResultType(submission.value.result)] ?? 'info'
})

const isCE = computed(() => submission.value?.result === 'Compilation Error')

onMounted(async () => {
    try {
        submission.value = await submissionStore.getSubmission(submissionId)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div v-loading="loading" class="submission-detail">
        <template v-if="submission">
            <el-alert :type="alertType" show-icon :closable="false" class="status-alert">
                <template #title>
                    <span class="status-title">{{ submission.result }}</span>
                </template>
                <template v-if="!isCE">
                    <el-space :size="20">
                        <span>Time: {{ submission.timeCost }}ms</span>
                        <span>Memory: {{ submission.memoryCost }}MB</span>
                        <span>Lang: {{ submission.language }}</span>
                        <span>Author: {{ submission.username }}</span>
                    </el-space>
                </template>
            </el-alert>

            <el-card shadow="never" class="code-card">
                <HighlightCode :code="submission.code" :language="submission.language"/>
            </el-card>
        </template>
    </div>
</template>

<style scoped>
.submission-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.status-alert {
    margin-bottom: 20px;
}

.status-title {
    font-size: 20px;
    font-weight: 600;
}

.code-card {
    margin-bottom: 20px;
}

.code-card :deep(.el-card__body) {
    padding: 0;
}
</style>
