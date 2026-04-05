<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="not-found">
        <div class="content">
            <div class="error-code">404</div>
            <div class="error-text">页面未找到</div>
            <div class="error-desc">抱歉，您访问的页面不存在或已被移除</div>
            <el-button type="primary" @click="goHome">返回首页</el-button>
        </div>
    </div>
</template>

<style scoped>
.not-found {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
    text-align: center;
    color: #fff;
}

.error-code {
    font-size: 120px;
    font-weight: 700;
    line-height: 1;
    text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
    animation: float 3s ease-in-out infinite;
}

.error-text {
    font-size: 32px;
    font-weight: 500;
    margin: 20px 0 10px;
}

.error-desc {
    font-size: 16px;
    opacity: 0.8;
    margin-bottom: 30px;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}
</style>
