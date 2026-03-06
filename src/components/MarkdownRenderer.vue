<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface Props {
  /** Markdown 内容 */
  content: string
  /** 是否启用 HTML 标签（默认启用，会自动净化） */
  allowHtml?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowHtml: true,
})

/**
 * 解析 Markdown 并净化 HTML
 */
const renderedHtml = computed(() => {
  if (!props.content) {
    return ''
  }

  // 配置 marked 选项
  marked.setOptions({
    breaks: true,
    gfm: true,
  })

  // 解析 markdown
  const rawHtml = marked.parse(props.content) as string

  // 净化 HTML 防止 XSS
  if (props.allowHtml) {
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote', 'code', 'pre',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr', 'div', 'span',
        'sup', 'sub',
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel',
        'src', 'alt', 'width', 'height',
        'class', 'id',
      ],
    })
  }

  return rawHtml
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
