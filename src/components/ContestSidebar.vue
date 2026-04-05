<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { List, Document, Trophy } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const contestId = computed(() => String(route.params.contestId ?? ''))

interface MenuItem {
    key: string
    label: string
    icon: typeof List
}

const menuItems: MenuItem[] = [
    { key: 'problems', label: '题目列表', icon: List },
    { key: 'submissions', label: '提交记录', icon: Document },
    { key: 'ranking', label: '榜单', icon: Trophy },
]

const activeMenu = computed(() => {
    const path = route.path
    if (path.includes('/submissions')) return 'submissions'
    if (path.includes('/ranking')) return 'ranking'
    return 'problems'
})

const handleMenuSelect = (key: string) => {
    router.push(`/contest/${contestId.value}/${key}`)
}
</script>

<template>
    <el-menu
        :default-active="activeMenu"
        @select="handleMenuSelect"
        class="contest-sidebar-menu"
    >
        <el-menu-item v-for="item in menuItems" :key="item.key" :index="item.key">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
        </el-menu-item>
    </el-menu>
</template>

<style scoped>
.contest-sidebar-menu {
    border-right: none;
}

.contest-sidebar-menu .el-menu-item {
    height: 48px;
    line-height: 48px;
}
</style>
