<script setup lang="ts">
import type { pageInfoReq } from '@/api/type'
import { useRouter } from 'vue-router'
import { ElNotification, ElMessageBox } from 'element-plus'
import { usePagedList } from '@/composables/usePagedList'
import { computed, ref } from 'vue'
import { type getContestsData, type contest, getContests } from '@/api/contest.ts'
import { ContestVisibility } from '@/utils/enum.ts'
import type { TableInstance } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const {
    request: pageInfo,
    items: adminContestSet,
    total,
    loading,
    handleSizeChange,
    handleCurrentChange,
} = usePagedList<pageInfoReq, getContestsData, contest>({
    initialRequest: {
        page: 1,
        size: 50,
    },
    fetcher: (request) => getContests(request),
    selectItems: (data) => data.contests,
    selectTotal: (data) => data.total,
})

const tableRef = ref<TableInstance>()
const selectedRows = ref<contest[]>([])
const keyword = ref('')

const visibleContestSet = computed(() => {
    const keywordText = keyword.value.trim().toLowerCase()
    if (!keywordText) {
        return adminContestSet.value
    }
    return adminContestSet.value.filter((item) => {
        return item.contestId.toLowerCase().includes(keywordText)
            || item.title.toLowerCase().includes(keywordText)
    })
})

const handleSelectionChange = (rows: contest[]) => {
    selectedRows.value = rows
}

const handleCreate = () => {
    router.push('/admin/contest/create')
}

const handleEdit = (contestId: string) => {
    router.push(`/admin/contest/${contestId}/edit`)
}

const handleDelete = (contestId: string) => {
    ElMessageBox.confirm('确定要删除这场比赛吗？', '警告', {
        type: 'warning'
    }).then(() => {
        ElNotification({ type: 'warning', message: `删除比赛 ${contestId} 功能暂未开放` })
    }).catch(() => {})
}

const handlePageSizeSelect = (value: string | number) => {
    handleSizeChange(Number(value))
}

const formatTime = (time: string) => {
    if (!time) return '-'
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
    <el-card shadow="never" class="contest-list-card">
        <template #header>
            <el-row justify="space-between" align="middle" :gutter="12">
                <el-col :xs="24" :sm="10">
                    <el-text tag="b" size="large">比赛管理</el-text>
                </el-col>
                <el-col :xs="24" :sm="14">
                    <el-space wrap alignment="center" style="width: 100%; justify-content: flex-end;">
                        <el-input
                            v-model="keyword"
                            clearable
                            placeholder="比赛编号 / 标题"
                            style="width: 280px;"
                        />
                        <el-select
                            :model-value="pageInfo.size"
                            style="width: 120px;"
                            @change="handlePageSizeSelect"
                        >
                            <el-option :value="20" label="20 场每页" />
                            <el-option :value="50" label="50 场每页" />
                            <el-option :value="100" label="100 场每页" />
                        </el-select>
                        <el-button type="primary" plain @click="handleCreate">新建比赛</el-button>
                    </el-space>
                </el-col>
            </el-row>
        </template>

        <el-table
            ref="tableRef"
            :data="visibleContestSet"
            v-loading="loading"
            row-key="contestId"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="48" />
            <el-table-column prop="contestId" label="比赛编号" width="100" />
            <el-table-column prop="title" label="比赛标题" min-width="280" />
            <el-table-column prop="createBy" label="创建者" width="120" />
            <el-table-column label="可见度" width="100" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.visibility === ContestVisibility.Public ? 'success' : 'warning'" size="small">
                        {{ row.visibility }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="训练模式" width="120" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.practice ? 'success' : 'primary'">
                        {{ row.practice ? '是' : '否' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="开始时间" width="180">
                <template #default="{ row }">
                    {{ row.practice ? '-' : formatTime(row.startTime) }}
                </template>
            </el-table-column>
            <el-table-column label="结束时间" width="180">
                <template #default="{ row }">
                    {{ row.practice ? '-' : formatTime(row.endTime) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="{ row }">
                    <el-space :size="6" wrap>
                        <el-button type="primary" link @click="handleEdit(row.contestId)">编辑</el-button>
                        <el-button type="danger" link @click="handleDelete(row.contestId)">删除</el-button>
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
.contest-list-card {
    margin: 16px;
}

.bottom-pagination {
    margin-top: 16px;
    justify-content: flex-end;
}
</style>
