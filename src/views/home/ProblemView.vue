<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DOMPurify from 'dompurify';
import type {problemDetailReq} from "@/stores/problem.ts";

const route = useRoute();
const problemId = computed(() => String(route.params.pid ?? 'P1000'));

// 题目基本信息
const problemInfo = ref<problemDetailReq>({
    pid: 'P1000',
    title: 'A + B Problem',
    timeLimit: 1000,
    memoryLimit: 1024,
    total: 10988,
    accepted: 4954,
    difficulty: '1',
    uploader: 'Macesuted',
    text: '<p>A + B Problem</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>',
    type: '传统题',
    tag: ['传统题'],
});

const safeProblemText = computed(() => DOMPurify.sanitize(problemInfo.value.text));

const loadProblem = async (pid: string) => {
    problemInfo.value = {
        ...problemInfo.value,
        pid,
    };
};

watch(problemId, (pid) => {
    void loadProblem(pid);
}, { immediate: true });

const discussionCount = ref(4);
const solutionCount = ref(185);

const relatedContests = ref([
    { id: 1, name: '[LZOI] Round - 01 Div. 2' },
    { id: 2, name: '[LZOI] Round - 01 Div. 1' },
]);

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
    <el-row :gutter="16" style="padding: 16px;">
        <el-col :xs="24" :sm="24" :md="17" :lg="18">
            <el-space direction="vertical" fill :size="16" style="width: 100%;">
                <el-card>
                    <template #header>
                        <el-text tag="b">#{{ problemInfo.pid }}. {{ problemInfo.title }}</el-text>
                    </template>
                    <el-descriptions :column="2" border size="small">
                        <el-descriptions-item label="题目ID">{{ problemInfo.pid }}</el-descriptions-item>
                        <el-descriptions-item label="上传者">{{ problemInfo.uploader }}</el-descriptions-item>
                        <el-descriptions-item label="时间限制">{{ problemInfo.timeLimit }} ms</el-descriptions-item>
                        <el-descriptions-item label="内存限制">{{ problemInfo.memoryLimit }} MB</el-descriptions-item>
                        <el-descriptions-item label="尝试次数">{{ problemInfo.total }}</el-descriptions-item>
                        <el-descriptions-item label="通过次数">{{ problemInfo.accepted }}</el-descriptions-item>
                        <el-descriptions-item label="难度">{{ problemInfo.difficulty }}</el-descriptions-item>
                        <el-descriptions-item label="题目类型">{{ problemInfo.type }}</el-descriptions-item>
                    </el-descriptions>
                    <el-space wrap style="margin-top: 12px;">
                        <el-tag v-for="item in problemInfo.tag" :key="item">{{ item }}</el-tag>
                    </el-space>
                </el-card>

                <el-card>
                    <template #header>
                        <el-text tag="b">题面</el-text>
                    </template>
                    <div v-html="safeProblemText"></div>
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

        <el-col :xs="24" :sm="24" :md="7" :lg="6">
            <el-space direction="vertical" fill :size="16" style="width: 100%;">
                <el-card>
                    <template #header>
                        <el-text tag="b">导航</el-text>
                    </template>
                    <el-space direction="vertical" :size="8" fill>
                        <el-link type="primary" :underline="false">讨论 ({{ discussionCount }})</el-link>
                        <el-link type="primary" :underline="false">题解 ({{ solutionCount }})</el-link>
                        <el-link type="primary" :underline="false">文件</el-link>
                        <el-link type="primary" :underline="false">统计</el-link>
                        <el-link type="primary" :underline="false">复制</el-link>
                    </el-space>
                </el-card>

                <el-card>
                    <template #header>
                        <el-text tag="b">相关比赛</el-text>
                    </template>
                    <el-space direction="vertical" :size="8" fill>
                        <el-link
                            v-for="contest in relatedContests"
                            :key="contest.id"
                            type="primary"
                            :underline="false"
                        >
                            {{ contest.name }}
                        </el-link>
                    </el-space>
                </el-card>
            </el-space>
        </el-col>
    </el-row>
</template>
