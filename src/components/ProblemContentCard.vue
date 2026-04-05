<script setup lang="ts">
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

defineProps<{
    content: string
}>()
</script>

<template>
    <MarkdownRenderer :content="content"/>
</template>