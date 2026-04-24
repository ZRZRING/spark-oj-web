<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { View, Hide } from '@element-plus/icons-vue'
import {
    PROVIDERS,
    getApiKey,
    setApiKey,
    getProvider,
    getSelectedProviderId,
    setSelectedProviderId,
    getSelectedModel,
    setSelectedModel,
} from '@/utils/ai.ts'

const visible = defineModel<boolean>({ default: false })

const providerId = ref(getSelectedProviderId())
const modelId = ref(getSelectedModel())
const key = ref(getApiKey(providerId.value))
const showKey = ref(false)

const currentProvider = computed(() => getProvider(providerId.value))

const availableModels = computed(() => currentProvider.value.models)

watch(providerId, (id) => {
    const provider = getProvider(id)
    key.value = getApiKey(id)
    if (!provider.models.includes(modelId.value)) {
        modelId.value = provider.models[0]
    }
})

const onSave = () => {
    setApiKey(key.value.trim(), providerId.value)
    setSelectedProviderId(providerId.value)
    setSelectedModel(modelId.value)
    visible.value = false
}
</script>

<template>
    <el-dialog v-model="visible" title="AI 模型设置" width="480px" :close-on-click-modal="false">
        <div class="settings-form">
            <div class="form-item">
                <div class="form-label">供应商</div>
                <el-select v-model="providerId" style="width: 100%">
                    <el-option v-for="p in PROVIDERS" :key="p.id" :label="p.name" :value="p.id" />
                </el-select>
            </div>
            <div class="form-item">
                <div class="form-label">模型</div>
                <el-select v-model="modelId" style="width: 100%">
                    <el-option v-for="m in availableModels" :key="m" :label="m" :value="m" />
                </el-select>
            </div>
            <div class="form-item">
                <div class="form-label">{{ currentProvider.name }} API Key</div>
                <el-input
                    v-model="key"
                    :type="showKey ? 'text' : 'password'"
                    placeholder="请输入 API Key"
                    autocomplete="off"
                >
                    <template #suffix>
                        <el-icon class="toggle-key" @click="showKey = !showKey">
                            <View v-if="showKey" />
                            <Hide v-else />
                        </el-icon>
                    </template>
                </el-input>
            </div>
        </div>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.settings-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-label {
    font-size: 14px;
    color: var(--el-text-color-regular);
    margin-bottom: 8px;
}

.toggle-key {
    cursor: pointer;
}
</style>
