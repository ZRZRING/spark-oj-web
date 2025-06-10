<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user'
import type { profileReq, userProfile } from "@/stores/types/profile";
import { onMounted, reactive, ref } from 'vue';

const route = useRoute();
const userStore = useUserStore();
const username = route.params.username;

let profile = ref<userProfile | null>(null)

onMounted(async () => {
  try {
    const res = await userStore.userProfile(<profileReq>{ username });
    profile.value = res;
    console.log(profile);
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
})
</script>

<template>
  <div class="container">
    <el-row>
      <el-col :span="12">
        <div class="box">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ username }}</span>
              </div>
            </template>
            <p v-for="(value, key) in profile" :key="key" class="text item">
              {{ key }} : {{ value }}
            </p>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ username }}</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
            <img :src=profile?.avatar width="128px" height="128px"/>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.container {
  padding: 30px;
}

.box {
  padding: 10px;
}
</style>
