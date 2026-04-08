<script setup lang="ts">
import type { pageInfoReq } from '@/stores/type'
import { useRouter } from 'vue-router'
import { ElNotification, ElMessageBox } from 'element-plus'
import { usePagedList } from '@/composables/usePagedList'
import { computed, ref } from 'vue'
import { type getUsersData, type userItem, useUserStore } from '@/stores/user.ts'
import type { TableInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const {
    request: pageInfo,
    items: adminUserSet,
    total,
    loading,
    handleSizeChange,
    handleCurrentChange,
} = usePagedList<pageInfoReq, getUsersData, userItem>({
    initialRequest: {
        page: 1,
        size: 50,
    },
    fetcher: (request) => userStore.getUsers(request),
    selectItems: (data) => data.users,
    selectTotal: (data) => data.total,
})

const tableRef = ref<TableInstance>()
const selectedRows = ref<userItem[]>([])
const keyword = ref('')

const visibleUserSet = computed(() => {
    const keywordText = keyword.value.trim().toLowerCase()
    if (!keywordText) {
        return adminUserSet.value
    }
    return adminUserSet.value.filter((item) => {
        return item.username.toLowerCase().includes(keywordText)
    })
})

const handleSelectionChange = (rows: userItem[]) => {
    selectedRows.value = rows
}

const handlePageSizeSelect = (value: string | number) => {
    handleSizeChange(Number(value))
}

const handleEdit = (username: string) => {
    ElNotification({ type: 'warning', message: `编辑用户 ${username} 功能暂未开放` })
}

const handleDelete = (username: string) => {
    ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
        type: 'warning'
    }).then(() => {
        ElNotification({ type: 'warning', message: `删除用户 ${username} 功能暂未开放` })
    }).catch(() => {})
}
</script>

<template>
    <el-card shadow="never" class="user-list-card">
        <template #header>
            <el-row justify="space-between" align="middle" :gutter="12">
                <el-col :xs="24" :sm="10">
                    <el-text tag="b" size="large">账号管理</el-text>
                </el-col>
                <el-col :xs="24" :sm="14">
                    <el-space wrap alignment="center" style="width: 100%; justify-content: flex-end;">
                        <el-input
                            v-model="keyword"
                            clearable
                            placeholder="搜索账号或昵称 (当前页)"
                            style="width: 280px;"
                        />
                        <el-select
                            :model-value="pageInfo.size"
                            style="width: 120px;"
                            @change="handlePageSizeSelect"
                        >
                            <el-option :value="20" label="20 人每页" />
                            <el-option :value="50" label="50 人每页" />
                            <el-option :value="100" label="100 人每页" />
                        </el-select>
                    </el-space>
                </el-col>
            </el-row>
        </template>

        <el-table
            ref="tableRef"
            :data="visibleUserSet"
            v-loading="loading"
            row-key="username"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="48" />
            <el-table-column prop="username" label="用户名" min-width="150" />
            <el-table-column prop="rating" label="Rating分数" width="120" />
            <el-table-column label="创建时间" min-width="180">
                <template #default="{ row }">
                    {{ row.create_time }}
                </template>
            </el-table-column>
            <el-table-column label="角色" width="120" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.user_role === 'admin' ? 'danger' : 'info'">
                        {{ row.user_role === 'admin' ? '管理员' : '普通用户' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="{ row }">
                    <el-space :size="6" wrap>
                        <el-button type="primary" link @click="handleEdit(row.username)">编辑</el-button>
                        <el-button type="danger" link @click="handleDelete(row.username)">删除</el-button>
                    </el-space>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-model:current-page="pageInfo.page"
            v-model:page-size="pageInfo.size"
            :page-sizes="[20, 50, 100]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="bottom-pagination"
        />
    </el-card>
</template>

<style scoped>
.user-list-card {
    margin: 16px;
}

.bottom-pagination {
    margin-top: 16px;
    justify-content: flex-end;
}
</style>
