<script setup lang="ts">
import CardItem from '@/components/CardItem.vue'
import { usePagedList } from '@/composables/usePagedList'
import {type getProblemsData, type getProblemsReq, type problem, useProblemStore} from "@/stores/problem.ts";

const problemStore = useProblemStore()

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
    fetcher: (req) => problemStore.getProblems(req),
    selectItems: (data) => data.problems,
    selectTotal: (data) => data.total,
})

</script>

<template>
    <CardItem class="problems-card">
        <template #title>
            题目列表
        </template>
        <template #content>
            <el-table :data="problemSet" v-loading="loading">
                <el-table-column prop="pid" label="题目ID" />
                <el-table-column prop="title" label="题目名称">
                    <template #default="{ row }">
                        <router-link :to="`/problem/${row.pid}`">{{ row.title }}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="题目类型" />
                <el-table-column prop="score" label="题目分数" />
            </el-table>
        </template>

    </CardItem>
    <el-pagination v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.size"
        :page-sizes="[20, 50, 100, 200]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end" />
</template>

<style scoped>
.problems-card {
    margin: 20px auto;
    max-width: 1100px;
}
</style>
