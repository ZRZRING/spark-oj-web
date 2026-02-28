<script setup lang="ts">

import CardItem from '@/components/CardItem.vue'
import { usePagedList } from '@/composables/usePagedList';
import {
    type getSubmissionsData,
    type getSubmissionsReq,
    type submission,
    useSubmissionStore
} from "@/stores/submission.ts";

const submissionStore = useSubmissionStore();

const {
    request: req,
    items: submissions,
    total,
    loading,
    handleSizeChange,
    handleCurrentChange,
} = usePagedList<getSubmissionsReq, getSubmissionsData, submission>({
    initialRequest: { page: 1, size: 50 },
    fetcher: (request) => submissionStore.getSubmissions(request),
    selectItems: (data) => data.submissions,
    selectTotal: (data) => data.total,
})

</script>

<template>
    <CardItem class="submission-card">
        <template #title>
            评测列表
        </template>
        <template #extra>
            <div>评测筛选条件</div>
        </template>
        <template #content>
            <el-table :data="submissions" style="width: 100%" v-loading="loading">
                <el-table-column prop="sid" label="提交ID" width="220" />
                <el-table-column prop="title" label="题目标题" min-width="300" />
            </el-table>
        </template>
    </CardItem>
    <el-pagination v-model:current-page="req.page" v-model:page-size="req.size" :page-sizes="[20, 50, 100, 200]"
        :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" background
        layout="total, sizes, prev, pager, next, jumper" style="margin-top: 20px; justify-content: flex-end" />
</template>

<style scoped>
.submission-card {
    margin: 20px auto;
    max-width: 1100px;
}
</style>
