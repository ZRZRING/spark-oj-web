<script setup>

</script>

<template>
  <el-card>
    <template #header>
      <div class="header-content">
        <slot name="title"></slot>

        <div class="filter-controls">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot name="content"></slot>
  </el-card>
</template>

<style scoped>
.el-card {
  margin: 20px 30px 20px 30px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  /* font-weight: bold; */
  /* color: #333; */
}
.filter-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  /* 控制右侧内容之间的间距，如果右侧内容是多个项，这个会生效 */
}
</style>
