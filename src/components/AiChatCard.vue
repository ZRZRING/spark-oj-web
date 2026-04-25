<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Setting, User } from '@element-plus/icons-vue'
import { type ChatMessage, buildSystemPrompt, getProvider, getSelectedModel, hasApiKey, streamChat } from '@/utils/ai.ts'
import { getProblemDetail } from '@/api/problem.ts'
import type { submissionDetail } from '@/api/submission.ts'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import AiSettingsDialog from '@/components/AiSettingsDialog.vue'

const props = defineProps<{
    submission: submissionDetail
}>()

interface DisplayMessage {
    role: 'user' | 'assistant'
    content: string
}

const messages = ref<DisplayMessage[]>([])
const inputText = ref('')
const loading = ref(false)
const streamingContent = ref('')
const showSettings = ref(false)
const abortController = ref<AbortController | null>(null)

const problemContent = ref('')
const problemFetched = ref(false)
const currentProvider = ref(getProvider())
const currentModel = ref(getSelectedModel())

const presetQuestions = computed(() => {
    const result = props.submission.result
    if (result === 'Accepted') {
        return ['帮我 Review 这段代码，有什么可以改进的？', '这段代码的时间/空间复杂度如何？', '有没有更优的解法？']
    }
    if (result === 'Wrong Answer') {
        return ['分析我的代码哪里出错了', '给出这道题的正确思路', '帮我修复代码中的 bug']
    }
    if (result === 'Time Limit Exceeded') {
        return ['如何优化时间复杂度？', '帮我分析哪里导致了超时', '给出更高效的算法']
    }
    if (result === 'Memory Limit Exceeded') {
        return ['如何优化空间复杂度？', '帮我减少内存使用', '分析内存泄漏原因']
    }
    if (result === 'Runtime Error') {
        return ['分析运行时错误的原因', '帮我修复运行时错误', '检查边界条件处理']
    }
    if (result === 'Compile Error') {
        return ['帮我修复编译错误', '指出语法问题']
    }
    return ['分析我的代码', '给出解题思路', '帮我优化代码']
})

const systemPrompt = computed(() =>
    buildSystemPrompt({
        problemContent: problemContent.value,
        code: props.submission.code,
        language: props.submission.language,
        result: props.submission.result,
        timeCost: props.submission.timeCost,
        memoryCost: props.submission.memoryCost,
    }),
)

const fetchProblem = async () => {
    if (problemFetched.value) return
    try {
        const detail = await getProblemDetail({ problemId: props.submission.problemId })
        problemContent.value = detail.content
    } catch {
        problemContent.value = ''
    }
    problemFetched.value = true
}

watch(
    () => props.submission,
    () => {
        fetchProblem()
    },
    { immediate: true },
)

const chatContainer = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
    await nextTick()
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
}

const sendMessage = async (text: string) => {
    if (!text.trim() || loading.value) return
    if (!hasApiKey()) {
        showSettings.value = true
        return
    }

    const userMsg: DisplayMessage = { role: 'user', content: text.trim() }
    messages.value.push(userMsg)
    inputText.value = ''
    loading.value = true
    streamingContent.value = ''

    const apiMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt.value },
        ...messages.value.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ]

    abortController.value = new AbortController()

    await scrollToBottom()

    await streamChat(
        apiMessages,
        (chunk) => {
            streamingContent.value += chunk
            scrollToBottom()
        },
        () => {
            messages.value.push({ role: 'assistant', content: streamingContent.value })
            streamingContent.value = ''
            loading.value = false
            abortController.value = null
            scrollToBottom()
        },
        (err) => {
            streamingContent.value = ''
            loading.value = false
            abortController.value = null
            messages.value.push({ role: 'assistant', content: `**错误**: ${err.message}` })
            scrollToBottom()
        },
        abortController.value.signal,
    )
}

const stopGeneration = () => {
    if (abortController.value) {
        abortController.value.abort()
        if (streamingContent.value) {
            messages.value.push({ role: 'assistant', content: streamingContent.value })
        }
        streamingContent.value = ''
        loading.value = false
        abortController.value = null
    }
}

