<script setup lang="ts">
import { ref } from 'vue'
import MainCard from '@/components/MainCard.vue'
const tagList = ref([])
const createTag = () => {
  console.log('create tag')
}
const handleEdit = (id: number) => {
  console.log('edit tag', id)
}
const handleDelete = (id: number) => {
  console.log('delete tag', id)
}
</script>

<template>
  <MainCard>
    <template #title>
      <span>标签管理</span>
    </template>

    <template #extra>
      <el-button type="primary" @click="createTag">新建标签</el-button>
    </template>

    <template #content>
      <el-table>
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="name" label="标签名称" width="180" />
        <el-table-column prop="author" label="创建人" width="180" />
        <el-table-column prop="date" label="创建日期" width="180" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row.pid)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row.pid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

  </MainCard>
</template>

<style scoped>

</style>
