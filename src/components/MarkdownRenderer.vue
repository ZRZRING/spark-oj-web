<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import katex from 'katex'

interface Props {
    /** Markdown 内容 */
    content: string
    /** 是否启用 HTML 标签（默认启用，会自动净化） */
    allowHtml?: boolean
    /** 是否启用 LaTeX 渲染（默认启用） */
    allowLatex?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    allowHtml: true,
    allowLatex: true,
})

/**
 * 转义 HTML 特殊字符
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

/**
 * 预处理 LaTeX 公式，将其替换为占位符，防止 marked 破坏
 * 使用 HTML 注释格式作为占位符，marked 不会处理它
 */
function preprocessLatex(content: string): { text: string; formulas: Map<string, string> } {
    const formulas = new Map<string, string>()
    let counter = 0

    // 保护块级公式 $$...$$
    const processed = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
        const key = `<!--LATEX_BLOCK_${counter++}-->`
        try {
            const rendered = katex.renderToString(formula.trim(), {
                throwOnError: false,
                displayMode: true,
            })
            formulas.set(key, rendered)
        } catch {
            formulas.set(key, `<pre>${escapeHtml(match)}</pre>`)
        }
        return key
    })

    // 保护行内公式 $...$
    const final = processed.replace(/(?<!\\)\$([^\s$][^$]*?)\$/g, (match, formula) => {
        // 跳过已替换的占位符
        if (match.includes('LATEX_BLOCK')) return match
        const key = `<!--LATEX_INLINE_${counter++}-->`
        try {
            const rendered = katex.renderToString(formula.trim(), {
                throwOnError: false,
                displayMode: false,
            })
            formulas.set(key, rendered)
        } catch {
            formulas.set(key, escapeHtml(match))
        }
        return key
    })

    return { text: final, formulas }
}

/**
 * 恢复 LaTeX 公式到 HTML
 */
function restoreLatex(html: string, formulas: Map<string, string>): string {
    let result = html
    formulas.forEach((rendered, key) => {
        result = result.replace(key, rendered)
    })
    return result
}

/**
 * 解析 Markdown 并净化 HTML
 */
const renderedHtml = computed(() => {
    if (!props.content) {
        return ''
    }

    let processedContent = props.content

    // 预处理 LaTeX
    let formulas: Map<string, string> | null = null
    if (props.allowLatex) {
        const result = preprocessLatex(processedContent)
        processedContent = result.text
        formulas = result.formulas
    }

    // 配置 marked 选项
    marked.setOptions({
        breaks: true,
        gfm: true,
    })

    // 解析 markdown
    const rawHtml = marked.parse(processedContent) as string

    // 恢复 LaTeX 公式
    let finalHtml = formulas ? restoreLatex(rawHtml, formulas) : rawHtml

    // 净化 HTML 防止 XSS
    if (props.allowHtml) {
        finalHtml = DOMPurify.sanitize(finalHtml, {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li',
                'blockquote', 'code', 'pre',
                'a', 'img',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'hr', 'div', 'span',
                'sup', 'sub',
                // KaTeX 需要的标签
                'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'msubsup',
                'mfrac', 'msqrt', 'mroot', 'munder', 'mover', 'munderover',
                'mtable', 'mtr', 'mtd', 'mtext', 'mspace', 'menclose',
                'annotation', 'semantics', 'mprescripts', 'none',
            ],
            ALLOWED_ATTR: [
                'href', 'title', 'target', 'rel',
                'src', 'alt', 'width', 'height',
                'class', 'id', 'style',
                // KaTeX 需要的属性
                'xmlns', 'display', 'scriptlevel', 'displaystyle',
            ],
        })
    }

    return finalHtml
})
</script>

<template>
    <div class="markdown-renderer" v-html="renderedHtml" />
</template>

<style scoped>
.markdown-renderer :deep(h1) {
    font-size: 2em;
    margin: 0.67em 0;
    font-weight: 600;
}

.markdown-renderer :deep(h2) {
    font-size: 1.5em;
    margin: 0.75em 0;
    font-weight: 600;
}

.markdown-renderer :deep(h3) {
    font-size: 1.17em;
    margin: 0.83em 0;
    font-weight: 600;
}

.markdown-renderer :deep(h4) {
    font-size: 1em;
    margin: 1.12em 0;
    font-weight: 600;
}

.markdown-renderer :deep(p) {
    margin: 1em 0;
    line-height: 1.6;
}

.markdown-renderer :deep(a) {
    color: var(--el-color-primary);
    text-decoration: none;
}

.markdown-renderer :deep(a:hover) {
    text-decoration: underline;
}

.markdown-renderer :deep(ul),
.markdown-renderer :deep(ol) {
    margin: 1em 0;
    padding-left: 2em;
}

.markdown-renderer :deep(li) {
    margin: 0.25em 0;
}

.markdown-renderer :deep(blockquote) {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid var(--el-border-color);
    background-color: var(--el-fill-color-light);
}

.markdown-renderer :deep(code) {
    padding: 0.2em 0.4em;
    font-family: 'Courier New', monospace;
    background-color: var(--el-fill-color);
    border-radius: 3px;
    font-size: 0.9em;
}

.markdown-renderer :deep(pre) {
    margin: 1em 0;
    padding: 1em;
    overflow-x: auto;
    background-color: var(--el-fill-color-dark);
    border-radius: 6px;
}

.markdown-renderer :deep(pre code) {
    padding: 0;
    background-color: transparent;
}

.markdown-renderer :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
}

.markdown-renderer :deep(th),
.markdown-renderer :deep(td) {
    padding: 0.5em;
    border: 1px solid var(--el-border-color);
}

.markdown-renderer :deep(th) {
    background-color: var(--el-fill-color-light);
    font-weight: 600;
}

.markdown-renderer :deep(hr) {
    border: none;
    border-top: 1px solid var(--el-border-color);
    margin: 1em 0;
}

.markdown-renderer :deep(img) {
    max-width: 100%;
    height: auto;
}
</style>
