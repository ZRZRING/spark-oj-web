<script setup lang="ts">
import {useRoute} from 'vue-router';
import {computed, ref, watch} from 'vue';
import {type getProfileData, useUserStore} from "@/stores/user.ts";

const route = useRoute();
const userStore = useUserStore();
const username = computed(() => String(route.params.username ?? ''));

const profile = ref<getProfileData | null>(null)

const loadProfile = async (name: string) => {
    if (!name) {
        profile.value = null;
        return;
    }
    try {
        const res = await userStore.getProfile(name);
        profile.value = res;
    } catch (error) {
        console.error('加载用户信息失败:', error)
    }
};

watch(username, (name) => {
    loadProfile(name);
}, {immediate: true})
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
                        <img :src="profile?.avatar" width="128px" height="128px"/>
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
