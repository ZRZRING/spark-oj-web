<script setup lang="ts">
import CodeEditor from '@/components/CodeEditor.vue'
import {ref} from 'vue'
import {useUserStore} from '@/stores/user.ts'

const props = defineProps<{
    loading?: boolean
}>()

const emit = defineEmits<{
    submit: [code: string, language: string]
}>()

const userStore = useUserStore()

const activeTab = ref<string>('cpp')
const code = ref<string>('')

const handleSubmit = () => {
    emit('submit', code.value, activeTab.value)
}

defineExpose({
    clearCode: () => {
        code.value = ''
    }
})
</script>

<template>
    <div v-loading="loading">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="C++" name="cpp"/>
            <el-tab-pane label="Java" name="java"/>
            <el-tab-pane label="Python" name="python"/>
        </el-tabs>
        <CodeEditor
            v-model="code"
            :language="activeTab as 'cpp' | 'java' | 'python'"
            :height="520"
            placeholder="请输入代码"
        />
        <el-space style="margin-top: 12px;">
            <el-button
                type="primary"
                :loading="loading"
                :disabled="!userStore.isLoggedIn"
                @click="handleSubmit"
            >
                提交
            </el-button>
        </el-space>
    </div>
</template>