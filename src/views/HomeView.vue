<script setup lang="ts">
import MainCard from '@/components/MainCard.vue'
</script>

<template>
  <MainCard class="announcement_card">
    <template #title>
      <span>公告</span>
    </template>
    <template #extra>
      <el-link>更多</el-link>
    </template>
    <template #content>
      <div class="announcement_list">
        <el-row>
          <span>公告标题</span>
        </el-row>
        <el-row>
          <span>发稿人</span>
        </el-row>
      </div>
      <div class="announcement_list">
        <el-row>
          <span>公告标题</span>
        </el-row>
        <el-row>
          <span>发稿人</span>
        </el-row>
      </div>

      <div class="announcement_list">
        <el-row>
          <span>公告标题</span>
        </el-row>
        <el-row>
          <span>发稿人</span>
        </el-row>
      </div>

      <div class="announcement_list">
        <el-row>
          <span>公告标题</span>
        </el-row>
        <el-row>
          <span>发稿人</span>
        </el-row>
      </div>
    </template>
  </MainCard>
</template>

<style scoped>
.announcement_card{
  margin-left: 150px;
  margin-right: 150px;
}
.announcement_list{
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #eaeaea;
  padding: 10px;
}
</style>
