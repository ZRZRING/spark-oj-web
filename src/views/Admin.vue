<script setup lang="ts">
import FooterItem from '@/components/FooterItem.vue'
import AdminSidebarItem from '@/components/AdminSidebarItem.vue'
import AdminHeaderItem from '@/components/AdminHeaderItem.vue'

</script>

<template>
    <el-container class="container">
        <AdminSidebarItem />
        <el-container class="content-container">
            <AdminHeaderItem />
            <el-main class="main">
                <router-view />
            </el-main>
            <el-footer class="footer">
                <FooterItem />
            </el-footer>
        </el-container>
    </el-container>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
}

.content-container {
    min-width: 0;
}

.main,
.footer {
    padding: 0;
}
</style>
