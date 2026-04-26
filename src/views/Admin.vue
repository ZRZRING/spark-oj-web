<script setup lang="ts">

import HeaderItem from '@/components/HeaderItem.vue'
import FooterItem from '@/components/FooterItem.vue'
import AdminSidebarItem from '@/components/AdminSidebarItem.vue'

</script>

<template>
    <el-container class="container" direction="vertical">
        <el-header class="header">
            <HeaderItem />
        </el-header>
        <el-container class="body-container">
            <AdminSidebarItem />
            <el-main class="body">
                <router-view />
            </el-main>
        </el-container>
        <el-footer class="footer">
            <FooterItem />
        </el-footer>
    </el-container>
</template>

<style scoped>
.container {
    width: 100%;
    min-height: 100vh;
}

.body {
    flex: 1;
}

.header,
.body,
.footer {
    padding: 0;
}
</style>
