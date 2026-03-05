<script setup lang="ts">
import type { pageInfoReq } from '@/stores/type'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { usePagedList } from '@/composables/usePagedList'
import { computed, ref } from 'vue'
import { type getProblemsData, type problem, useProblemStore } from '@/stores/problem.ts'
import { getJudgeTypeLabel } from '@/utils/enum.ts'
import type { TableInstance } from 'element-plus'

const router = useRouter()
const problemStore = useProblemStore()

const {
    request: pageInfo,
    items: adminProblemset,
    total,
    loading,
    handleSizeChange,
    handleCurrentChange,
} = usePagedList<pageInfoReq, getProblemsData, problem>({
    initialRequest: {
        page: 1,
        size: 50,
    },
    fetcher: (request) => problemStore.getProblems(request),
    selectItems: (data) => data.problems,
    selectTotal: (data) => data.total,
})

const tableRef = ref<TableInstance>()
const selectedRows = ref<problem[]>([])
const keyword = ref('')

const visibleProblemSet = computed(() => {
    const keywordText = keyword.value.trim().toLowerCase()
    if (!keywordText) {
        return adminProblemset.value
    }
    return adminProblemset.value.filter((item) => {
        return item.pid.toLowerCase().includes(keywordText)
            || item.title.toLowerCase().includes(keywordText)
    })
})

const handleSelectionChange = (rows: problem[]) => {
    selectedRows.value = rows
}

const handleSelectAll = () => {
    tableRef.value?.toggleAllSelection()
}

const handleCancelSelect = () => {
    tableRef.value?.clearSelection()
}

const handleCreate = () => {
    router.push('/admin/problem/create')
}

const handleEdit = (pid: string) => {
    router.push(`/admin/problem/${pid}/edit`)
}

const handleTestData = (pid: string) => {
    ElNotification({ type: 'warning', message: `测试数据管理 ${pid} 功能暂未开放` })
}

const handleDelete = (pid: string) => {
    ElNotification({ type: 'warning', message: `删除题目 ${pid} 功能暂未开放` })
}

const handleToggleVisible = (pid: string, visible: boolean) => {
    ElNotification({
        type: 'warning',
        message: `题目 ${pid} ${visible ? '前台可见' : '前台隐藏'} 功能暂未开放`,
    })
}

const handlePageSizeSelect = (value: string | number) => {
    handleSizeChange(Number(value))
}

const handleVisibleSwitchChange = (pid: string, value: string | number | boolean) => {
    handleToggleVisible(pid, Boolean(value))
}
</script>

<template>
    <el-card shadow="never" class="problem-list-card">
        <template #header>
            <el-row justify="space-between" align="middle" :gutter="12">
                <el-col :xs="24" :sm="10">
                    <el-text tag="b" size="large">问题管理</el-text>
                </el-col>
                <el-col :xs="24" :sm="14">
                    <el-space wrap alignment="center" style="width: 100%; justify-content: flex-end;">
                        <el-input
                            v-model="keyword"
                            clearable
                            placeholder="题目编号 / 标题 / 来源 / 创建人"
                            style="width: 280px;"
                        />
                        <el-select
                            :model-value="pageInfo.size"
                            style="width: 120px;"
                            @change="handlePageSizeSelect"
                        >
                            <el-option :value="20" label="20 题每页" />
                            <el-option :value="50" label="50 题每页" />
                            <el-option :value="100" label="100 题每页" />
                            <el-option :value="200" label="200 题每页" />
                        </el-select>
                        <el-button type="primary" plain @click="handleCreate">新建题目</el-button>
                    </el-space>
                </el-col>
            </el-row>
        </template>

        <el-space wrap alignment="center" class="toolbar-row">
            <el-pagination
                small
                layout="prev, pager, next"
                :current-page="pageInfo.page"
                :page-size="pageInfo.size"
                :total="total"
                @current-change="handleCurrentChange"
            />
            <el-divider direction="vertical" />
            <el-button size="small" @click="handleSelectAll">全选</el-button>
            <el-button size="small" @click="handleCancelSelect">取消</el-button>
            <el-text size="small" type="info">已选 {{ selectedRows.length }} 项</el-text>
        </el-space>

        <el-table
            ref="tableRef"
            :data="visibleProblemSet"
            v-loading="loading"
            row-key="pid"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="48" />
            <el-table-column prop="pid" label="题号" width="90" />
            <el-table-column prop="title" label="题目" min-width="280" />
            <el-table-column label="类型" width="120">
                <template #default="{ row }">
                    {{ getJudgeTypeLabel(row.judgeType) }}
                </template>
            </el-table-column>
            <el-table-column label="AC(人数)/提交" width="140">
                <template #default>
                    -
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="170">
                <template #default>
                    -
                </template>
            </el-table-column>
            <el-table-column label="创建人" width="100">
                <template #default>
                    -
                </template>
            </el-table-column>
            <el-table-column label="前台可见" width="110" align="center">
                <template #default="{ row }">
                    <el-switch
                        :model-value="true"
                        @change="handleVisibleSwitchChange(row.pid, $event)"
                    />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="220">
                <template #default="{ row }">
                    <el-space :size="6" wrap>
                        <el-button type="primary" link @click="handleEdit(row.pid)">编辑</el-button>
                        <el-button type="success" link @click="handleTestData(row.pid)">测试数据</el-button>
                        <el-button type="danger" link @click="handleDelete(row.pid)">删除</el-button>
                    </el-space>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-model:current-page="pageInfo.page"
            v-model:page-size="pageInfo.size"
            :page-sizes="[20, 50, 100, 200]"
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
.problem-list-card {
    margin: 16px;
}

.toolbar-row {
    margin-bottom: 12px;
}

.bottom-pagination {
    margin-top: 16px;
    justify-content: flex-end;
}
</style>
