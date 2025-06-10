<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { User, Lock, CircleCheck } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { FormInstance, FormRules } from 'element-plus'
import type { registerReq } from '@/stores/types/register'
import { useRouter } from 'vue-router'
import { userConst } from '@/stores/const'

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  if (userStore.token) {
    ElNotification({
      type: 'error',
      message: '您不需要注册'
    });
    router.push('/');
  }
})

const checkRepassword = (rule: any, value: any, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<registerReq>>({
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
  repassword: [
    {
      trigger: 'change', required: true,
      message: '请再次输入密码',
    },
    {
      trigger: 'blur', min: userConst.min_pwd, max: userConst.max_pwd,
      message: `长度在 ${userConst.min_pwd} 到 ${userConst.max_pwd} 个字符`,
    },
    {
      trigger: 'blur', validator: checkRepassword,
      message: '两次密码不一致'
    }
  ]
});

const registerForm = reactive<registerReq>({
  username: '',
  password: '',
  repassword: '',
});

const registerFormRef = ref<FormInstance>();

const loading = ref(false);

const register = async () => {
  if (!registerFormRef.value) return;
  try {
    await registerFormRef.value.validate();
    loading.value = true;
    await userStore.userRegister(registerForm);
    router.push('/');
    ElNotification({
      type: 'success',
      message: '注册成功'
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
        <h2>用户注册</h2>
      </div>

      <el-form ref="registerFormRef" style="width: 100%" :model="registerForm" :rules="rules" status-icon>
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" type="text" placeholder="用户名" :prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="密码" :prefix-icon="Lock"
            show-password />
        </el-form-item>

        <el-form-item prop="repassword">
          <el-input v-model="registerForm.repassword" type="repassword" placeholder="重复密码" :prefix-icon="CircleCheck"
            show-password />
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" type="primary" @click="register" style="width: 100%; margin-top: 15px;">
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
