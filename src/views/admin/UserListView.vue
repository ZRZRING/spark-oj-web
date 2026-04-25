<script setup lang="ts">
import type { pageInfoReq } from '@/api/type'
import { useRouter } from 'vue-router'
import { ElNotification, ElMessageBox } from 'element-plus'
import { usePagedList } from '@/composables/usePagedList'
import { computed, ref } from 'vue'
import { type getUsersData, type userItem, getUsers, updateRole } from '@/api/user.ts'
import type { TableInstance } from 'element-plus'

const router = useRouter()

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
    fetcher: (request) => getUsers(request),
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

const handleRoleChange = async (row: userItem, newRole: string) => {
    try {
        await updateRole({ username: row.username, role: newRole })
        ElNotification({ type: 'success', message: `用户 ${row.username} 角色修改成功` })
    } catch (e: any) {
        ElNotification({ type: 'error', message: `用户 ${row.username} 角色修改失败` })
    }
}

const handleBatchRoleChange = async (newRole: string) => {
    if (selectedRows.value.length === 0) {
        ElNotification({ type: 'warning', message: '请先选择用户' })
        return
    }
    
    try {
        await ElMessageBox.confirm(`确定要将选中的 ${selectedRows.value.length} 个用户修改为该角色吗？`, '批量修改', {
            type: 'warning'
        })
    } catch {
        return
    }

    let successCount = 0
    let failCount = 0

    const promises = selectedRows.value.map(row => 
        updateRole({ username: row.username, role: newRole })
            .then(() => {
                row.userRole = newRole
                successCount++
            })
            .catch(() => {
                failCount++
            })
    )

    await Promise.all(promises)

    if (failCount === 0) {
        ElNotification({ type: 'success', message: `批量修改成功，共 ${successCount} 个用户` })
    } else {
        ElNotification({ type: 'warning', message: `批量修改完成，成功 ${successCount} 个，失败 ${failCount} 个` })
    }
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
                        <el-dropdown @command="handleBatchRoleChange">
                            <el-button type="primary" :disabled="selectedRows.length === 0">
                                批量修改角色
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="root">设为 站长 (root)</el-dropdown-item>
                                    <el-dropdown-item command="admin">设为 管理员 (admin)</el-dropdown-item>
                                    <el-dropdown-item command="user">设为 普通用户 (user)</el-dropdown-item>
                                    <el-dropdown-item command="locked">设为 封禁用户 (locked)</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
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
                    {{ row.createTime }}
                </template>
            </el-table-column>
            <el-table-column label="角色" width="160" align="center">
                <template #default="{ row }">
                    <el-select
                        v-model="row.userRole"
                        @change="handleRoleChange(row, $event)"
                        size="small"
                        style="width: 100%;"
                    >
                        <el-option label="站长 (root)" value="root" />
                        <el-option label="管理员 (admin)" value="admin" />
                        <el-option label="普通用户 (user)" value="user" />
                        <el-option label="封禁 (locked)" value="locked" />
                    </el-select>
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
