<script setup lang="ts">

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
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 22px;
}

.filter-controls {
    display: flex;
    align-items: center;
    gap: 15px;
}
</style>
