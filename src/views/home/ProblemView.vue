<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { type problemDetail, useProblemStore } from '@/stores/problem.ts';
import { getJudgeTypeLabel } from '@/utils/enum.ts';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';

const route = useRoute();
const problemStore = useProblemStore();
const problemId = computed(() => String(route.params.pid ?? '1000'));

const problemInfo = ref<problemDetail | null>(null);

const loading = ref(false);
const judgeTypeLabel = computed(() => {
    const judgeTypeValue = Number(problemInfo.value?.judgeType ?? 0);
    return getJudgeTypeLabel(Number.isNaN(judgeTypeValue) ? 0 : judgeTypeValue);
});

const loadProblem = async (pid: string) => {
    loading.value = true;
    try {
        const detail = await problemStore.getProblemDetail({ pid });
        problemInfo.value = {
            ...detail,
            pid,
            judgeType: detail.judgeType,
            rating: detail.rating,
        };
    } catch (error) {
        problemInfo.value = null;
        ElMessage.error(error instanceof Error ? error.message : '题目加载失败');
    } finally {
        loading.value = false;
    }
};

watch(problemId, (pid) => {
    void loadProblem(pid);
}, { immediate: true });

const activeTab = ref<string>('cpp');
const code = ref<string>('');
const submitCode = async () => {
    if (!code.value) {
        ElMessage.error('请输入代码');
        return;
    }
    ElMessage.success('提交成功');
};
</script>

<template>
    <el-row style="padding: 16px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-space direction="vertical" fill :size="16" style="width: 100%;">
                <el-card v-loading="loading">
                    <template #header>
                        <el-text tag="b">#{{ problemInfo?.pid ?? problemId }}. {{ problemInfo?.title ?? '加载中...' }}</el-text>
                    </template>
                    <el-descriptions :column="4" border size="small">
                        <el-descriptions-item label="时间限制">{{ problemInfo?.timeLimit ?? '-' }} ms</el-descriptions-item>
                        <el-descriptions-item label="内存限制">{{ problemInfo?.memoryLimit ?? '-' }} MB</el-descriptions-item>
                        <el-descriptions-item label="难度">{{ problemInfo?.rating ?? '-' }}</el-descriptions-item>
                        <el-descriptions-item label="题目类型">{{ judgeTypeLabel }}</el-descriptions-item>
                    </el-descriptions>
                </el-card>

                <el-card>
                    <template #header>
                        <el-text tag="b">题面</el-text>
                    </template>
                    <MarkdownRenderer :content="problemInfo?.content ?? ''" />
                </el-card>

                <el-card>
                    <template #header>
                        <el-text tag="b">提交代码</el-text>
                    </template>
                    <el-tabs v-model="activeTab" type="card">
                        <el-tab-pane label="C++" name="cpp" />
                        <el-tab-pane label="Java" name="java" />
                        <el-tab-pane label="Python" name="python" />
                    </el-tabs>
                    <el-input
                        v-model="code"
                        type="textarea"
                        :autosize="{ minRows: 10, maxRows: 100 }"
                        placeholder="请输入代码"
                    />
                    <el-space style="margin-top: 12px;">
                        <el-button type="danger" plain>进入在线编程模式 (Alt+E)</el-button>
                        <el-button type="primary" @click="submitCode">提交</el-button>
                    </el-space>
                </el-card>
            </el-space>
        </el-col>
    </el-row>
</template>
