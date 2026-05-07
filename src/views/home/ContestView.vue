<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { type getContestDetailData, getContestDetail } from '@/api/contest.ts'
import { Notify } from '@/utils/notify.ts'
import ContestSidebar from '@/components/ContestSidebar.vue'
import ContestInfoCard from '@/components/ContestInfoCard.vue'

const route = useRoute()
const contestId = computed(() => String(route.params.contestId ?? ''))
const contest = ref<getContestDetailData | null>(null)
const loading = ref(false)

const loadContest = async (contestId: string) => {
    if (!contestId) return
    loading.value = true
    try {
        contest.value = await getContestDetail(contestId)
    } catch {
        Notify.error('获取比赛信息失败')
    } finally {
        loading.value = false
    }
}

watch(contestId, (contestId) => loadContest(contestId), { immediate: true })
</script>

<template>
    <el-container v-loading="loading" class="contest-container">
        <el-aside width="200px" class="contest-aside">
            <ContestSidebar />
        </el-aside>
        <el-main class="contest-main">
            <el-row :gutter="20">
                <el-col :xs="24" :lg="18">
                    <router-view :contest="contest" />
                </el-col>
                <el-col :xs="24" :lg="6">
                    <ContestInfoCard :contest="contest" :loading="loading" />
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<style scoped>
.contest-container {
    min-height: calc(100vh - 120px);
}

.contest-aside {
    background-color: #fff;
    border-right: 1px solid #e4e7ed;
}

.contest-main {
    padding: 20px;
    background-color: #f5f7fa;
}
</style>
