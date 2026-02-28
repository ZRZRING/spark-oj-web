<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()
const contestId = computed(() => String(route.params.cid ?? ''))

</script>

<template>
    <div class="container">
        <el-card class="card">
            <div class="title">
                <h2>比赛 {{ contestId || '未知' }}</h2>
            </div>
        </el-card>
    </div>
</template>

<style scoped></style>
