<script setup lang="ts"></script>

<template>
  <div class="footer">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item id="localtime">当前时间</el-breadcrumb-item>
      <el-breadcrumb-item id="introduce">介绍</el-breadcrumb-item>
      <el-breadcrumb-item id="judge_server">判题服务</el-breadcrumb-item>
      <el-breadcrumb-item id="result">判题结果</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item id="version">Version: 0.1.0</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 10px 0;
}
</style>
