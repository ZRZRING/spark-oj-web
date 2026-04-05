<script setup lang="ts">
import {computed} from 'vue'
import {Calendar, List, Unlock} from '@element-plus/icons-vue'
import {type contestDetail} from '@/stores/contest.ts'

const props = withDefaults(defineProps<{
    contest: contestDetail | null
    loading?: boolean
}>(), {
    loading: false,
})

const problemCount = computed(() => props.contest?.problems?.length ?? 0)
</script>

<template>
    <el-card shadow="never" v-loading="loading">
        <template #header>
            <span style="font-weight: bold;">竞赛信息</span>
        </template>
        <el-space direction="vertical" :size="12" alignment="flex-start" style="width: 100%;">
            <el-space :size="8">
                <el-icon><List /></el-icon>
                <el-text>{{ problemCount }} 个问题</el-text>
            </el-space>
            <el-space :size="8">
                <el-icon><Calendar /></el-icon>
                <el-text>{{ contest?.startTime }}</el-text>
            </el-space>
            <el-space :size="8">
                <el-icon><Unlock /></el-icon>
                <el-text>公开参加</el-text>
            </el-space>
        </el-space>
    </el-card>
</template>
