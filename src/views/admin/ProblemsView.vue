<script setup lang="ts">
import CardItem from '@/components/CardItem.vue'
import { ref, onMounted } from 'vue'
import type { pageInfoReq } from '@/stores/type'
import type { problem } from '@/stores/problem_type'
import { useProblemStore } from '@/stores/problem_store'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'

const pageInfo = ref<pageInfoReq>({
    page: 1,
    size: 50,
})

const router = useRouter()
const problemStore = useProblemStore()

const total = ref<number>(0)
const adminProblemset = ref<problem[]>([])

const getAdminProblemset = async () => {
    const res = await problemStore.getProblems(pageInfo.value)
    adminProblemset.value = res.problems
    total.value = res.total
}

const handleCreate = () => {
    router.push('/admin/problem/create')
}

const handleEdit = (pid: string) => {
    ElNotification({ type: 'warning', message: `编辑题目 ${pid} 功能暂未开放` })
}

const handleTestData = (pid: string) => {
    ElNotification({ type: 'warning', message: `测试数据管理 ${pid} 功能暂未开放` })
}

const handleDelete = (pid: string) => {
    ElNotification({ type: 'warning', message: `删除题目 ${pid} 功能暂未开放` })
}

onMounted(() => {
    getAdminProblemset()
})
</script>

<template>
    <CardItem>
        <template #title>
            <span>题库</span>
        </template>
        <template #extra>
            <el-button type="primary" @click="handleCreate">新建题目</el-button>
        </template>
        <template #content>
            <el-table :data="adminProblemset" style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="pid" label="ID" width="180" />
                <el-table-column prop="title" label="题目名称" min-width="240" />
                <el-table-column fixed="right" label="操作" width="180">
                    <template #default="{ row }">
                        <el-button type="primary" @click="handleEdit(row.pid)">编辑</el-button>
                        <el-button type="success" @click="handleTestData(row.pid)">测试数据</el-button>
                        <el-button type="danger" @click="handleDelete(row.pid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </CardItem>
</template>

<style scoped></style>
