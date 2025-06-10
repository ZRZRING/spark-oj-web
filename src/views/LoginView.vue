<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import type { loginReq } from '@/stores/types/login'
import { useRouter } from 'vue-router'
import { userConst } from '@/stores/const'

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  if (userStore.token) {
    ElNotification({
      type: 'error',
      message: '您已经登录了'
    });
    router.push('/');
  }
})

const rules = reactive<FormRules<loginReq>>({
  username: [
    {
      trigger: 'change', required: true,
      message: '请输入用户名',
    },
    {
      trigger: 'blur', min: userConst.min_unm, max: userConst.max_unm,
      message: `长度在 ${userConst.min_unm} 到 ${userConst.max_unm} 个字符`,
    },
  ],
  password: [
    {
      trigger: 'change', required: true,
      message: '请输入密码',
    },
    {
      trigger: 'blur', min: userConst.min_pwd, max: userConst.max_pwd,
      message: `长度在 ${userConst.min_pwd} 到 ${userConst.max_pwd} 个字符`,
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
    await userStore.userLogin(loginForm);
    router.push('/');
    ElNotification({
      type: 'success',
      message: '登录成功'
    });
  } catch (error) {
    if (!(error instanceof Error)) return;
    ElNotification({
      type: 'error',
      message: error.message
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <el-card class="card">
      <div class="title">
        <h2>用户登录</h2>
      </div>

      <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="rules" status-icon>
        <el-form-item class="username" prop="username">
          <el-input v-model="loginForm.username" type="text" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>

        <el-form-item class="password" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" :prefix-icon="Lock" show-password />
        </el-form-item>

        <el-form-item>
          <el-button class="button" :loading="loading" type="primary" @click="login">
            登录
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
