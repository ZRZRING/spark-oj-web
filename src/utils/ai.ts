const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'
const STORAGE_KEY = 'deepseek_api_key'

export function getApiKey(): string {
    return localStorage.getItem(STORAGE_KEY) || ''
}

export function setApiKey(key: string) {
    localStorage.setItem(STORAGE_KEY, key)
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
    const apiKey = getApiKey()
    if (!apiKey) {
        onError(new Error('请先设置 DeepSeek API Key'))
        return
    }

    try {
        const res = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
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
