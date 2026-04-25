<script setup lang="ts">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { usePagedList } from '@/composables/usePagedList'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {type getProblemsData, type getProblemsReq, type problem, getProblems} from "@/api/problem.ts";

const router = useRouter()

const {
    request: pageInfo,
    items: problemSet,
    total,
    loading,
    handleSizeChange,
    handleCurrentChange,
} = usePagedList<getProblemsReq, getProblemsData, problem>({
    initialRequest: {
        page: 1,
        size: 50,
    },
    fetcher: (req) => getProblems(req),
    selectItems: (data) => data.problems,
    selectTotal: (data) => data.total,
})

const keyword = ref('')
const difficultyFilter = ref<string>('all')

const difficultyOptions = computed(() => {
    const ratings = Array.from(new Set(problemSet.value.map((item) => item.rating))).sort((a, b) => a - b)
    return ratings.map((rating) => ({
        label: String(rating),
        value: String(rating),
    }))
})

const filteredProblems = computed(() => {
    const keywordText = keyword.value.trim().toLowerCase()

    return problemSet.value.filter((item) => {
        const hitKeyword = !keywordText
            || item.title.toLowerCase().includes(keywordText)
            || item.problemId.toLowerCase().includes(keywordText)

        const hitDifficulty = difficultyFilter.value === 'all'
            || String(item.rating) === difficultyFilter.value

        return hitKeyword && hitDifficulty
    })
})

const handleReset = (): void => {
    keyword.value = ''
    difficultyFilter.value = 'all'
}

</script>

<template>
    <el-card v-loading="loading" shadow="never" style="margin: 20px">
        <el-row justify="space-between" align="middle" :gutter="12" style="margin-bottom: 16px;">
            <el-col :xs="24" :sm="8">
                <el-text tag="b" size="large">Problem List</el-text>
            </el-col>
            <el-col :xs="24" :sm="16">
                <el-space wrap alignment="center" style="width: 100%; justify-content: flex-end;">
                    <el-select v-model="difficultyFilter" placeholder="Difficulty" style="width: 140px;">
                        <el-option label="Difficulty" value="all" />
                        <el-option
                            v-for="item in difficultyOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-input v-model="keyword" placeholder="keyword" clearable style="width: 220px;">
                        <template #suffix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                    <el-button type="primary" plain @click="handleReset">
                        <el-icon><RefreshRight /></el-icon>
                        Reset
                    </el-button>
                </el-space>
            </el-col>
        </el-row>

        <el-table :data="filteredProblems">
            <el-table-column label="#" width="70">
                <template #default="scope">
                    {{ (pageInfo.page - 1) * pageInfo.size + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="title" label="Title" min-width="320">
                <template #default="{ row }">
                    <el-link type="primary" @click="router.push(`/problem/${row.problemId}`)">{{ row.title }}</el-link>
                </template>
            </el-table-column>

            <el-table-column label="Level" width="140">
                <template #default="{ row }">
                    <el-tag size="small" type="primary" effect="plain">{{ row.rating }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Type" width="180">
                <template #default="{ row }">
                    {{ row.judgeType }}
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <el-pagination
        v-model:current-page="pageInfo.page"
        v-model:page-size="pageInfo.size"
        :page-sizes="[20, 50, 100, 200]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin: 0 auto 20px; max-width: 1200px; justify-content: flex-end"
    />
</template>

<style scoped>
</style>
