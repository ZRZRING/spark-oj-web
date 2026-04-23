<script setup lang="ts">
import { ref } from 'vue'
import { getApiKey, setApiKey } from '@/utils/ai.ts'

const visible = defineModel<boolean>({ default: false })

const key = ref(getApiKey())

const onSave = () => {
    setApiKey(key.value.trim())
    visible.value = false
}
</script>

<template>
    <el-dialog v-model="visible" title="设置 DeepSeek API Key" width="480px" :close-on-click-modal="false">
        <el-input
            v-model="key"
            type="password"
            show-password
            placeholder="请输入你的 DeepSeek API Key"
        />
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
        </template>
    </el-dialog>
</template>
