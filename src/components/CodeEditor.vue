<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, type ViewUpdate } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultHighlightStyle, syntaxHighlighting, bracketMatching } from '@codemirror/language'

interface Props {
    modelValue: string
    language?: 'markdown' | 'cpp' | 'java' | 'python'
    height?: number | string
    placeholder?: string
    readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    language: 'cpp',
    height: 400,
    placeholder: '',
    readonly: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const editorContainer = ref<HTMLElement | null>(null)
const editorView = shallowRef<EditorView | null>(null)

// 主题配置，后续可以支持开发者添加更多主题
const currentTheme = ref('atom-one-dark')
const themes: Record<string, any> = {
    'atom-one-dark': oneDark,
    'default-light': [], // 使用 CodeMirror 默认的浅色主题，原生且干净类似 GitHub Light
}

// 获取语言支持
const getLanguageExtension = (lang: string) => {
    switch (lang) {
        case 'markdown':
            return markdown()
        case 'cpp':
            return cpp()
        case 'java':
            return java()
        case 'python':
            return python()
        default:
            return cpp()
    }
}

// 创建编辑器
const createEditor = () => {
    if (!editorContainer.value) return

    const updateListener = EditorView.updateListener.of((update: ViewUpdate) => {
        if (update.docChanged) {
            const value = update.state.doc.toString()
            emit('update:modelValue', value)
        }
    })

    const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        getLanguageExtension(props.language),
        themes[currentTheme.value],
        updateListener,
        EditorView.lineWrapping,
        EditorView.editable.of(!props.readonly),
        EditorState.tabSize.of(4),
    ]

    // placeholder 支持
    if (props.placeholder) {
        const placeholderTheme = EditorView.baseTheme({
            '.cm-content:empty::before': {
                content: `"${props.placeholder}"`,
                color: 'var(--el-text-color-placeholder)',
                fontStyle: 'italic',
            },
        })
        extensions.push(placeholderTheme)
    }

    const state = EditorState.create({
        doc: props.modelValue,
        extensions,
    })

    editorView.value = new EditorView({
        state,
        parent: editorContainer.value,
    })
}

// 更新编辑器内容
const updateContent = (value: string) => {
    if (editorView.value && editorView.value.state.doc.toString() !== value) {
        editorView.value.dispatch({
            changes: {
                from: 0,
                to: editorView.value.state.doc.length,
                insert: value,
            },
        })
    }
}

// 重新创建编辑器 (如语言或主题改变时)
const recreateEditor = () => {
    if (editorView.value) {
        editorView.value.destroy()
        createEditor()
    }
}

// 销毁编辑器
const destroyEditor = () => {
    if (editorView.value) {
        editorView.value.destroy()
        editorView.value = null
    }
}

watch(() => props.modelValue, updateContent)
watch(() => props.language, recreateEditor)
watch(currentTheme, recreateEditor)

onMounted(createEditor)
onBeforeUnmount(destroyEditor)
</script>

<template>
    <div class="code-editor-wrapper">
        <div class="editor-header" v-if="!readonly">
            <el-select v-model="currentTheme" size="small" style="width: 150px;">
                <el-option label="Atom One Dark" value="atom-one-dark" />
                <el-option label="Default Light" value="default-light" />
                <!-- 后续可以在此处或 themes 中注册更多主题 -->
            </el-select>
        </div>
        <div ref="editorContainer" class="code-editor"
            :style="{ height: typeof height === 'number' ? `${height}px` : height }" />
    </div>
</template>

<style scoped>
.code-editor-wrapper {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
}

.editor-header {
    display: flex;
    justify-content: flex-end;
    padding: 4px 8px;
    background-color: var(--el-fill-color-light);
    border-bottom: 1px solid var(--el-border-color);
}

.code-editor {
    width: 100%;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

.code-editor :deep(.cm-editor) {
    height: 100%;
    width: 100%;
}

.code-editor :deep(.cm-scroller) {
    overflow: auto;
}

.code-editor :deep(.cm-content) {
    padding: 8px 0;
}

.code-editor :deep(.cm-line) {
    padding: 0 8px;
}
</style>
