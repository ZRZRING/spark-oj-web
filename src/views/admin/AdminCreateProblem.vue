<script setup lang="ts">
import MainCard from '@/components/MainCard.vue'
import { ref } from 'vue'

const problem = ref({
  name: '',
  timeLimit: '',
  memoryLimit: '',
  type: '0',
  content: '',
})
const handleSubmit = async () => {
  console.log(problem.value); 
}
</script>

<template>
  <MainCard>
    <template #title>
      <span>新建题目</span>
    </template>
    <template #extra>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
    <template #content>
      <el-form>
        <el-form-item label="题目名称" prop="name">
          <el-input v-model="problem.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="时间限制" prop="timeLimit">
          <el-input v-model="problem.timeLimit" autocomplete="off" />ms
        </el-form-item>
        <el-form-item label="内存限制" prop="memoryLimit">
          <el-input v-model="problem.memoryLimit" autocomplete="off" />MB
        </el-form-item>
        <el-form-item label="是否启用特判" prop="type">
          <el-switch v-model="problem.type" active-text="启用" inactive-text="未启用" />
        </el-form-item>
        <el-form-item label="题目" prop="content">
          <el-input v-model="problem.content" autocomplete="off" style="height: 300px;" />
        </el-form-item>
      </el-form>
    </template>
  </MainCard>
</template>

<style scoped>

</style>
