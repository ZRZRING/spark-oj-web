<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { problemSetReq } from '@/stores/types/problem'
import { getProblemSet } from '@/stores/problem'
import type { pageInfo } from '@/stores/types/page'

const pageInfo = ref<pageInfo>({
  page: 1,
  size: 50,
})
const total = ref<number>(0)
const handleSizeChange = (size: number) => {
  pageInfo.value.size = size
  getProblemset()
}
const handleCurrentChange = (page: number) => {
  pageInfo.value.page = page
  getProblemset()
}
const problemSet = ref<problemSetReq[]>([])
const getProblemset = async () => {
  const res = await getProblemSet(pageInfo.value)
  problemSet.value = res.problems
  total.value = res.total
}
onMounted(async () => {
  await getProblemset()
})

</script>

<template>
  <el-table :data="problemSet">
    <el-table-column prop="pid" label="题目ID" />
    <el-table-column prop="title" label="题目名称" />
  </el-table>
  <el-pagination v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.size" :page-sizes="[20, 50, 100, 200]"
    background layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
</template>

<style scoped>

</style>
