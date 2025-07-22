<script setup lang="ts">
import MainCard from '@/components/MainCard.vue'
import { ref, onMounted } from 'vue'
import type { adminProblemSetReq } from '@/stores/types/adminProblem'
import { getAdminProblemSet } from '@/stores/adminProblem'
import type { pageInfo } from '@/stores/types/page'

const pageInfo = ref<pageInfo>({
  page: 1,
  size: 50,
})
const total = ref<number>(0)
const adminProblemset = ref<adminProblemSetReq[]>()
const getAdminProblemset = async () => {
  const res = await getAdminProblemSet(pageInfo.value)
  adminProblemset.value = res.problems
  total.value = res.total
}
onMounted(() => {
  getAdminProblemset()
})
</script>

<template>
  <MainCard>
    <template #title>
      <span>题库</span>
    </template>
    <template #extra>
      <el-button type="primary">新建题目</el-button>
    </template>
    <template #content>
      <el-table style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="name" label="题目名称" width="180" />
        <el-table-column prop="type" label="题目类型" width="180" />
        <el-table-column prop="score" label="AC(人数)/提交" width="180" />
        <el-table-column prop="date" label="创建日期" width="180" />
        <el-table-column prop="author" label="作者" width="180" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row.pid)">编辑</el-button>
            <el-button type="success" @click="handleTestData(row.pid)">测试数据</el-button>
            <el-button type="danger" @click="handleDelete(row.pid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </MainCard>
</template>

<style scoped>

</style>
