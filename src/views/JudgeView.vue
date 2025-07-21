<script setup lang="ts">
import MainCard from '@/components/MainCard.vue'
import { onMounted, ref } from 'vue';
import type { pageInfo } from '@/stores/types/page'
import type { judgeSetReq } from '@/stores/types/judge';
import { getJudgeSet } from '@/stores/judge'

const pageInfo = ref<pageInfo>({
  page: 1,
  size: 50,
})
const total = ref<number>(0)
const handleSizeChange = (size: number) => {
  pageInfo.value.size = size
  getJudgeset()
}
const handleCurrentChange = (page: number) => {
  pageInfo.value.page = page
  getJudgeset()
}

const judgeSet = ref<judgeSetReq[]>([])
const getJudgeset = async () => {
  const res = await getJudgeSet(pageInfo.value)
  judgeSet.value = res.judges
  total.value = res.total
}
onMounted(() => {
  getJudgeset()
})
const judgeResultMap = ref({
  0: {lable:'Accepted',type:'success'},
  1: {lable:'Runtime Error',type:'primary'},
  2: {lable:'Wrong Answer',type:'danger'},
  3: {lable:'Compilation Error',type:'warning'},
  4: {lable:'Time Limit Exceeded',type:'primary'},
  5: {lable:'Memory Limit Exceeded',type:'primary'},
  6: {lable:'Output Limit Exceeded',type:'primary'},
  7: {lable:'Presentation Error',type:'primary'},
  8: {lable:'System Error',type:'info'},
})
</script>

<template>
  <MainCard>
    <template #title>
      评测列表
    </template>
    <template #extra>
      <div>评测筛选条件</div>
    </template>
    <template #content>
      <el-table style="width: 100%">
        <el-table-column prop="name" label="ID" width="180" />
        <el-table-column prop="date" label="提交时间" width="180" />
        <el-table-column prop="user_id" label="用户ID" width="180" />
        <el-table-column prop="problem_id" label="题目ID" width="180" />
        <el-table-column prop="problem_name" label="评测结果" width="180">
          <!-- 待修改 -->
          <template slot-scope="scope">
            <el-tag :type="judgeResultMap[scope.row.result].type">{{judgeResultMap[scope.row.result].lable}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果" width="180" />
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="memory" label="内存" width="180" />
        <el-table-column prop="language" label="语言" width="180" />
      </el-table>
    </template>
  </MainCard>
  <el-pagination v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.size" :page-sizes="[20, 50, 100, 200]"
    background layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
</template>

<style scoped>

</style>