const clearChat = () => {
    messages.value = []
    streamingContent.value = ''
}

onBeforeUnmount(() => {
    if (abortController.value) {
        abortController.value.abort()
    }
})
</script>

<template>
    <el-card shadow="never" class="ai-chat-card">
        <template #header>
            <div class="card-header">
                <span class="header-title">AI 答疑助手 · {{ currentModel }}</span>
                <el-space :size="8">
                    <el-button text size="small" @click="clearChat" :disabled="messages.length === 0">
                        清空对话
                    </el-button>
                    <el-button text size="small" @click="showSettings = true">
                        <el-icon><Setting /></el-icon>
                        设置
                    </el-button>
                </el-space>
            </div>
        </template>

        <div class="chat-body" ref="chatContainer">
            <div v-if="messages.length === 0 && !streamingContent" class="chat-empty">
                <div class="empty-hint">向 AI 提问，分析你的代码</div>
                <div class="preset-list">
                    <el-button
                        v-for="q in presetQuestions"
                        :key="q"
                        size="small"
                        round
                        @click="sendMessage(q)"
                    >
                        {{ q }}
                    </el-button>
                </div>
            </div>

            <template v-else>
                <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-message', `msg-${msg.role}`]">
                    <div class="msg-avatar">
                        <el-avatar v-if="msg.role === 'user'" :size="28" :icon="User" />
                        <el-avatar v-else :size="28" style="background-color: var(--el-color-primary)">
                            AI
                        </el-avatar>
                    </div>
                    <div class="msg-body">
                        <MarkdownRenderer :content="msg.content" />
                    </div>
                </div>
                <div v-if="streamingContent" class="chat-message msg-assistant">
                    <div class="msg-avatar">
                        <el-avatar :size="28" style="background-color: var(--el-color-primary)">AI</el-avatar>
                    </div>
                    <div class="msg-body">
                        <MarkdownRenderer :content="streamingContent" />
                        <span class="cursor-blink">▌</span>
                    </div>
                </div>
            </template>
        </div>

        <div class="chat-input">
            <el-input
                v-model="inputText"
                placeholder="输入你的问题..."
                @keyup.enter="sendMessage(inputText)"
                :disabled="loading"
            >
                <template #append>
                    <el-button v-if="!loading" @click="sendMessage(inputText)" :disabled="!inputText.trim()">
                        发送
                    </el-button>
                    <el-button v-else @click="stopGeneration" type="danger" plain>
                        停止
                    </el-button>
                </template>
            </el-input>
        </div>

        <AiSettingsDialog v-model="showSettings" @update:model-value="(v: boolean) => { if (!v) { currentProvider = getProvider(); currentModel = getSelectedModel() } }" />
    </el-card>
</template>

<style scoped>
.ai-chat-card {
    margin-bottom: 20px;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-title {
    font-size: 16px;
    font-weight: 600;
}

.chat-body {
    max-height: 480px;
    overflow-y: auto;
    min-height: 120px;
    padding: 4px 0;
}

.chat-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
}

.empty-hint {
    color: var(--el-text-color-secondary);
    font-size: 14px;
}

.preset-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}

.chat-message {
    display: flex;
    gap: 12px;
    padding: 12px 0;
}

.chat-message + .chat-message {
    border-top: 1px solid var(--el-border-color-lighter);
}

.msg-avatar {
    flex-shrink: 0;
}

.msg-body {
    flex: 1;
    min-width: 0;
    line-height: 1.6;
    font-size: 14px;
}

.msg-body :deep(p) {
    margin: 0.4em 0;
}

.msg-user .msg-body {
    color: var(--el-text-color-primary);
}

.msg-assistant .msg-body {
    color: var(--el-text-color-regular);
}

.cursor-blink {
    animation: blink-cursor 1s step-end infinite;
    color: var(--el-text-color-secondary);
}

@keyframes blink-cursor {
    50% {
        opacity: 0;
    }
}

.chat-input {
    padding-top: 12px;
    border-top: 1px solid var(--el-border-color-lighter);
    margin-top: 8px;
}
</style>
