<script setup lang="ts">
import type { problemDetailReq } from '@/stores/problem_type.ts';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

// 题目基本信息
const problemInfo = ref<problemDetailReq>({
    pid: 'P1000',
    title: 'A + B Problem',
    timeLimit: 1000,
    memoryLimit: 1024,
    total: 10988,
    accepted: 4954,
    difficulty: '1', // 难度，可以根据实际情况用数字或字符串表示
    uploader: 'Macesuted',
    text: '<p>A + B Problem</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>',
    type: '传统题',
    tag: ['传统题'],
});

// 模拟的讨论和题解数量
const discussionCount = ref(4);
const solutionCount = ref(185);

// 模拟的相关比赛数据
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
    <div class="problem-page-container">
        <div class="main-content-area">
            <!-- 标题、题目信息、题目标签 -->
            <el-card class="problem-header-card">
                <template #header>
                    <div class="card-header">
                        <div class="problem-title-section">
                            <h1 class="problem-title">#{{ problemInfo.pid }}.{{ problemInfo.title }}</h1>
                        </div>
                        <div class="problem-stats">
                            <el-tag size="small">ID: {{ problemInfo.pid }}</el-tag>
                            <el-tag size="small">⏰ {{ problemInfo.timeLimit }} ms</el-tag>
                            <el-tag size="small">💾 {{ problemInfo.memoryLimit }} MB</el-tag>
                            <el-tag size="small">尝试: {{ problemInfo.total }}</el-tag>
                            <el-tag size="small">已通过: {{ problemInfo.accepted }}</el-tag>
                            <el-tag size="small">难度: {{ problemInfo.difficulty }}</el-tag>
                            <el-tag size="small">上传者: {{ problemInfo.uploader }}</el-tag>
                        </div>
                    </div>
                </template>
                <div class="problem-stats">
                    <el-tag>传统题</el-tag>
                    <el-tag>系统测试</el-tag>
                </div>
            </el-card>

            <!-- 题面 -->
            <el-card class="problem-section-card">
                <div v-html="problemInfo.text"></div>
            </el-card>
            <!-- 代码提交 -->
            <div>
                <el-tabs v-model="activeTab" type="border-card">
                    <el-tab-pane label="C++" name="cpp"></el-tab-pane>
                    <el-tab-pane label="Java" name="java"></el-tab-pane>
                    <el-tab-pane label="Python" name="python"></el-tab-pane>
                    <el-input v-model="code" :autosize="{ minRows: 10, maxRows: 100 }" type="textarea"
                        placeholder="请输入代码"></el-input>
                </el-tabs>
            </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="right-sidebar-area">
            <el-card>
                <div class="action-buttons-card">
                    <el-button type="danger" plain class="sidebar-action-button">
                        进入在线编程模式 (Alt+E)
                    </el-button>
                    <el-button type="primary" plain class="sidebar-action-button" @click="submitCode">
                        提交
                    </el-button>
                </div>
            </el-card>

            <el-card class="sidebar-card">
                <div class="nav-link-item">
                    <span class="nav-icon">💬</span> 讨论 ({{ discussionCount }})
                </div>
                <div class="nav-link-item">
                    <span class="nav-icon">💡</span> 题解 ({{ solutionCount }})
                </div>
                <div class="nav-link-item">
                    <span class="nav-icon">📄</span> 文件
                </div>
                <div class="nav-link-item">
                    <span class="nav-icon">📊</span> 统计
                </div>
                <div class="nav-link-item">
                    <span class="nav-icon">📋
                    </span> 复制
                </div>
            </el-card>

            <el-card class="sidebar-card ">
                <template #header>
                    <div class="card-title-with-border">
                        <span>相关</span>
                    </div>
                </template>
                <div class="related-content">
                    <p class="related-title">在此比赛中:</p>
                    <div v-for="contest in relatedContests" :key="contest.id" class="related-contest-item">
                        <span class="contest-icon">🏆</span>
                        <el-link type="primary">{{ contest.name }}</el-link>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
