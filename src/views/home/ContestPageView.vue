<script setup lang="ts">

import { Calendar, Clock, Lock, Search, Trophy } from '@element-plus/icons-vue'
import { usePagedList } from '@/composables/usePagedList'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {type contest, type getContestsData, type getContestsReq, getContests} from "@/api/contest.ts";

const router = useRouter()

const {
    request: req,
    items: contestSet,
    total,
    loading,
    handleSizeChange,
    handleCurrentChange,
} = usePagedList<getContestsReq, getContestsData, contest>({
    initialRequest: {
        page: 1,
        size: 50,
    },
    fetcher: (request) => getContests(request),
    selectItems: (data) => data.contests,
    selectTotal: (data) => data.total,
})

const ruleFilter = ref<'all' | 'practice' | 'regular'>('all')
const statusFilter = ref<'all' | 'running' | 'ended'>('all')
const keyword = ref('')

const parseDate = (value: string): Date | null => {
    if (!value) return null
    const normalized = value.replace(' ', 'T')
    const date = new Date(normalized)
    return Number.isNaN(date.getTime()) ? null : date
}

const isEnded = (item: contest): boolean => {
    const end = parseDate(item.endTime)
    if (!end) return false
    return Date.now() >= end.getTime()
}

const formatDuration = (item: contest): string => {
    const start = parseDate(item.startTime)
    const end = parseDate(item.endTime)
    if (!start || !end) return '-'
    const diffMs = Math.max(0, end.getTime() - start.getTime())
    const hours = Math.round((diffMs / 1000 / 60 / 60) * 10) / 10
    if (hours >= 24) {
        const days = Math.round((hours / 24) * 10) / 10
        return `${days} days`
    }
    return `${hours} hours`
}

const filteredContests = computed(() => {
    const keywordText = keyword.value.trim().toLowerCase()
    return contestSet.value.filter((item) => {
        const hitKeyword = !keywordText
            || item.title.toLowerCase().includes(keywordText)
            || item.contestId.toLowerCase().includes(keywordText)

        const hitRule = ruleFilter.value === 'all'
            || (ruleFilter.value === 'practice' && item.practice)
            || (ruleFilter.value === 'regular' && !item.practice)

        const currentEnded = isEnded(item)
        const hitStatus = statusFilter.value === 'all'
            || (statusFilter.value === 'ended' && currentEnded)
            || (statusFilter.value === 'running' && !currentEnded)

        return hitKeyword && hitRule && hitStatus
    })
})

</script>

<template>
    <el-card v-loading="loading" shadow="never" style="margin: 20px;">
        <el-row justify="space-between" align="middle" :gutter="12" style="margin-bottom: 16px;">
            <el-col :xs="24" :sm="8">
                <el-text tag="b" size="large">All Contests</el-text>
            </el-col>
            <el-col :xs="24" :sm="16">
                <el-space wrap alignment="center" style="width: 100%; justify-content: flex-end;">
                    <el-select v-model="ruleFilter" placeholder="Rule" style="width: 120px;">
                        <el-option label="Rule" value="all" />
                        <el-option label="Practice" value="practice" />
                        <el-option label="Regular" value="regular" />
                    </el-select>
                    <el-select v-model="statusFilter" placeholder="Status" style="width: 120px;">
                        <el-option label="Status" value="all" />
                        <el-option label="Running" value="running" />
                        <el-option label="Ended" value="ended" />
                    </el-select>
                    <el-input v-model="keyword" placeholder="Keyword" clearable style="width: 220px;">
                        <template #suffix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </el-space>
            </el-col>
        </el-row>

        <el-empty v-if="!filteredContests.length" description="暂无比赛" />

        <template v-else>
            <div v-for="(item, index) in filteredContests" :key="item.contestId">
                <el-row :gutter="12" justify="space-between" align="middle" style="padding: 16px 0;">
                    <el-col :xs="24" :sm="18">
                        <el-space alignment="flex-start" :size="16">
                            <el-icon size="28" color="var(--el-color-warning)">
                                <Trophy />
                            </el-icon>
                            <el-space direction="vertical" :size="6" alignment="flex-start">
                                <el-space :size="6" alignment="center">
                                    <el-link type="primary" @click="router.push(`/contest/${item.contestId}`)">{{ item.title }}</el-link>
                                    <el-icon v-if="!item.practice"><Lock /></el-icon>
                                </el-space>
                                <el-space wrap :size="12">
                                    <el-text size="small" type="info">
                                        <el-icon><Calendar /></el-icon>
                                        {{ item.startTime }}
                                    </el-text>
                                    <el-text size="small" type="info">
                                        <el-icon><Clock /></el-icon>
                                        {{ formatDuration(item) }}
                                    </el-text>
                                    <el-tag size="small" effect="plain">{{ item.practice ? 'Practice' : 'Regular' }}</el-tag>
                                </el-space>
                            </el-space>
                        </el-space>
                    </el-col>
                    <el-col :xs="24" :sm="6" style="text-align: right;">
                        <el-tag :type="isEnded(item) ? 'info' : 'success'" effect="light">
                            <el-badge is-dot :type="isEnded(item) ? 'danger' : 'success'" style="margin-right: 8px;" />
                            {{ isEnded(item) ? 'Ended' : 'Running' }}
                        </el-tag>
                    </el-col>
                </el-row>
                <el-divider v-if="index !== filteredContests.length - 1" style="margin: 0;" />
            </div>
        </template>
    </el-card>

    <el-pagination
        v-model:current-page="req.page"
        v-model:page-size="req.size"
        :page-sizes="[20, 50, 100, 200]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin: 0 auto 20px; max-width: 1200px; justify-content: flex-end"
    />
</template>
