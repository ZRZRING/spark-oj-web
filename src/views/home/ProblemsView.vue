<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {problemsReq} from '@/stores/problem_type.ts'
import {getProblems} from '@/stores/problem_store.ts'
import CardItem from '@/components/CardItem.vue'

const pageInfo = ref<problemsReq>({
    page: 1,
    size: 50,
})
const total = ref<number>(0)
const handleSizeChange = (size: number) => {
    pageInfo.value.size = size
    getProblems()
}
const handleCurrentChange = (page: number) => {
    pageInfo.value.page = page
    getProblems()
}
const problemSet = ref<problemsReq[]>([])
const getProblems = async () => {
    const res = await getProblems(req.value)
    problemSet.value = res.problems
    total.value = res.total
}
onMounted(async () => {
    getProblems()
})

</script>

<template>
    <CardItem>
        <template #title>
            题目列表
        </template>
        <template #content>
            <el-table :data="problemSet">
                <el-table-column prop="pid" label="题目ID"/>
                <el-table-column prop="title" label="题目名称">
                    <template #default="{ row }">
                        <el-link :href="`/problem/${row.pid}`" :underline="false">{{ row.title }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="题目类型"/>
                <el-table-column prop="score" label="题目分数"/>
            </el-table>
        </template>

    </CardItem>
    <el-pagination v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.size"
                   :page-sizes="[20, 50, 100, 200]"
                   background layout="total, sizes, prev, pager, next, jumper" :total="total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end"/>
</template>

<style scoped>

</style>
