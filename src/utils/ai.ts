export interface AiProvider {
    id: string
    name: string
    apiUrl: string
    models: string[]
    storageKey: string
}

export const PROVIDERS: AiProvider[] = [
    {
        id: 'qwen',
        name: 'Qwen',
        apiUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        models: ['qwen3.6-flash', 'qwen3.6-plus', 'qwen3.6-max', 'qwen3.6-coder-plus'],
        storageKey: 'ai_key_qwen',
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        apiUrl: 'https://api.deepseek.com/chat/completions',
        models: ['deepseek-v4-flash', 'deepseek-v4-pro'],
        storageKey: 'ai_key_deepseek',
    },
]

const SELECTED_PROVIDER_KEY = 'ai_selected_provider'
const SELECTED_MODEL_KEY = 'ai_selected_model'

export function getSelectedProviderId(): string {
    return localStorage.getItem(SELECTED_PROVIDER_KEY) || PROVIDERS[0].id
}

export function setSelectedProviderId(id: string) {
    localStorage.setItem(SELECTED_PROVIDER_KEY, id)
}

export function getSelectedModel(): string {
    return localStorage.getItem(SELECTED_MODEL_KEY) || PROVIDERS[0].models[0]
}

export function setSelectedModel(model: string) {
    localStorage.setItem(SELECTED_MODEL_KEY, model)
}

export function getProvider(id?: string): AiProvider {
    const pid = id || getSelectedProviderId()
    return PROVIDERS.find((p) => p.id === pid) || PROVIDERS[0]
}

export function getApiKey(providerId?: string): string {
    const provider = getProvider(providerId)
    return localStorage.getItem(provider.storageKey) || ''
}

export function setApiKey(key: string, providerId?: string) {
    const provider = getProvider(providerId)
    localStorage.setItem(provider.storageKey, key)
}

export function hasApiKey(): boolean {
    return !!getApiKey()
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export function buildSystemPrompt(context: {
    problemContent: string
    code: string
    language: string
    result: string
    timeCost: number
    memoryCost: number
}): string {
    return `你是一个编程题解助手，帮助用户分析代码和解决算法问题。请用中文回答。

## 题目描述
${context.problemContent || '无题目信息'}

## 用户提交的代码（${context.language}）
\`\`\`${context.language}
${context.code}
\`\`\`

## 判题结果
- 结果：${context.result}
- 耗时：${context.timeCost}ms
- 内存：${context.memoryCost}MB

请根据以上信息，回答用户的问题。`
}

export async function streamChat(
    messages: ChatMessage[],
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (err: Error) => void,
    signal?: AbortSignal,
) {
    const provider = getProvider()
    const model = getSelectedModel()
    const apiKey = getApiKey()
    if (!apiKey) {
        onError(new Error(`请先设置 ${provider.name} API Key`))
        return
    }

    try {
        const res = await fetch(provider.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages,
                stream: true,
            }),
            signal,
        })

        if (!res.ok) {
            const body = await res.text()
            onError(new Error(`API 请求失败 (${res.status}): ${body}`))
            return
        }

        const reader = res.body?.getReader()
        if (!reader) {
            onError(new Error('无法获取响应流'))
            return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed || !trimmed.startsWith('data: ')) continue
                const data = trimmed.slice(6)
                if (data === '[DONE]') {
                    onDone()
                    return
                }
                try {
                    const json = JSON.parse(data)
                    const content = json.choices?.[0]?.delta?.content
                    if (content) {
                        onChunk(content)
                    }
                } catch {
                    // skip malformed JSON
                }
            }
        }

        onDone()
    } catch (e) {
        if ((e as Error).name === 'AbortError') return
        onError(e as Error)
    }
}
