<script setup lang="ts">
import type { pageInfoReq } from '@/api/type'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { usePagedList } from '@/composables/usePagedList'
import { computed, ref } from 'vue'
import { type getProblemsData, type problem, getProblems, uploadTestcases, getTestcases, deleteTestcase, type testcaseItem } from '@/api/problem.ts'
import type { TableInstance, UploadFile, UploadRawFile } from 'element-plus'

const router = useRouter()

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
    fetcher: (request) => getProblems(request),
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
        return item.problemId.toLowerCase().includes(keywordText)
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

const handleEdit = (problemId: string) => {
    router.push(`/admin/problem/${problemId}/edit`)
}

const testcaseDialogVisible = ref(false)
const testcaseProblemId = ref('')
const testcaseFiles = ref<UploadFile[]>([])
const testcaseUploading = ref(false)
const existingTestcases = ref<testcaseItem[]>([])
const testcaseLoading = ref(false)

const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

const formatIOFile = (name: string): string => {
    return name + '.in/' + name + '.out'
}

const loadExistingTestcases = async () => {
    testcaseLoading.value = true
    try {
        existingTestcases.value = await getTestcases(testcaseProblemId.value)
    } catch {
        existingTestcases.value = []
    } finally {
        testcaseLoading.value = false
    }
}

const handleTestData = (problemId: string) => {
    testcaseProblemId.value = problemId
    testcaseFiles.value = []
    testcaseDialogVisible.value = true
    loadExistingTestcases()
}

const handleDeleteTestcase = async (name: string) => {
    try {
        await deleteTestcase(testcaseProblemId.value, name)
        ElMessage.success(`已删除 ${name}`)
        loadExistingTestcases()
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '删除失败')
    }
}

const handleExceed = () => {
    ElMessage.warning('最多上传 50 个文件')
}

const beforeUpload = (file: UploadRawFile) => {
    const validExt = file.name.endsWith('.in') || file.name.endsWith('.out')
    if (!validExt) {
        ElMessage.error('仅支持 .in 和 .out 文件')
        return false
    }
    return true
}

const handleUploadTestcases = async () => {
    const validFiles = testcaseFiles.value
        .filter(f => f.status !== 'ready' || f.raw)
        .map(f => f.raw!)
        .filter(Boolean)

    if (validFiles.length === 0) {
        ElMessage.warning('请选择测试数据文件')
        return
    }

    testcaseUploading.value = true
    try {
        await uploadTestcases(testcaseProblemId.value, validFiles)
        ElMessage.success('测试数据上传成功')
        testcaseFiles.value = []
        loadExistingTestcases()
    } catch (error) {
        ElMessage.error(error instanceof Error ? error.message : '上传失败')
    } finally {
        testcaseUploading.value = false
    }
}

const handleDelete = (problemId: string) => {
    ElNotification({ type: 'warning', message: `删除题目 ${problemId} 功能暂未开放` })
}

const handleToggleVisible = (problemId: string, visible: boolean) => {
    ElNotification({
        type: 'warning',
        message: `题目 ${problemId} ${visible ? '前台可见' : '前台隐藏'} 功能暂未开放`,
    })
}

const handlePageSizeSelect = (value: string | number) => {
    handleSizeChange(Number(value))
}

const handleVisibleSwitchChange = (problemId: string, value: string | number | boolean) => {
    handleToggleVisible(problemId, Boolean(value))
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
            row-key="problemId"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="48" />
            <el-table-column prop="problemId" label="题号" width="90" />
            <el-table-column prop="title" label="题目" min-width="280" />
            <el-table-column label="类型" width="120">
                <template #default="{ row }">
                    {{ row.judgeType }}
                </template>
            </el-table-column>
            <el-table-column label="通过/提交 (人数)" width="140">
                <template #default="{ row }">
                    {{ row.acceptCount }}/{{ row.submitCount }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="170">
                <template #default="{ row }">
                    {{ row.createTime }}
                </template>
            </el-table-column>
            <el-table-column label="创建人" width="100">
                <template #default="{ row }">
                    {{ row.createBy }}
                </template>
            </el-table-column>
            <el-table-column label="前台可见" width="110" align="center">
                <template #default="{ row }">
                    <el-switch
                        :model-value="true"
                        @change="handleVisibleSwitchChange(row.problemId, $event)"
                    />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="220">
                <template #default="{ row }">
                    <el-space :size="6" wrap>
                        <el-button type="primary" link @click="handleEdit(row.problemId)">编辑</el-button>
                        <el-button type="success" link @click="handleTestData(row.problemId)">测试数据</el-button>
                        <el-button type="danger" link @click="handleDelete(row.problemId)">删除</el-button>
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

    <el-dialog
        v-model="testcaseDialogVisible"
        :title="`测试数据 - 题目 ${testcaseProblemId}`"
        width="620px"
        :close-on-click-modal="false"
    >
        <el-upload
            v-model:file-list="testcaseFiles"
            :auto-upload="false"
            :limit="50"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
            multiple
            drag
        >
            <el-icon style="font-size: 40px; color: #c0c4cc; margin-bottom: 8px;">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z"/></svg>
            </el-icon>
            <div>将 .in / .out 文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
                <div class="el-upload__tip">
                    请上传成对的 .in 和 .out 文件，如 1.in / 1.out, 2.in / 2.out
                </div>
            </template>
        </el-upload>
        <div style="margin-top: 8px;">
            <el-button type="primary" :loading="testcaseUploading" @click="handleUploadTestcases">
                上传
            </el-button>
        </div>

        <el-divider v-if="existingTestcases.length > 0 || testcaseLoading" content-position="left">
            已有测试数据 ({{ existingTestcases.length }} 组)
        </el-divider>
        <el-table
            v-if="existingTestcases.length > 0 || testcaseLoading"
            :data="existingTestcases"
            v-loading="testcaseLoading"
            size="small"
            max-height="300"
        >
            <el-table-column prop="name" label="文件名称">
                <template #default="{ row }">
                    {{ formatIOFile(row.name) }}
                </template>
            </el-table-column>
            <el-table-column label="输入大小" width="100" align="right">
                <template #default="{ row }">
                    {{ formatSize(row.inputSize) }}
                </template>
            </el-table-column>
            <el-table-column label="输出大小" width="100" align="right">
                <template #default="{ row }">
                    {{ formatSize(row.outputSize) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
                <template #default="{ row }">
                    <el-button type="danger" link size="small" @click="handleDeleteTestcase(row.name)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
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
