<script setup lang="ts">
import FooterItem from '@/components/FooterItem.vue'
import AdminSidebarItem from '@/components/AdminSidebarItem.vue'
import HeaderItem from '@/components/HeaderItem.vue'

</script>

<template>
    <el-container class="container" direction="vertical">
        <el-header class="header">
            <HeaderItem />
        </el-header>
        <el-container>
            <AdminSidebarItem />
            <el-main class="main">
                <router-view />
            </el-main>
        </el-container>
        <el-footer class="container">
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
.container {
    padding: 0;
}
</style>
