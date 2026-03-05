<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import loader from '@monaco-editor/loader'
import type * as Monaco from 'monaco-editor'

interface Props {
    modelValue: string
    language?: string
    height?: number | string
    theme?: string
    options?: Monaco.editor.IStandaloneEditorConstructionOptions
}

const props = withDefaults(defineProps<Props>(), {
    language: 'javascript',
    height: 400,
    theme: 'One Dark Pro',
    options: () => ({}),
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const editorContainer = ref<HTMLElement | null>(null)

let editor: Monaco.editor.IStandaloneCodeEditor | null = null

const initEditor = async () => {
    if (!editorContainer.value) return

    const monaco = await loader.init()

    editor = monaco.editor.create(editorContainer.value, {
        value: props.modelValue,
        language: props.language,
        theme: props.theme,
        automaticLayout: true,
        minimap: {
            enabled: false,
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        ...props.options,
    })

    if (editor == null) {
        console.error('Failed to initialize Monaco Editor')
        return
    }

    editor.onDidChangeModelContent(() => {
        const value = editor?.getValue() ?? ''
        emit('update:modelValue', value)
    })
}

const disposeEditor = () => {
    if (editor) {
        editor.dispose()
        editor = null
    }
}

const updateValue = (newValue: string) => {
    if (editor && editor.getValue() !== newValue) {
        editor.setValue(newValue)
    }
}

const updateLanguage = (newLanguage: string) => {
    if (editor) {
        const model = editor.getModel()
        if (model) {
            loader.init().then((monaco) => {
                monaco.editor.setModelLanguage(model, newLanguage)
            })
        }
    }
}

const updateTheme = (newTheme: string) => {
    if (editor) {
        loader.init().then((monaco) => {
            monaco.editor.setTheme(newTheme)
        })
    }
}

watch(() => props.modelValue, updateValue)

watch(() => props.language, updateLanguage)

watch(() => props.theme, updateTheme)

onMounted(initEditor)

onBeforeUnmount(disposeEditor)
</script>

<template>
    <div ref="editorContainer" class="monaco-editor-panel"
        :style="{ height: typeof height === 'number' ? `${height}px` : height }" />
</template>

<style scoped>
.monaco-editor-panel {
    width: 100%;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}
</style>
