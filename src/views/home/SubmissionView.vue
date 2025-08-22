<script setup lang="ts">

import CardItem from '@/components/CardItem.vue'
import {onMounted, ref} from 'vue';
import type {getSubmissionsReq, submission} from "@/stores/submission_type.ts";
import {useSubmissionStore} from "@/stores/submission_store.ts";

const submissionStore = useSubmissionStore();

const req = ref<getSubmissionsReq>({page: 1, size: 50})

const total = ref<number>(0)
const submissions = ref<submission[]>([])

const handleSizeChange = (size: number) => {
    req.value.size = size
    getSubmissions()
}
const handleCurrentChange = (page: number) => {
    req.value.page = page
    getSubmissions()
}

const getSubmissions = async () => {
    const res = await submissionStore.getSubmissions(req.value)
    submissions.value = res.submissions
    total.value = res.total
}
onMounted(() => {
    getSubmissions()
})

</script>

<template>
    <CardItem>
        <template #title>
            评测列表
        </template>
        <template #extra>
            <div>评测筛选条件</div>
        </template>
        <template #content>
            <el-table style="width: 100%">
                <el-table-column prop="name" label="ID" width="180"/>
                <el-table-column prop="date" label="提交时间" width="180"/>
                <el-table-column prop="user_id" label="用户ID" width="180"/>
                <el-table-column prop="problem_id" label="题目ID" width="180"/>
                <el-table-column prop="problem_name" label="评测结果" width="180"/>
                <el-table-column prop="result" label="结果" width="180"/>
                <el-table-column prop="time" label="时间" width="180"/>
                <el-table-column prop="memory" label="内存" width="180"/>
                <el-table-column prop="language" label="语言" width="180"/>
            </el-table>
        </template>
    </CardItem>
    <el-pagination v-model:current-page="req.page"
                   v-model:page-size="req.size"
                   :page-sizes="[20, 50, 100, 200]"
                   :total="total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   background layout="total, sizes, prev, pager, next, jumper"
                   style="margin-top: 20px; justify-content: flex-end"/>
</template>

<style scoped>

</style>
