<script setup lang="ts">
import HeaderItem from '@/components/HeaderItem.vue'
import FooterItem from '@/components/FooterItem.vue'
</script>

<template>
  <el-container class="container">
    <el-header class="header">
      <HeaderItem />
    </el-header>
    <el-main class="main">
      <router-view />
    </el-main>
    <el-footer class="footer">
      <FooterItem />
    </el-footer>
  </el-container>
</template>

<style scoped>
.container {
  width: 100%;
}
.header,
.main,
.footer {
  padding: 0;
}
</style>
