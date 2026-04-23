<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {type submissionDetail, useSubmissionStore} from '@/stores/submission.ts'
import HighlightCode from '@/components/HighlightCode.vue'
import AiChatCard from '@/components/AiChatCard.vue'

const route = useRoute()
const submissionStore = useSubmissionStore()

const loading = ref(true)
const submission = ref<submissionDetail | null>(null)

const submissionId = route.params.submissionId as string

const isPending = computed(() => {
    if (!submission.value) return false
    return submission.value.result === 'Waiting' || submission.value.result === 'Running'
})

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

const alertType = computed(() => {
    if (!submission.value) return 'info'
    const map: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
        success: 'success',
        danger: 'error',
        warning: 'warning',
        info: 'info',
        '': 'info',
    }
    return map[getResultType(submission.value.result)] ?? 'info'
})

const isCE = computed(() => submission.value?.result === 'Compile Error')

let pollTimer: ReturnType<typeof setInterval> | null = null

const fetchSubmission = async () => {
    try {
        submission.value = await submissionStore.getSubmission(submissionId)
    } finally {
        loading.value = false
    }
}

const startPolling = () => {
    if (pollTimer) return
    pollTimer = setInterval(async () => {
        if (!isPending.value) {
            stopPolling()
            return
        }
        try {
            submission.value = await submissionStore.getSubmission(submissionId)
        } catch {
            stopPolling()
        }
    }, 2000)
}

const stopPolling = () => {
    if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
    }
}

onMounted(async () => {
    await fetchSubmission()
    if (isPending.value) {
        startPolling()
    }
})

onBeforeUnmount(() => {
    stopPolling()
})
</script>

<template>
    <div v-loading="loading" class="submission-detail">
        <template v-if="submission">
            <el-alert :type="alertType" show-icon :closable="false" class="status-alert">
                <template #title>
                    <span class="status-title">
                        {{ submission.result }}
                        <span v-if="submission.result === 'Waiting'" class="pending-dots">
                            <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
                        </span>
                        <span v-if="submission.result === 'Running'" class="pending-dots">
                            <span class="dot running">.</span><span class="dot running">.</span><span class="dot running">.</span>
                        </span>
                    </span>
                </template>
                <template v-if="!isCE && !isPending">
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

            <AiChatCard v-if="!isPending" :submission="submission" />
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

.pending-dots {
    display: inline-block;
}

.dot {
    animation: blink 1.4s infinite both;
    font-size: 20px;
    font-weight: 700;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

.dot.running {
    animation: pulse 0.8s infinite alternate;
}

@keyframes blink {
    0%, 20% {
        opacity: 0.2;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
}

@keyframes pulse {
    from {
        opacity: 0.4;
    }
    to {
        opacity: 1;
    }
}

.code-card {
    margin-bottom: 20px;
}

.code-card :deep(.el-card__body) {
    padding: 0;
}
</style>
