<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox, ElNotification } from 'element-plus';
import { SwitchButton, ArrowDown } from '@element-plus/icons-vue'

const userStore = useUserStore();
const activeName = computed(() => {
  if (route.path === '/') {
    return 'home'
  }
  return route.path.substring(1);
})
const router = useRouter();
const route = useRoute();

const handleLogin = () => {
  if (userStore.token) {
    router.push('/');
  } else {
    router.push('/login');
  }
};

const handleRegister = () => {
  if (userStore.token) {
    router.push('/');
  } else {
    router.push('/register');
  }
};

const handleLogout = () => {
  if (userStore.token) {
    userStore.userLogout();
  } else {
    ElNotification({
      type: 'error',
      message: '您还没有登录'
    });
  }
};

const handleSelect = (key: string) => {
  router.push(`/${key}`);
  (document.activeElement as HTMLElement)?.blur();
}
const onCommand = async (toPath: string | number | object) => {

  if(!userStore.token){
    ElNotification({
      type: 'error',
      message: '您还没有登录'
    });
    return;
  }
  if (toPath === 'logout') {
    await ElMessageBox.confirm('确认退出系统吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    userStore.userLogout();
  } else {
    router.push(`/${toPath}`)
  }
}
</script>

<template>
  <div class="header">
    <el-menu mode="horizontal" class="nav-menu" :default-active="activeName" @select="handleSelect">
      <div class="logo">
        <img src="/spoj.ico" alt="logo" width="32px" height="32px" />
      </div>
      <div class="title">
        <span>程序设计评测平台</span>
      </div>
      <el-menu-item index="home">主页</el-menu-item>
      <el-menu-item index="judge">评测</el-menu-item>
      <el-menu-item index="problemset">题目</el-menu-item>
      <el-menu-item index="contest">比赛</el-menu-item>
    </el-menu>
    <el-row>
      <el-dropdown v-if="userStore.token" placement="bottom-end" @command="onCommand">
        <span class="el-dropdown-link">
          Dropdown List<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人资料</el-dropdown-item>
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item command="admin">后台管理</el-dropdown-item>
            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <el-button round v-if="userStore.token" @click="handleLogout">退出登录</el-button> -->
      <el-button round v-else @click="handleLogin">登录</el-button>
      <el-button round v-if="!userStore.token" @click="handleRegister">注册</el-button>
    </el-row>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: var(--el-box-shadow-light);
}

.logo,
.title {
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.nav-menu {
  flex-grow: 1;
  border-bottom: none;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