/* 整体布局 */
.problem-page-container {
    display: flex;
    /* 使用 Flexbox 布局 */
    padding: 20px 10% 20px 10%;
    background-color: #f0f2f5;
    /* 页面背景色 */
    min-height: calc(100vh - 60px);
    /* 假设顶部有导航栏，减去其高度 */
    align-items: flex-start;
    /* 侧边栏和主内容区顶部对齐 */
    gap: 20px;
    /* 主内容区和侧边栏之间的间距 */
}

.main-content-area {
    flex: 1;
    /* 主内容区占据剩余所有可用空间 */
    /* padding-right: 20px; 已经被 gap 替代 */
}

.right-sidebar-area {
    width: 280px;
    /* 固定侧边栏宽度 */
    flex-shrink: 0;
    /* 防止侧边栏缩小 */
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* 侧边栏卡片之间的间距 */
}

/* --- 卡片通用样式 --- */
.el-card {
    border-radius: 8px;
    /* 圆角 */
    margin-bottom: 20px;
    /* 卡片之间的默认下边距 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    /* 阴影 */
}

/* 最后一个卡片取消下边距 */
.main-content-area>.el-card:last-child,
.right-sidebar-area>.el-card:last-child {
    margin-bottom: 0;
}

/* 卡片头部标题通用样式 */
/* 注意：el-card 的 header 默认有 padding，这里是针对 header 内部内容的样式 */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    /* padding: 10px 0; */
    /* 通常由 el-card 内部处理 */
}

.card-title-with-border {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    border-bottom: 2px solid #409eff;
    /* 蓝色下划线 */
    padding-bottom: 8px;
    /* 下划线与文字的距离 */
    display: inline-block;
    /* 让下划线只在文字下方 */
}

/* --- 题目标题卡片样式 --- */
.problem-header-card .card-header {
    flex-direction: column;
    /* 标题和统计信息垂直排列 */
    align-items: flex-start;
    /* 左对齐 */
    gap: 15px;
    /* 标题和统计信息之间的间距 */
    /* padding-bottom: 0; */
    /* 通常由 el-card 内部处理 */
}

.problem-title-section {
    display: flex;
    align-items: baseline;
    gap: 10px;
}

.problem-title {
    font-size: 1.4rem;

    /* font-weight: bold; */
    color: #646464;
    margin: 0;
}

.problem-stats {
    display: flex;
    flex-wrap: wrap;
    /* 标签过多时换行 */
    gap: 8px;
    /* 标签之间的间距 */
}

.problem-stats .el-tag {
    font-size: 12px;
    height: 24px;
    line-height: 22px;
}

.problem-stats .el-button.el-button--text {
    color: #409eff;
    /* Element Plus 默认蓝色 */
    padding: 0 5px;
    /* 按钮的内边距 */
}

/* --- 侧边栏样式 --- */
.sidebar-card {
    margin-bottom: 20px;
}

.action-buttons-card {
    padding: 20px;
    /* 内部留白 */
    display: flex;
    flex-direction: column;
    gap: 15px;
    /* 按钮之间的间距 */
    align-items: stretch;
    /* 按钮宽度填充 */
    justify-content: center;
    /* 垂直居中对齐按钮（如果存在额外空间） */
    align-items: center;
    /* 水平居中对齐按钮内容（如果按钮宽度不是100%） */
}

.sidebar-action-button {
    width: 100%;
    font-size: 15px;
    font-weight: bold;
    height: 40px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    /* 图标和文字的间距 */
    margin: 0 !important;
}

.nav-link-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    font-size: 15px;
    color: #606266;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.nav-link-item:hover {
    background-color: #f5f7fa;
    color: #409eff;
}

.nav-link-item .nav-icon {
    margin-right: 10px;
    font-size: 16px;
}

.related-content {
    /* padding: 20px; */
    padding-top: 0 !important;
}

.related-title {
    font-size: 14px;
    color: #909399;
    margin-bottom: 10px;
}

.related-contest-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.related-contest-item .contest-icon {
    margin-right: 8px;
    font-size: 16px;
}

.related-contest-item .el-link {
    font-size: 14px;
}
</style>
