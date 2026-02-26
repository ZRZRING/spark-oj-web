<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { User, Lock, CircleCheck } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user_store.ts'
import type { FormInstance, FormRules } from 'element-plus'
import type { registerReq } from '@/stores/user_type'
import { useRouter } from 'vue-router'
import { ENUM } from '@/config/enum'
import { Notify } from "@/utils/notify.ts";
import { TEXT } from "@/config/zh-cn.ts";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
    if (userStore.isLoggedIn) {
        Notify.error(TEXT.isLoggedIn);
        router.push('/');
    }
})

const checkRePassword = (rule: any, value: any, callback: any) => {
    if (value !== registerForm.password) {
        callback(new Error("两次密码不一致"))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<registerReq>>({
    username: [
        { trigger: 'change', required: true, message: '请输入用户名' },
        {
            trigger: 'blur', min: ENUM.MIN_USERNAME, max: ENUM.MAX_USERNAME,
            message: `长度在 ${ENUM.MIN_USERNAME} 到 ${ENUM.MAX_USERNAME} 个字符`,
        },
    ],
    password: [
        { trigger: 'change', required: true, message: '请输入密码' },
        {
            trigger: 'blur', min: ENUM.MIN_PASSWORD, max: ENUM.MAX_PASSWORD,
            message: `长度在 ${ENUM.MIN_PASSWORD} 到 ${ENUM.MAX_PASSWORD} 个字符`,
        },
    ],
    rePassword: [
        { trigger: 'change', required: true, message: '请再次输入密码' },
        {
            trigger: 'blur', min: ENUM.MIN_PASSWORD, max: ENUM.MAX_PASSWORD,
            message: `长度在 ${ENUM.MIN_PASSWORD} 到 ${ENUM.MAX_PASSWORD} 个字符`,
        },
        { trigger: 'blur', validator: checkRePassword, message: '两次密码不一致' }
    ]
});

const registerForm = reactive<registerReq>({
    username: '',
    password: '',
    rePassword: '',
});

const registerFormRef = ref<FormInstance>();

const loading = ref(false);

const register = async () => {
    if (!registerFormRef.value) return;
    try {
        await registerFormRef.value.validate();
        loading.value = true;
        await userStore.register(registerForm);
        await router.push('/');
        Notify.success(TEXT.registerSuccess)
    } catch (error) {
        if (error instanceof Error) {
            Notify.error(error.message);
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="container">
        <el-card class="card">
            <div class="title">
                <h2>{{ TEXT.registerTitle }}</h2>
            </div>

            <el-form ref="registerFormRef" style="width: 100%" :model="registerForm" :rules="rules" status-icon>
                <el-form-item prop="username">
                    <el-input v-model="registerForm.username" type="text" :placeholder="TEXT.username"
                        :prefix-icon="User" />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="registerForm.password" type="password" :placeholder="TEXT.password"
                        :prefix-icon="Lock" show-password />
                </el-form-item>

                <el-form-item prop="rePassword">
                    <el-input v-model="registerForm.rePassword" type="password" placeholder="重复密码"
                        :prefix-icon="CircleCheck" show-password />
                </el-form-item>

                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="register"
                        style="width: 100%; margin-top: 15px;">
                        注册
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    width: 300px;
    justify-content: center;
}

.title {
    text-align: center;
    color: #409eff;
}
</style>
