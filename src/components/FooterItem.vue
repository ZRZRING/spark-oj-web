<script setup lang="ts">

import { onBeforeUnmount, onMounted, ref } from 'vue'

const nowTime = ref<string>("")

const complement = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString()
}

const formateDate = () => {
    const time = new Date()
    const year = time.getFullYear()
    const month = complement(time.getMonth() + 1)
    const day = complement(time.getDate())
    const hour = complement(time.getHours())
    const minute = complement(time.getMinutes())
    const second = complement(time.getSeconds())
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

let timer: any = 0

onMounted(() => {
    timer = setInterval(() => {
        nowTime.value = formateDate()
    }, 1000)

})

onBeforeUnmount(() => {
    clearInterval(timer)
    timer = 0
})

</script>

<template>
    <div class="footer-content">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item id="localtime">{{ nowTime }}</el-breadcrumb-item>
            <el-breadcrumb-item id="introduce">介绍</el-breadcrumb-item>
            <el-breadcrumb-item id="judge_server">判题服务</el-breadcrumb-item>
            <el-breadcrumb-item id="result">判题结果</el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item id="version">Version: 0.1.0</el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb separator="/">
            <el-link href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" :underline="false">鲁ICP备2025166391号</el-link>
        </el-breadcrumb>
    </div>
</template>

<style scoped>
.footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 30px 0;
    background-color: #34393e;
    color: #fff;
    font-size: 13px;
}

.footer-content :deep(.el-breadcrumb__inner),
.footer-content :deep(.el-breadcrumb__inner a),
.footer-content :deep(.el-breadcrumb__inner.is-link) {
    color: #adb5bd !important;
    font-weight: normal !important;
}

.footer-content :deep(.el-breadcrumb__inner:hover),
.footer-content :deep(.el-breadcrumb__inner a:hover),
.footer-content :deep(.el-breadcrumb__inner.is-link:hover) {
    color: #fff !important;
}

.footer-content :deep(.el-breadcrumb__separator) {
    color: #6c757d !important;
}

.footer-content :deep(.el-link) {
    color: #adb5bd !important;
    font-size: 13px;
}

.footer-content :deep(.el-link:hover) {
    color: #fff !important;
}
</style>
