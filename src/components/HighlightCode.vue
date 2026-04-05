<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/default.css'

// 导入需要的语言，可以根据需要添加更多
import cpp from 'highlight.js/lib/languages/cpp'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import c from 'highlight.js/lib/languages/c'
import go from 'highlight.js/lib/languages/go'

hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('java', java)
hljs.registerLanguage('python', python)
hljs.registerLanguage('c', c)
hljs.registerLanguage('go', go)

interface Props {
    code: string
    language?: string
}

const props = withDefaults(defineProps<Props>(), {
    language: 'cpp'
})

const codeBlock = ref<HTMLElement | null>(null)

const highlightCode = () => {
    if (codeBlock.value) {
        // Clear previous highlight classes
        codeBlock.value.className = `language-${props.language}`
        // Remove parsed flag to allow re-highlighting
        delete codeBlock.value.dataset.highlighted
        hljs.highlightElement(codeBlock.value)
    }
}

watch(() => props.code, highlightCode)
watch(() => props.language, highlightCode)

onMounted(() => {
    highlightCode()
})
</script>

<template>
    <div class="highlight-container">
        <pre class="code-pre"><code ref="codeBlock" class="hljs">{{ code }}</code></pre>
    </div>
</template>

<style scoped>
.highlight-container {
    border-radius: 4px;
    background-color: #F3F3F3; /* Match default.css bg */
}

.code-pre {
    margin: 0;
    padding: 0;
}

code.hljs {
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 16px;
    border-radius: 4px;
}
</style>