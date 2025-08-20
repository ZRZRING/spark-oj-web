<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Lock } from '@element-plus/icons-vue'
import MainCard from '@/components/MainCard.vue'
import type { contestSetReq } from '@/stores/contest_type'
import type { pageInfo } from '@/stores/page_type'
import { getContestSet } from '@/stores/contest_store'

const pageInfo = ref<pageInfo>({
  page: 1,
  size: 50,
})
const total = ref<number>(0)
const handleSizeChange = (size: number) => {
  pageInfo.value.size = size
  getContestset()
}
const handleCurrentChange = (page: number) => {
  pageInfo.value.page = page
  getContestset()
}
const contestSet = ref<contestSetReq[]>([])
const getContestset = async () => {
  const res = await getContestSet(pageInfo.value)
  contestSet.value = res.contests
  total.value = res.total
}
onMounted(() => {
  getContestset()
})
</script>

<template>
  <MainCard>
    <template #title>
      比赛列表
    </template>
    <template #extra>
      <div>搜索筛选项目</div>
    </template>
    <template #content>
      <div class="contest-list">
        <div class="contest-item">
          <div class="contest-icon">
            <img src="@/assets/contest.png" class="contest-img" />
          </div>
          <div class="contest-detail">
            <div class="contest-title">
              测试比赛1
              <el-icon v-if=true class="lock-icon">
                <Lock />
              </el-icon>
            </div>
            <div class="contest-meta">
              <span class="contest-time">2025-01-01 00:00:00</span>
              <span class="contest-status">7天</span>
              <span class="contest-origin">OI</span>
            </div>
          </div>
          <div class="contest-right-section">
            <span class="contest-ended-tag">Ended</span>
          </div>
        </div>

        <div class="contest-item">
          <div class="contest-icon">
            <img src="@/assets/contest.png" class="contest-img" />
          </div>
          <div class="contest-detail">
            <div class="contest-title">
              <el-link :href="`/contest/1`" style="font-size: large;" :underline="false">测试比赛1</el-link>
            </div>
            <div class="contest-meta">
              <span class="contest-time">2025-01-01 00:00:00</span>
              <span class="contest-status">7天</span>
              <span class="contest-origin">OI</span>
            </div>
          </div>
          <div class="contest-right-section">
            <span class="contest-ended-tag">Ended</span>
          </div>
        </div>

        <div class="contest-item">
          <div class="contest-icon">
            <img src="@/assets/contest.png" class="contest-img" />
          </div>
          <div class="contest-detail">
            <div class="contest-title">测试比赛1</div>
            <div class="contest-meta">
              <span class="contest-time">2025-01-01 00:00:00</span>
              <span class="contest-status">7天</span>
              <span class="contest-origin">OI</span>
            </div>
          </div>
          <div class="contest-right-section">
            <span class="contest-ended-tag">Ended</span>
          </div>
        </div>
      </div>

    </template>
  </MainCard>
  <el-pagination v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.size" :page-sizes="[20, 50, 100, 200]"
    background layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
</template>

<style scoped>
.contest-list {
  padding-top: 10px;
}

.contest-item {
  display: flex;
  align-items: center;
  padding: 30px 0;
  border-bottom: 1px solid #eee;
}

.contest-item:last-child {
  border-bottom: none;
}

.contest-icon {
  margin-right: 30px;
}

.contest-img {
  width: 45px;
  /* 根据图片调整大小 */
  height: 45px;
  object-fit: contain;
}

.contest-details {
  flex-grow: 1;
}

.contest-title {
  font-size: 18px;
  /* font-weight: bold; */
  color: #333;
  display: flex;
  align-items: center;
}

.lock-icon {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  vertical-align: middle;
}

.contest-meta {
  font-size: 13px;
  color: #888;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.contest-time::before {
  content: '📅';
  /* 日历图标 */
  margin-right: 5px;
}

.contest-status::before {
  content: '⏰';
  /* 时钟图标 */
  margin-right: 5px;
  margin-left: 15px;
  /* 时间和状态之间的间距 */
}

.contest-origin {
  margin-left: 15px;
  /* 状态和来源之间的间距 */
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  font-size: 12px;
  color: #666;
}

.contest-right-section {
  margin-left: auto;
  margin-right: 150px;
}

.contest-ended-tag {
  background-color: #fce8e6;
  /* 浅红色背景 */
  color: #d93026;
  /* 深红色文本 */
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}
</style>
