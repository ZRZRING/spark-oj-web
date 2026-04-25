<script setup lang="ts">

import { ref, reactive, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { TEXT } from '@/config/zh-cn.ts'
import { Notify } from "@/utils/notify.ts";
import { type loginReq } from "@/api/user.ts";
import { useUserStore } from "@/stores/user.ts";
import { MAX_PASSWORD, MAX_USERNAME, MIN_PASSWORD, MIN_USERNAME } from "@/utils/consts.ts";

const router = useRouter();
const userStore = useUserStore();

const rules = reactive<FormRules<loginReq>>({
    username: [
        { trigger: 'change', required: true, message: TEXT.usernameRequired },
        {
            trigger: 'blur', min: MIN_USERNAME, max: MAX_USERNAME,
            message: TEXT.lengthRange(MIN_USERNAME, MAX_USERNAME),
        },
    ],
    password: [
        { trigger: 'change', required: true, message: TEXT.passwordRequired },
        {
            trigger: 'blur', min: MIN_PASSWORD, max: MAX_PASSWORD,
            message: TEXT.lengthRange(MIN_PASSWORD, MAX_PASSWORD),
        },
    ],
});

const loginForm = reactive<loginReq>({
    username: '',
    password: '',
});

const loginFormRef = ref<FormInstance>();

const loading = ref(false);

const login = async () => {
    if (!loginFormRef.value) return;
    try {
        await loginFormRef.value.validate();
        loading.value = true;
        await userStore.login(loginForm);
        await router.push('/');
        Notify.success(TEXT.loginSuccess);
    } catch (error) {
        if (error instanceof Error) {
            Notify.error(error.message);
        }
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    /**
     * 这里应该还是会出现现在已存在的问题
     * 比如把一个人账号封禁了以后，他没法退出登录，也没法重新登录别的账号
     */
    if (userStore.isLoggedIn) {
        ElNotification({ type: 'error', message: TEXT.isLoggedIn });
        router.push('/');
    }
})

</script>

<template>
    <div class="container">
        <el-card class="card">
            <div class="title">
                <h2>{{ TEXT.loginTitle }}</h2>
            </div>

            <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="rules" status-icon>
                <el-form-item class="username" prop="username">
                    <el-input v-model="loginForm.username" type="text" :placeholder="TEXT.username"
                        :prefix-icon="User" />
                </el-form-item>

                <el-form-item class="password" prop="password">
                    <el-input v-model="loginForm.password" type="password" :placeholder="TEXT.password"
                        :prefix-icon="Lock" show-password />
                </el-form-item>

                <el-form-item>
                    <el-button class="button" :loading="loading" type="primary" @click="login">{{ TEXT.loginButton }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    width: 300px;
}

.title {
    text-align: center;
    color: #409eff;
}

.button {
    width: 100%;
    margin-top: 15px;
}
</style>
