<template>
  <div class="dataset-container">
    <h1 class="page-title">Datasets</h1>
    <el-row :gutter="20" class="dataset-list">
      <el-col :span="8" v-for="dataset in datasets" :key="dataset.id">
        <el-card class="dataset-card" shadow="hover">
          <div class="card-content">
            <h3 class="dataset-name">{{ dataset.name }}</h3>
            <div class="info-item update-time">
              <span>更新于 {{ dataset.updatedAt }}</span>
            </div>
            <div class="info-item server-info">
              <el-icon><Location /></el-icon>
              <span>{{ dataset.server }}</span>
            </div>
            <div class="tags">
              <el-tag size="small" type="warning" effect="plain">检测</el-tag>
              <el-tag size="small" type="success" effect="plain">私有</el-tag>
            </div>
          </div>
          <div class="card-action">
            <el-button link type="primary">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Location, ArrowRight } from '@element-plus/icons-vue'

// 数据集状态枚举
const DatasetStatus = {
  NOT_EXIST: 'not_exist',
  UP_TO_DATE: 'up_to_date',
  OUTDATED: 'outdated'
}

const drawerVisible = ref(false)
const selectedDataset = ref(null)

const datasets = ref([
  {
    id: 1,
    name: '目标检测数据集',
    updatedAt: '2024-01-18',
    servers: [
      { location: 'Location1', status: DatasetStatus.OUTDATED },
      { location: 'Location2', status: DatasetStatus.UP_TO_DATE },
      { location: 'Location3', status: DatasetStatus.UP_TO_DATE },
      { location: 'Location4', status: DatasetStatus.NOT_EXIST },
      { location: 'Location5', status: DatasetStatus.OUTDATED }
    ]
  }
])

const updateLogs = ref([
  {
    date: '2024-01-18 16:30',
    title: '检测模型优化',
    description: '更新了目标检测的标注规范，提高了小目标的检测准确率'
  },
  {
    date: '2024-01-12 10:15',
    title: '数据集扩充',
    description: '添加了500张复杂场景的图片，增强了模型的泛化能力'
  },
  {
    date: '2024-01-05 14:40',
    title: '初始版本',
    description: '创建检测数据集，完成基础数据的标注工作'
  }
])
</script>

<style scoped>
.dataset-container {
  padding: 20px;
}

.page-title {
  margin: 0 0 24px 0;
  font-size: 32px;
  color: #303133;
  font-weight: 500;
}

.dataset-list {
  margin-top: 20px;
}

.dataset-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  display: flex;
  align-items: stretch;
}

.card-content {
  flex: 1;
  padding: 16px;
}

.dataset-name {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.info-item {
  margin-bottom: 8px;
  color: #909399;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.card-action {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-left: 1px solid #F0F2F5;
}

:deep(.el-card__body) {
  padding: 0;
  display: flex;
}

:deep(.el-tag) {
  border-radius: 4px;
}

:deep(.el-button.is-link) {
  color: #4B5EFF;
}

:deep(.el-button.is-link:hover) {
  color: #6574FF;
}
</style> 